import mysql.connector
import settings
import pickle

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

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

corpus = []
labels = []

for (description, time_frame) in cursor:
    corpus.append(description)
    labels.append(time_frame)

vectorizer = CountVectorizer(ngram_range=(1, 2), stop_words='english', max_df=1.0)
features_matrix = vectorizer.fit_transform(corpus)

nb_clf = MultinomialNB()
nb_clf.fit(features_matrix, labels)

with open('regressor.pkl', "w") as f:
    pickle.dump(nb_clf, f)

with open('vectorizer.pkl', "w") as f:
    pickle.dump(vectorizer, f)

test = ["Hey, can you help me with my assignment?"]
T = vectorizer.transform(test)
print nb_clf.predict(T)
