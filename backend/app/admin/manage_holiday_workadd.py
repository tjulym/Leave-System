#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import admin_api
from .errors import bad_request, validation_error
from ..models import Admin, Worker, WorkerDegree, Degree, WorkAdd, Holiday, HolidayType, WorkaddInfo


@admin_api.route('/holidays/')
def get_holidays_with_statment():
    search_begin = request.args.get('search_begin')
    search_end = request.args.get('search_end')
    worker_id = request.args.get('worker_id')
    apply_ok = request.args.get('apply_ok')
    apply_state = request.args.get('apply_state')
    apply_over = request.args.get('apply_over')
    apply_end = request.args.get('apply_end')
    holiday_type = request.args.get('holiday_type')

    if apply_ok and apply_ok not in ['0', '1', '-1']:
        return bad_request('apply_ok must in 0, -1, 1')

    if apply_state and apply_state not in ['0', '-1', '1', '2', '3']:
        return bad_request('apply_state must in 0, -1, 1, 2, 3')

    if apply_over and apply_over not in ['0', '1']:
        return bad_request('apply_over must in 0, 1')

    if apply_end and apply_end not in ['0', '1']:
        return bad_request('apply_end must in 0, 1')

    if holiday_type and not HolidayType.query.get(holiday_type):
        return bad_request('holiday_type is wrong')

    search_begin = datetime.strptime(search_begin, '%Y-%m-%d') if search_begin else None
    search_end = datetime.strptime(search_end, '%Y-%m-%d') if search_end else None

    query = Holiday.query

    if search_begin:
        query = query.filter(Holiday.holiday_time_begin >= search_begin)
    if search_end:
        query = query.filter(Holiday.holiday_time_end <= search_end)

    if worker_id:
        query = query.filter(Holiday.worker_id.like('%' + worker_id + '%'))

    if apply_ok:
        query = query.filter(Holiday.apply_ok == int(apply_ok))

    if apply_end:
        query = query.filter(Holiday.apply_end == int(apply_end))

    if apply_over:
        query = query.filter(Holiday.apply_over == int(apply_over))

    if apply_state:
        query = query.filter(Holiday.apply_state == int(apply_state))

    if holiday_type:
        query = query.filter(Holiday.type == int(holiday_type))

    holidays = query.all()

    info = []
    for holiday in holidays:
        info.append(holiday.to_json())
    return jsonify({'holidays': info})


@admin_api.route('/holidays/<int:id>/', methods=['PUT'])
def modify_holiday(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday is None:
        return bad_request("the holiday isn't exit")

    json_holiday = request.json
    holiday_end = json_holiday.get('holiday_end')
    holiday_time_begin = json_holiday.get("holiday_time_begin")
    holiday_time_end = json_holiday.get("holiday_time_end")
    holiday_over = json_holiday.get('holiday_over')
    holiday_reason = json_holiday.get('holiday_reason')
    holiday_type = json_holiday.get('holiday_type')
    holiday_state = json_holiday.get('holiday_state')

    old_holiday_begin = holiday.holiday_time_begin
    old_holiday_end = holiday.holiday_time_end

    holiday.holiday_time_begin = holiday_time_begin if holiday_time_begin else old_holiday_begin
    holiday.holiday_time_end = holiday_time_end if holiday_time_end else old_holiday_end

    add_to_db(holiday)

    if holiday.holiday_time_begin > holiday.holiday_time_end:
        holiday.holiday_time_begin = old_holiday_begin
        holiday.holiday_time_end = old_holiday_end
        add_to_db(holiday)
        return bad_request('begin is latter than end')

    if holiday_reason:
        holiday.reason = holiday_reason

    if holiday_state:
        if holiday_state not in ['0', '-1', '1', '2', '3']:
            return bad_request('holiday_state is wrong')
        else:
            holiday.apply_state = holiday_state

    if holiday_over:
        if holiday_over not in ['0', '1']:
            return bad_request('holiday_over must in 0, 1')
        else:
            holiday.apply_over = holiday_over

    if holiday_type:
        if not HolidayType.query.get(holiday_type):
            return bad_request('the type is wrong')
        else:
            holiday.type = holiday_type

    if holiday_end:
        if holiday_end not in ['0', '1']:
            return bad_request('holiday_end must in 0, 1')
        else:
            holiday.apply_end = holiday_end

    add_to_db(holiday)
    return jsonify({'message': 'your modify worker holiday apply'})


@admin_api.route('/workadds/')
def get_workadds_with_statement():
    search_begin = request.args.get('search_begin')
    search_end = request.args.get('search_end')
    worker_id = request.args.get('worker_id')
    workadd_type = request.args.get('workadd_type')
    workadd_state = request.args.get('workadd_state')

    if workadd_type and not WorkaddInfo.query.get(workadd_type):
        return bad_request('workadd_type is wrong')

    if workadd_state and workadd_state not in ['-1', '0', '1']:
        return bad_request('workadd_state must in -1, 0, 1')

    search_begin = datetime.strptime(search_begin, '%Y-%m-%d') if search_begin else None
    search_end = datetime.strptime(search_end, '%Y-%m-%d') if search_end else None

    query = WorkAdd.query

    if search_begin:
        query = query.filter(WorkAdd.add_start >= search_begin)
    if search_end:
        query = query.filter(WorkAdd.add_end <= search_end)

    if worker_id:
        query = query.filter(WorkAdd.worker_id.like('%' + worker_id + '%'))

    if workadd_type:
        query = query.filter(WorkAdd.type == int(workadd_type))

    if workadd_state:
        query = query.filter(WorkAdd.add_state == int(workadd_state))

    workadds = query.all()

    info = []
    for workadd in workadds:
        info.append(workadd.to_json())
    return jsonify({'workadds': info})


@admin_api.route('/workadds/<int:id>/', methods=['PUT'])
def modify_workadd(id):
    workadd = WorkAdd.query.filter(WorkAdd.id == id).first()

    if workadd is None:
        return bad_request("the workadd isn't exit")

    json_workadd = request.json
    add_start = json_workadd.get('workadd_start')
    add_end = json_workadd.get('workadd_end')
    add_reason = json_workadd.get('workadd_reason')
    add_type = json_workadd.get('workadd_type')
    add_state = json_workadd.get('workadd_state')

    add_end = add_end if add_end else workadd.add_end
    add_start = add_start if add_start else workadd.add_start

    old_end = workadd.add_end
    old_start = workadd.add_start

    workadd.add_start = add_start
    workadd.add_end = add_end

    add_to_db(workadd)

    if workadd.add_start > workadd.add_end:
        workadd.add_end = old_end
        workadd.add_start = old_start
        delete_to_db(workadd)
        return bad_request('the start latter than end')

    if add_reason:
        workadd.add_reason = add_reason

    if add_type:
        if not WorkaddInfo.query.get(add_type):
            return bad_request('type is error')
        workadd.type = add_type

    if add_state:
        if add_state not in ['0', '-1', '1']:
            return bad_request('the add_state must in 0, -1, 1')
        else:
            workadd.add_state = add_state

    add_to_db(workadd)
    return jsonify({'message': 'you modify your workadd'})

