#!/usr/bin/env python
# encoding=utf-8

from flask import g, jsonify
from flask_httpauth import HTTPBasicAuth
from ..models import Worker
from . import api
from .errors import unauthorized, forbidden

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(id_or_token, password):
    if password == '':
        g.current_user = Worker.verify_auth_token(id_or_token)
        g.token_used = True
        return g.current_user is not None
    worker = Worker.query.filter_by(id=id_or_token).first()
    if not worker:
        return False
    g.current_user = worker
    g.token_used = False
    return worker.verify_password(password)


@auth.error_handler
def auth_error():
    return unauthorized('Invalid credentials')


@api.before_request
@auth.login_required
def before_request():
    # if not g.current_user.confirmed:
    #     return forbidden('Unconfirmed account')
    pass


@api.route('/token/')
def get_token():
    if g.token_used:
        return unauthorized('Invalid credentials')
    return jsonify({'token': g.current_user.generate_auth_token(
        expiration=3600), 'expiration': 3600})
