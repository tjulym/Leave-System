#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime, timedelta

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import finace_api
from .errors import bad_request, validation_error
from ..models import Admin, Worker, HolidayType, Degree, WorkAdd, WorkaddInfo, Holiday


@finace_api.route('/worker/<string:id>/workadd')
def get_workeradds_info(id):
    worker = Worker.query.get(id)

    if not worker:
        return bad_request('don\'t exit the worker')

    search_begin = request.args.get('search_begin')
    search_end = request.args.get('search_end')

    search_begin = datetime.strptime(search_begin, '%Y-%m-%d') if search_begin else None
    search_end = datetime.strptime(search_end, '%Y-%m-%d') if search_end else None

    query = WorkAdd.query.filter(WorkAdd.worker_id == worker.id, WorkAdd.add_state == 1)

    if search_begin:
        query = query.filter(WorkAdd.add_start >= search_begin)
    if search_end:
        query = query.filter(WorkAdd.add_end <= search_end)

    worker_adds = query.all()

    total_time = timedelta()
    for worker_add in worker_adds:
        total_time += (worker_add.add_end - worker_add.add_start)

    workadd_info = []
    workadd_types = WorkaddInfo.query.all()
    for workadd_type in workadd_types:
        workadd_info.append([workadd_type.id, workadd_type.name, 0])

    for workadd in worker_adds:
        for workadd_one in workadd_info:
            if workadd.type == workadd_one[0]:
                workadd_one[2] += (workadd.add_end - workadd.add_start).total_seconds() / 3600

    info = []
    for workadd in worker_adds:
        info.append(workadd.to_json())

    return jsonify({'total_add(hours)': total_time.total_seconds() / 3600,
                    'specific_add(hours)': workadd_info,
                    'workadds': info})


@finace_api.route('/worker/<string:id>/holiday')
def get_holidays_info(id):
    worker = Worker.query.get(id)

    if not worker:
        return bad_request('don\' exit the worker')

    search_begin = request.args.get('search_begin')
    search_end = request.args.get('search_end')

    search_begin = datetime.strptime(search_begin, '%Y-%m-%d') if search_begin else None
    search_end = datetime.strptime(search_end, '%Y-%m-%d') if search_end else None

    query = Holiday.query.filter(Holiday.worker_id == worker.id, Holiday.apply_ok == 1)

    if search_begin:
        query = query.filter(Holiday.holiday_time_begin >= search_begin)
    if search_end:
        query = query.filter(Holiday.holiday_time_end <= search_end)

    holidays = query.all()

    total_time = timedelta()
    for holiday in holidays:
        total_time += (holiday.holiday_time_end - holiday.holiday_time_begin)

    holiday_info = []
    holiday_types = HolidayType.query.all()
    for holiday_type in holiday_types:
        holiday_info.append([holiday_type.id, holiday_type.name, 0])

    for holiday in holidays:
        for holiday_one in holiday_info:
            if holiday.type == holiday_one[0]:
                holiday_one[2] += (holiday.holiday_time_end - holiday.holiday_time_begin).total_seconds() / 3600

    info = []
    for holiday in holidays:
        info.append(holiday.to_json())

    return jsonify({'total_holidays(hours)': total_time.total_seconds() / 3600,
                    'specific_holiday(hours)': holiday_info,
                    'holidays': info})

