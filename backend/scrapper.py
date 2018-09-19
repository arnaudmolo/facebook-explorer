import json
import os
import mysql.connector
from snaql.factory import Snaql
from datetime import datetime

root_location = os.path.abspath(os.path.dirname(__file__))
snaql_factory = Snaql(root_location, 'queries')
users_queries = snaql_factory.load_queries('users.sql')

def create_connection ():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        passwd = "root",
        database = "fb_json_python_3",
        port = 8889
    )

co = create_connection()
cursor = co.cursor()
cursor.execute("DELETE FROM relations;")
cursor.execute("DELETE from users;")

def register_users (filename, accessor, status):
    # co = create_connection()
    # cursor = co.cursor()
    with open(filename) as file:
        data = json.load(file)
    futur_users = accessor(data)
    for futur_user in futur_users:
        user = dict(
            name = futur_user['name'],
            fb_id = 'null',
            timestamp = datetime.now(),
            friendship = status
        )
        try:
            create_user_query = users_queries.create_user(**user)
            cursor.execute(
                create_user_query
            )
        except:
            cursor.execute(
                users_queries.find_one_by_name(**user)
            )
            sqluser = cursor.fetchone()
            user = dict(
                user,
                user_id = sqluser[0]
            )
        create_relation_query = users_queries.create_relation(**user)
        cursor.execute(
            create_relation_query
        )
    co.commit()

register_users(
    './data/friends/friends_added.json',
    lambda data: data['friends'],
    'friend'
)
register_users(
    './data/friends/received_friend_requests.json',
    lambda data: data['received_requests'],
    'received'
)
register_users(
    './data/friends/rejected_friend_requests.json',
    lambda data: data['rejected_requests'],
    'rejected'
)
register_users(
    './data/friends/removed_friends.json',
    lambda data: data['deleted_friends'],
    'removed'
)
register_users(
    './data/friends/sent_friend_requests.json',
    lambda data: data['sent_requests'],
    'sent'
)
