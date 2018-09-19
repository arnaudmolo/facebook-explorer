import mysql.connector

def create_connection ():
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        passwd = "root",
        database = "facebook-explorer",
        port = 8889
    )
