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

class Threads(Resource):
    def get(self):
        page = request.args.get('page', default = 0, type = int)
        limit = request.args.get('count', default = 50, type = int)
        order = request.args.get('order', default = 'classic')
        co = create_connection()
        cursor = co.cursor()
        # cursor.execute(
        #     users_queries.get_own()
        # )
        # user_id, _, _ = cursor.fetchone()

        cursor.execute(
            threads_queries.get_all(**dict(
                limit = limit,
                offset = page * limit
            ))
        )
        res = cursor.fetchall()
        return res


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