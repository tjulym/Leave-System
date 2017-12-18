#!/usr/bin/env python
# encoding=utf-8

from functools import wraps
from flask import g
from .errors import forbidden


def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            degrees_info = g.current_user.degree_infos
            can_examine = False
            for degree_info in degrees_info:
                can_examine |= degree_info.can(permission)
            if not can_examine:
                return forbidden('Insufficient permissions')
            return f(*args, **kwargs)
        return decorated_function
    return decorator
