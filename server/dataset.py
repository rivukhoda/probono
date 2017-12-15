import mysql.connector
import settings
import csv

config = settings.DevelopmentConfig()
db_config = {}

db_config['user'] = config.DB_USER
db_config['password'] = config.DB_PWD
db_config['database'] = config.DB_NAME
db_config['host'] = config.DB_HOST
db_config['port'] = config.DB_PORT

cnx = mysql.connector.connect(**db_config)
cursor = cnx.cursor(buffered=True)

query_task = ("SELECT description, time_frame FROM task")
cursor.execute(query_task)

with open('task_dataset.csv', "w") as csv_file:
    for (description, time_frame) in cursor:
        writer = csv.writer(csv_file, delimiter=',')
        row = [description, time_frame]
        # processed_row = list(map(lambda e: e.encode('ascii', 'ignore').decode('utf-8'), row))
        writer.writerow(row)
