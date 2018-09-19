import os
import mysql.connector
import json
from flask import request
from flask_restful import Resource
from snaql.factory import Snaql
from operator import itemgetter
from itertools import groupby
from snaql.convertors import guard_date

from database import api, app

def create_connection ():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        passwd = "root",
        database = "fb_json_python_3",
        port = 8889
    )

root_location = os.path.abspath(os.path.dirname(__file__))
snaql_factory = Snaql(root_location, 'queries')
users_queries = snaql_factory.load_queries('users.sql')
threads_queries = snaql_factory.load_queries('threads.sql')
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
        print(
            users_queries.get_one_threads(**dict(
                user_id = user_id
            )))
        cursor.execute(
            users_queries.get_one_threads(**dict(
                user_id = user_id
            ))
        )
        # res = []
        # for row in cursor.fetchall():
        #     print(row)
        # print(res)
        all = cursor.fetchall()
        thread_id_accessor = itemgetter(2)
        final_threads = []

        def countby(f, seq):
            result = {}
            for value in seq: 
                key = f(value)
                if key in result:
                    result[key] += 1
                else: 
                    result[key] = 1
            return result

        for thread_id, grouped_threads in groupby(sorted(all, key=thread_id_accessor), key=thread_id_accessor):
            t2 = list(v for v in grouped_threads)
            thread_messages = [ (message_id, threads_id, message_content, message_date.isoformat(), message_user_id) for (
                users_id,
                users_name,
                threads_id,
                threads_title,
                threads_is_still_participant,
                threads_status,
                threads_thread_type,
                threads_thread_path,
                message_id,
                message_content,
                message_date,
                message_user_id
            ) in sorted(t2, key=lambda t: t[10]) ]
            final_threads.append(
                (
                    thread_id,
                    t2[0][3],
                    t2[0][4],
                    t2[0][5],
                    t2[0][6],
                    t2[0][7],
                    countby(itemgetter(4), thread_messages),
                    thread_messages
                )
            )
        final_threads = sorted(
            final_threads,
            key=lambda item: len(itemgetter(6)(item)),
            reverse=True
        )
        print(all)
        return [
            all[0][0],
            all[0][1],
            final_threads
        ]

api.add_resource(Threads, '/threads')
api.add_resource(Thread, '/threads/<thread_id>')
api.add_resource(Users, '/users')
api.add_resource(User, '/users/<user_id>')

if __name__ == '__main__':
     app.run(port='5002')