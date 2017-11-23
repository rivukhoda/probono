from flask import Flask, request, Response, jsonify
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
cursor = cnx.cursor()

insert_task = ("INSERT INTO task "
               "(requester, email, description, time_frame, due_date, list_id)"
               " VALUES (%(requester)s, %(email)s, %(description)s, %(time_frame)s, %(due_date)s, %(list_id)s)")
query_tasks = ("SELECT requester, email, description, time_frame, due_date FROM task WHERE list_id = %(list_id)s")
update_task = ("UPDATE task SET list_id = NULL WHERE id = %(task_id)s")

insert_user = ("INSERT INTO user (email, password) VALUES (%(email)s, %(PASSWORD)s)")
query_user = ("SELECT password FROM user WHERE email = %(email)s")

insert_list = ("INSERT INTO list (name, user_id) VALUES (%(NAME)s, %(user_id)s)")
query_lists = ("SELECT name, id FROM list WHERE user_id = %(user_id)s")
update_list = ("UPDATE list SET user_id = NULL WHERE id = %(list_id)s")


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/tasks', methods=['GET'])
def get_tasks():
    value = request.args.get('list_id')
    list_id = {"list_id": value}
    cursor.execute(query_tasks, list_id)
    tasks = []

    for (requester, email, description, time_frame, due_date) in cursor:
        task = {
            "requester": requester,
            "email": email,
            "description": description,
            "time_frame": time_frame,
            "due_date": due_date
        }

        tasks.append(task)

    return jsonify(status=200, tasks=tasks)


@app.route('/tasks', methods=['POST'])
def create_task():
    task_data = request.get_json()
    cursor.execute(insert_task, task_data)
    cnx.commit()
    return jsonify(status=200, message="task added successfully")


@app.route('/tasks/<id>', methods=['DELETE'])
def remove_task(id):
    task_data = {"task_id": id}
    cursor.execute(update_task, task_data)
    cnx.commit()
    return jsonify(status=200, message="task removed successfully")


@app.route('/lists', methods=['GET'])
def get_lists():
    value = request.args.get('id')
    user_id = {"user_id": value}
    cursor.execute(query_lists, user_id)
    lists = []

    for (name, id) in cursor:
        todo_list = {"name": name, "id": id}
        lists.append(todo_list)

    return jsonify(status=200, lists=lists)


@app.route('/lists', methods=['POST'])
def create_list():
    list_data = request.get_json()
    cursor.execute(insert_list, list_data)
    cnx.commit()
    return jsonify(status=200, message="list created successfully")


@app.route('/lists/<id>', methods=['DELETE'])
def remove_list(id):
    list_data = {"list_id": id}
    cursor.execute(update_list, list_data)
    cnx.commit()
    return jsonify(status=200, message="list removed successfully")


@app.route('/session', methods=['POST'])
def login_user():
    user_data = request.get_json()
    cursor.execute(query_user, user_data)
    password_in_db = cursor.fetchone()[0]

    if (user_data['password'] == password_in_db):
        return jsonify(status=200, message="user signed in successfully")
    else:
        return jsonify(status=400, message="user credentials are incorrect or do not exist")


@app.route('/session', methods=['DELETE'])
def logout_user():
    return jsonify(status=200, message="user logged out successfully")


@app.route('/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    cursor.execute(insert_user, user_data)
    cnx.commit()
    return jsonify(status=200, message="user registered successfully")


if __name__ == "__main__":
    app.run(threaded=True)
