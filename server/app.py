from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import mysql.connector

import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)
CORS(app)
app.config.from_object('settings.DevelopmentConfig')


db_config = {}

db_config['user'] = app.config['DB_USER']
db_config['password'] = app.config['DB_PWD']
db_config['database'] = app.config['DB_NAME']
db_config['host'] = app.config['DB_HOST']
db_config['port'] = app.config['DB_PORT']

cnx = mysql.connector.connect(**db_config)
cursor = cnx.cursor(buffered=True)

regressor = ''
with open('regressor.pkl') as f:
    regressor = pickle.load(f)

vectorizer = ''
with open('vectorizer.pkl') as f:
    vectorizer = pickle.load(f)

insert_task = ("INSERT INTO task "
               "(requester, email, description, time_frame, due_date, list_id)"
               " VALUES (%(requester)s, %(email)s, %(description)s, %(time_frame)s, %(due_date)s, %(list_id)s)")
query_tasks = ("SELECT id, requester, email, description, time_frame, due_date FROM task WHERE list_id = %(list_id)s")
update_task = ("UPDATE task SET list_id = NULL WHERE id = %(task_id)s")

query_task = ("SELECT email FROM task WHERE id = %(task_id)s")

insert_user = ("INSERT INTO user (email, password) VALUES (%(email)s, %(password)s)")
query_user = ("SELECT password, id FROM user WHERE email = %(email)s")

insert_list = ("INSERT INTO list (name, user_id) VALUES (%(name)s, %(user_id)s)")
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

    for (id, requester, email, description, time_frame, due_date) in cursor:
        task = {
            "id": id,
            "requester": requester,
            "email": email,
            "description": description,
            "time_frame": time_frame,
            "due_date": due_date
        }

        tasks.append(task)

    return jsonify(status=200, tasks=tasks)


@app.route('/auth', methods=['PUT'])
def validate_task_owner():
    owner_data = request.get_json()
    cursor.execute(query_task, owner_data)
    email = cursor.fetchone()[0]

    if owner_data['email'] == email:
        return jsonify(status=200, message="is a valid owner")
    else:
        return jsonify(status=400, message="is not a valid owner"), 400


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
    (password_in_db, user_id) = cursor.fetchone()

    if (user_data['password'] == password_in_db):
        return jsonify(status=200, message="user signed in successfully", user_id=user_id)
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

    cursor.execute(query_user, user_data)
    user_id = cursor.fetchone()[1]

    return jsonify(status=200, message="user registered successfully", user_id=user_id)

@app.route('/prediction', methods=['GET'])
def predict_etc():
    task = request.args.get('task')

    t = vectorizer.transform([task])
    etc = regressor.predict(t)
    print etc

    return jsonify(status=200, message="prediction made successfully", etc=etc[0])




if __name__ == "__main__":
    app.run(threaded=True)
