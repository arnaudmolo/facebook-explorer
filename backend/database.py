from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api

print('init all')

# db_connect_url = sa_url.URL(
#     drivername='postgresql',
#     host= '127.0.0.1',
#     username= 'root',
#     password= 'root',
#     port= 59065,
#     database= 'fbp'
# )

# db_connect_url = sa_url.URL(
#     drivername='mysql+mysqlconnector',
#     host= 'localhost',
#     username= 'root',
#     password= 'root',
#     port= 8889,
#     database= 'fb_json_python_2'
# )

db_connect_url = 'mysql+mysqlconnector://root:root@localhost:8889/fb_json_python_2'

print(db_connect_url)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

api = Api(app)
