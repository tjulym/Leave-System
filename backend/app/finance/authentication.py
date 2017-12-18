#!/usr/bin/env python
# encoding=utf-8

from flask import g, jsonify
from flask_httpauth import HTTPBasicAuth
from ..models import Admin
from . import finace_api
from .errors import unauthorized, forbidden

finace = HTTPBasicAuth()


@finace.verify_password
def verify_password(id_or_token, password):
    if password == '':
        g.current_admin = Admin.verify_auth_token(id_or_token)
        g.token_admin_used = True
        return g.current_admin is not None
    admin = Admin.query.filter_by(id=id_or_token).first()
    if not admin:
        return False
    g.current_admin = admin
    g.token_admin_used = False
    return admin.verify_password(password)


@finace.error_handler
def auth_error():
    return unauthorized('Invalid credentials')


@finace_api.before_request
@finace.login_required
def before_request():
    # if not g.current_user.confirmed:
    #     return forbidden('Unconfirmed account')
    pass


@finace_api.route('/token/')
def get_token():
    if g.token_admin_used:
        return unauthorized('Invalid credentials')
    return jsonify({'token': g.current_admin.generate_auth_token(
        expiration=3600), 'expiration': 3600})
