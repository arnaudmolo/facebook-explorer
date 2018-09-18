import os
import mysql.connector
import json
from flask import request
from flask_restful import Resource
from snaql.factory import Snaql
from schema import Schema, And, Use, SchemaError
from snaql.convertors import guard_date

from database import api, app

def create_connection ():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        passwd = "root",
        database = "fb_json_python_2",
        port = 8889
    )

root_location = os.path.abspath(os.path.dirname(__file__))
snaql_factory = Snaql(root_location, 'queries')
users_queries = snaql_factory.load_queries('users.sql')
threads_queries = snaql_factory.load_queries('threads.sql')

User = Schema(dict(
    id = And(Use(int)),
    name = Use(str),
    fb_id = And(str)
))

Relation = Schema(dict(
    id = And(Use(int)),
    timestamp = And(Use(guard_date)),
    friendship = And(Use(str)),
    UserId = And(Use(int))
))

user_and_messages = None

class Threads(Resource):
    def get(self):
        global user_and_messages
        page = request.args.get('page', default = 0, type = int)
        limit = request.args.get('count', default = 50, type = int)
        order = request.args.get('order', default = 'classic')
        co = create_connection()
        cursor = co.cursor()
        if user_and_messages is None:
            cursor.execute(
                users_queries.get_own_and_messages()
            )
            user_and_messages = cursor.fetchall()

        map_id_nb_message = {}
        for message in user_and_messages:
            prev_value = map_id_nb_message.get(message[7])
            map_id_nb_message[message[7]] = 0 if prev_value is None else prev_value + 1

        if order == 'own':
            sorted_map_id_thrad = sorted(
                map_id_nb_message.items(),
                key=lambda x: x[1], reverse=True
            )[:10]
            cursor.execute(threads_queries.get_threads_of(**dict(
                threads_ids = [tp[0] for tp in sorted_map_id_thrad]
            )))
            return [
                (id, title, is_still_participant, status, thread_type, thread_path, total, own)
                for (id, title, is_still_participant, status, thread_type, thread_path, total), (_, own) in zip(
                    cursor.fetchall(),
                    sorted_map_id_thrad
                )
            ]

        cursor.execute(
            threads_queries.get_all(**dict(
                limit = limit,
                offset = page * limit
            ))
        )
        return [
            (id, title, is_still_participant, status, thread_type, thread_path, total, map_id_nb_message[id])
            for id, title, is_still_participant, status, thread_type, thread_path, total in cursor.fetchall()
        ]

class Thread(Resource):
    def get(self, thread_id):
        print('thread')

class Users(Resource):
    def get(self):
        co = create_connection()
        cursor = co.cursor()
        cursor.execute(
            users_queries.get_all()
        )
        return [
            (id, name, fb_id, relation_id, date.isoformat(), friendship)
            for (id, name, fb_id, relation_id, date, friendship, _) in cursor.fetchall()
        ]

class User(Resource):
    def get(self, user_id):
        co = create_connection()
        cursor = co.cursor()
        cursor.execute(
            users_queries.get_one(**dict(
                user_id = user_id
            ))
        )
        return list(cursor.fetchone())

api.add_resource(Threads, '/threads')
api.add_resource(Thread, '/threads/<thread_id>')
api.add_resource(Users, '/users')
api.add_resource(User, '/users/<user_id>')

if __name__ == '__main__':
     app.run(port='5002')