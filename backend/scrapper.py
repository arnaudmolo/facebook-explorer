import json
import os
import mysql.connector
from snaql.factory import Snaql
from datetime import datetime
from operator import itemgetter

root_location = os.path.abspath(os.path.dirname(__file__))
snaql_factory = Snaql(root_location, 'queries')
users_queries = snaql_factory.load_queries('users.sql')
threads_queries = snaql_factory.load_queries('threads.sql')
messages_queries = snaql_factory.load_queries('messages.sql')

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
cursor.execute("DELETE from messages;")
cursor.execute("DELETE from threads;")
cursor.execute("DELETE from userthread;")

def create_user (user):
    create_user_query = users_queries.create_user(**user)
    cursor.execute(
        create_user_query
    )

def register_users (filename, accessor, status):
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
            create_user(user)
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

def own_is_different (data):
    return [
        dict(
            name= data['profile']['name'],
            timestamp= data['profile']['registration_timestamp']
        )
    ]

def findIndex(f, seq):
    """Return first item in sequence where f(item) == True."""
    for index, item in enumerate(seq):
        if f(item): 
            return index

def last_id ():
    cursor.execute('SELECT LAST_INSERT_ID();')
    return cursor.fetchone()[0]

def registerThread (url):
    status = 'unknown'
    with open(url) as f:
        futur_thread = json.load(f)
    thread = dict(
        title = futur_thread.get('title', 'No thread title'),
        is_still_participant = futur_thread['is_still_participant'],
        status = futur_thread['status'],
        thread_type = futur_thread['thread_type'],
        thread_path = futur_thread['thread_path']
    )
    cursor.execute(threads_queries.create_thread(**thread))
    thread_id = last_id()
    messages = futur_thread.get('messages', [])
    users_to_save = []
    messages_to_save = []
    for message in messages:
        user = dict(
            name = message.get('sender_name', 'unknow user'),
            fb_id = 'null',
            timestamp = datetime.now(),
            friendship = status
        )
        try:
            create_user(user)
            user_id = last_id()
            user = dict(
                user,
                id = user_id
            )
        except Exception as error:
            cursor.execute(
                users_queries.find_one_by_name(**user)
            )
            sqluser = cursor.fetchone()
            user = dict(
                user,
                id = itemgetter(0)(sqluser)
            )
        message = dict(
            content = message.get('content', 'Empty Content'),
            timestamp = datetime.now(),
            type = message['type'],
            UserId = user['id'],
            ThreadId = thread_id
        )
        messages_to_save.append(message)
        if (findIndex(lambda u: u['id'] == user['id'], users_to_save) is None):
            users_to_save.append(user)
    if len(users_to_save) > 1:
        cursor.execute(
            threads_queries.create_threads_users(**dict(users = users_to_save, thread_id = thread_id))[:-1]
        )
    if len(messages_to_save) > 1:
        cursor.execute(
            messages_queries.create_messages(**dict(messages = messages_to_save))[:-1]
        )

mypath = './data/messages'
folders = [
    f for f in os.listdir(mypath)
        if (os.path.isdir(os.path.join(mypath, f)) and f != 'stickers_used')
]

register_users(
    './data/profile_information/profile_information.json',
    own_is_different,
    'own'
)
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

for index, file in enumerate(folders):
    registerThread('./data/messages/{0}/message.json'.format(file))
    print('register thread nb ', index + 1, 'on ', len(folders))
    co.commit() 