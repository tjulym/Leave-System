#!/usr/bin/env python
# encoding=utf-8

from app.models import Permission
from app import db
from .exceptions import ValidationError


def check_really_degree(degree):
    if degree.degree_id in [2, 3, 4, 5]:
        degree_id = degree.degree_id
    elif degree.can(Permission.MANAGE_HOLIDAY_ONE):
        degree_id = 2
    elif degree.can(Permission.MANAGE_HOLIDAY_TWO):
        degree_id = 3
    elif degree.can(Permission.MANAGE_HOLIDAY_THREE):
        degree_id = 4
    elif degree.can(Permission.MANAGE_HOLIDAY_FOUR):
        degree_id = 5
    else:
        degree_id = 1

    return degree_id


def add_to_db(model):
    try:
        db.session.add(model)
        db.session.commit()
    except Exception as e:
        print(e)
        raise ValidationError("your data type is wrong, please enter the right type")


def delete_to_db(model):
    try:
        db.session.delete(model)
        db.session.commit()
    except Exception:
        raise ValidationError("your data type is wrong, please enter the right type")


def add_residue(worker, long):
    worker.year_holidays_residue += long
    worker.year_holidays_used -= long


def sub_residue(worker, long):
    worker.year_holidays_residue -= long
    worker.year_holidays_used += long
