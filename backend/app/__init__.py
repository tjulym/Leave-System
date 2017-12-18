#!/usr/bin/env python
# encoding=utf-8

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from config import config

db = SQLAlchemy()


def create_app(config_name):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)

    from .api_v1 import api as api_1_0_blueprint
    app.register_blueprint(api_1_0_blueprint, url_prefix='/api/v1.0')

    from .admin import admin_api as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    from .finance import finace_api as finace_blueprint
    app.register_blueprint(finace_blueprint, url_prefix='/finace')

    return app
