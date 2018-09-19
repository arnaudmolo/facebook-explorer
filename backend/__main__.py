import os
import json
from flask import request
from flask_restful import Resource
from snaql.factory import Snaql
from operator import itemgetter
from itertools import groupby
from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from database import create_connection

def countby(f, seq):
    result = {}
    for value in seq: 
        key = f(value)
        if key in result:
            result[key] += 1
        else:
            result[key] = 1
    return result

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

root_location = os.path.abspath(os.path.dirname(__file__))
snaql_factory = Snaql(root_location, 'queries')
users_queries = snaql_factory.load_queries('users.sql')
threads_queries = snaql_factory.load_queries('threads.sql')
own_messages = None

class Threads(Resource):
    def get(self):
        global own_messages
        page = request.args.get('page', default = 0, type = int)
        limit = request.args.get('count', default = 50, type = int)
        order = request.args.get('order', default = 'classic')
        co = create_connection()
        cursor = co.cursor()

        if own_messages is None:
            cursor.execute(
                users_queries.get_own_and_messages()
            )
            own_messages = cursor.fetchall()
        
        map_id_nb_message = countby(itemgetter(7), own_messages)

        if order == 'own':

            top_map_id_thrad = sorted(
                map_id_nb_message.items(),
                key=itemgetter(1),
                reverse=True
            )[:limit]

            cursor.execute(threads_queries.get_threads_in(**dict(
                threads_ids = map(itemgetter(0), top_map_id_thrad)
            )))

            return [
                (id, title, is_still_participant, status, thread_type, thread_path, total, own)
                for (id, title, is_still_participant, status, thread_type, thread_path, total), (_, own) in zip(
                    cursor.fetchall(),
                    top_map_id_thrad
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

        # All messages from all threads the user is in.
        cursor.execute(
            users_queries.get_one_threads(**dict(
                user_id = user_id
            ))
        )
        rows = cursor.fetchall()
        final_threads = []

        thread_id_accessor = itemgetter(2)
        message_user_accessor = itemgetter(4)

        for thread_id, grouped_threads in groupby(sorted(rows, key = thread_id_accessor), key = thread_id_accessor):
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
            ) in sorted(t2, key = itemgetter(10)) ] # format and order by date of the messages.
            final_threads.append(
                (
                    thread_id, # thread id
                    t2[0][3], # title
                    t2[0][4], # is_still_participant
                    t2[0][5], # status
                    t2[0][6], # thread_type
                    t2[0][7], # thread_path
                    countby(message_user_accessor, thread_messages), # meta
                    thread_messages # messages
                )
            )
        return [
            rows[0][0],
            rows[0][1],
            sorted(
                final_threads,
                key=lambda item: len(itemgetter(7)(item)), # Order by most messages.
                reverse=True
            )
        ]

api.add_resource(Threads, '/threads')
api.add_resource(Thread, '/threads/<thread_id>')
api.add_resource(Users, '/users')
api.add_resource(User, '/users/<user_id>')

if __name__ == '__main__':
     app.run(port='5002')