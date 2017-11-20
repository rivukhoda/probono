from flask import Flask
import mysql.connector

app = Flask(__name__)
app.config.from_object('settings.DevelopmentConfig')

db_config = {}

db_config['user'] = app.config['DB_USER']
db_config['password'] = app.config['DB_PWD']
db_config['database'] = app.config['DB_NAME']
db_config['host'] = app.config['DB_HOST']
db_config['port'] = app.config['DB_PORT']


cnx = mysql.connector.connect(**db_config)




@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/tasks', methods=['GET'])
def get_tasks():
    return


@app.route('/tasks', methods=['POST'])
def create_task():
    return


@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task():
    return


@app.route('/lists', methods=['GET'])
def get_lists():
    return


@app.route('/lists', methods=['POST'])
def create_list():
    return


@app.route('/lists/<id>', methods=['DELETE'])
def delete_list():
    return


@app.route('/session', methods=['POST'])
def login_user():
    return


@app.route('/session', methods=['DELETE'])
def logout_user():
    return


@app.route('/users', methods=['POST'])
def create_user():
    return


if __name__ == "__main__":
    app.run(threaded=True)
