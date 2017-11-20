import os


class Config(object):
    DEBUG = False
    TESTING = False
    DATABASE_URI = ''


class ProductionConfig(Config):
    DATABASE_URI = ''


class DevelopmentConfig(Config):
    DEBUG = True
    DB_NAME = os.environ['DB_NAME']
    DB_USER = os.environ['DB_USER']
    DB_PWD = os.environ['DB_PWD']
    DB_HOST = os.environ['DB_HOST']
    DB_PORT = os.environ['DB_PORT']


class TestingConfig(Config):
    TESTING = True
