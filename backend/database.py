import mysql.connector

def create_connection ():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        passwd = "root",
        database = "fb_json_python_3",
        port = 8889
    )
