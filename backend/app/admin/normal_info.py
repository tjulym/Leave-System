#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import admin_api
from .errors import bad_request
from ..models import Degree, Department, WorkaddInfo, HolidayType


@admin_api.route('/degree_infos/')
def get_degree_infos():
    degrees = Degree.query.all()
    info = []
    for degree in degrees:
        info.append(degree.to_json())
    return jsonify({'degree_infos': info})


@admin_api.route('/department_infos/')
def get_department_infos():
    departments = Department.query.all()
    info = []
    for department in departments:
        info.append(department.to_json())
    return jsonify({'department_infos': info})


@admin_api.route('/workadd_type_infos/')
def get_workadd_infos():
    workadd_infos = WorkaddInfo.query.all()
    info = []
    for workadd_info in workadd_infos:
        info.append(workadd_info.to_json())
    return jsonify({'workadd_type_info': info})


@admin_api.route('/holiday_type_infos/')
def get_holiday_type_infos():
    holiday_types = HolidayType.query.all()
    info = []
    for holiday_type in holiday_types:
        info.append(holiday_type.to_json())
    return jsonify({'holiday_type_infos': info})