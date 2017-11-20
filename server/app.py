from flask import Flask

app = Flask(__name__)


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


@app.route('/lists', method=['POST'])
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
