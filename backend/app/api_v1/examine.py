#!/usr/bin/env python
# encoding=utf-8

import datetime

from flask import jsonify, request, g

from app.util import check_really_degree, add_to_db
from . import api
from .decorators import permission_required
from .errors import bad_request
from ..models import Worker, WorkerDegree, Holiday, WorkAdd, Permission


@api.route('/examine/holidays/')
@permission_required(Permission.MANAGE_WORK)
def get_examine_holidays_info():
    degree_infos = g.current_user.degree_infos
    info = []
    want_all = request.args.get('want_all')
    if want_all:
        for degree in degree_infos:
            if degree.degree_id == 1:
                continue

            degree_id = check_really_degree(degree)

            followers_degree_info = WorkerDegree.query.filter(WorkerDegree.degree_id < degree_id,
                                                              WorkerDegree.department_id == degree.department_id).all()
            for follower_degree_info in followers_degree_info:
                # because the request don't think multi-department is need, so write is ugly
                # followers is one people
                followers = Worker.query.filter(Worker.id == follower_degree_info.worker_id).all()
                for follower in followers:
                    holidays = follower.holidays
                    for holiday in holidays:
                        long = holiday.holiday_time_end - holiday.holiday_time_begin
                        if follower_degree_info.degree_id == degree_id -1:
                            info.append(holiday)
                            continue

                        if follower_degree_info.degree_id == degree_id -2 and long > datetime.timedelta(days=6):
                            info.append(holiday)
                            continue

                        if follower_degree_info.degree_id == degree_id -3 and long > datetime.timedelta(days=9):
                            info.append(holiday)
                            continue
    else:
        for degree in degree_infos:
            if degree.degree_id == 1:
                continue

            degree_id = check_really_degree(degree)

            followers_degree_info = WorkerDegree.query.filter(WorkerDegree.degree_id < degree_id,
                                      WorkerDegree.department_id == degree.department_id).all()
            for follower_degree_info in followers_degree_info:
                # because the request don't think multi-department is need, so write is ugly
                # followers is one people
                followers = Worker.query.filter(Worker.id == follower_degree_info.worker_id).all()
                for follower in followers:
                    holidays = follower.holidays
                    for holiday in holidays:
                        # filter the holiday is over. or not in check: not allow, allow. or in cancel

                        if holiday.apply_over or holiday.apply_ok == -1 or holiday.apply_state == -1:
                            continue

                        if holiday.apply_ok == 1 and holiday.apply_end and follower_degree_info.degree_id == degree_id -1:
                            info.append(holiday)
                            continue

                        if holiday.apply_ok == 1:
                            continue

                        long = holiday.holiday_time_end - holiday.holiday_time_begin

                        # if long <= datetime.timedelta(days=3) and \
                        #                 follower_degree_info.degree_id == degree_id - 1:
                        #         info.append(holiday)
                        #         continue

                        if follower_degree_info.degree_id == degree_id - 1 and holiday.apply_state == 0:
                                info.append(holiday)
                                continue

                        if datetime.timedelta(days=3) < long <= datetime.timedelta(days=9) and \
                            follower_degree_info.degree_id == degree_id - 2 and \
                            holiday.apply_state == 1:
                            info.append(holiday)
                            continue

                        if long > datetime.timedelta(days=9) and \
                                        follower_degree_info.degree_id == degree_id - 2 and \
                                        holiday.apply_state == 1:
                            info.append(holiday)
                            continue

                        if long > datetime.timedelta(days=9) and \
                            follower_degree_info.degree_id == degree_id -3 and\
                            holiday.apply_state == 2:
                            info.append(holiday)
                            continue
    jsons = []
    if info:
        info = info[::-1]
    for holiday in info:
        jsons.append(holiday.to_json())
    return jsonify({"holidays": jsons})


@api.route('/examine/workadds/')
@permission_required(Permission.MANAGE_WORK)
def get_examine_workadds_info():
    degree_infos = g.current_user.degree_infos
    info = []
    want_all = request.args.get('want_all')
    for degree in degree_infos:
        if degree.degree_id == 1:
            continue

        degree_id = check_really_degree(degree)

        followers_degree_info = WorkerDegree.query.filter(WorkerDegree.degree_id == degree_id - 1,
                                                          WorkerDegree.department_id == degree.department_id).all()
        for follower_degree_info in followers_degree_info:
            followers = Worker.query.filter(Worker.id == follower_degree_info.worker_id).all()
            for follower in followers:
                workadds = follower.workadds
                for workadd in workadds:
                    if not want_all:
                        if workadd.add_state != 0:
                            continue
                    info.append(workadd)

    jsons = []

    if info:
        info = info[::-1]
    for workadd in info:
        jsons.append(workadd.to_json())
    return jsonify({"workadds": jsons})


@api.route('/examine/workadds/<int:id>/', methods=['PUT'])
@permission_required(Permission.MANAGE_WORK)
def examine_workadd(id):
    json_holiday = request.json
    workadd_ok = json_holiday.get('workadd_ok')

    workadd = WorkAdd.query.filter(WorkAdd.id == id).first()

    if workadd_ok not in ['-1', '1']:
        return bad_request('please set the examine')

    if workadd is None:
        return bad_request("don't exit the examine")

    if workadd.add_state != 0:
        return bad_request('the workadd is examine over')

    current_worker_department = []
    for current_degree in g.current_user.degree_infos:
        current_worker_department.append(current_degree.department_id)

    for workadd_degree in workadd.worker.degree_infos:
        if workadd_degree.department_id not in current_worker_department:
            continue

        workadd_degree_id = check_really_degree(workadd_degree)
        current_degree = WorkerDegree.query.filter(WorkerDegree.worker_id == g.current_user.id,
                                  WorkerDegree.department_id == workadd_degree.department_id).first()
        current_degree_id = check_really_degree(current_degree)

        if workadd_degree_id == current_degree_id - 1:
            workadd.add_state = workadd_ok
            if workadd_ok == '1':
                workadd.worker.workAdd_time += (workadd.add_end - workadd.add_start).total_seconds() / 3600
                # print(type(workadd.add_end - workadd.add_start).days)
            add_to_db(workadd)
            return jsonify({
                "message": "examine ok"
            })

    return bad_request("your can't examine the workadd")


@api.route('/examine/holidays/<int:id>/check/', methods=['PUT'])
@permission_required(Permission.MANAGE_WORK)
def examine_check_holiday(id):
    json_holiday = request.json
    holiday_examine_ok = json_holiday.get('holiday_ok')

    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday_examine_ok not in ['-1', '1']:
        return bad_request("don't examine the holiday")

    if holiday is None:
        return bad_request("don't exit the holiday")

    if holiday.apply_state == -1:
        return bad_request("the applyer cancel the holiday")

    if holiday.apply_ok != 0 or holiday.apply_over or holiday.apply_end:
        return bad_request("holiday not in check")

    current_worker_department = []
    for current_degree in g.current_user.degree_infos:
        current_worker_department.append(current_degree.department_id)

    long = holiday.holiday_time_end - holiday.holiday_time_begin

    for holiday_degree in holiday.worker.degree_infos:
        if holiday_degree.department_id not in current_worker_department:
            continue

        holiday_degree_id = check_really_degree(holiday_degree)
        current_degree = WorkerDegree.query.filter(WorkerDegree.worker_id == g.current_user.id,
                                  WorkerDegree.department_id == holiday_degree.department_id).first()
        current_degree_id = check_really_degree(current_degree)

        if current_degree_id - 1 == holiday_degree_id and holiday.apply_state == 0:
            holiday.apply_state = 1
            holiday.apply_ok = holiday_examine_ok if long <= datetime.timedelta(days=3) else 0
            holiday.apply_ok = holiday.apply_ok if holiday_examine_ok == '1' else holiday_examine_ok
            add_to_db(holiday)
            return jsonify({
                "message": "examine ok"
            })

        if current_degree_id - 2 == holiday_degree_id and holiday.apply_state == 1 and long > datetime.timedelta(days=3):
            holiday.apply_state = 2
            holiday.apply_ok = holiday_examine_ok if datetime.timedelta(days=3) < long <= datetime.timedelta(days=9) else 0
            holiday.apply_ok = holiday.apply_ok if holiday_examine_ok == '1' else holiday_examine_ok
            add_to_db(holiday)
            return jsonify({
                "message": "examine ok"
            })

        if long > datetime.timedelta(days=9) and current_degree_id - 3 == holiday_degree_id and \
                        holiday.apply_state == 2:
            holiday.apply_state = 3
            holiday.apply_ok = holiday_examine_ok
            add_to_db(holiday)
            return jsonify({
                "message": "examine ok"
            })

    return bad_request("your can't examine the holidays")


@api.route('/examine/holidays/<int:id>/over/', methods=['PUT'])
@permission_required(Permission.MANAGE_WORK)
def examine_over_holiday(id):
    json_holiday = request.json
    holiday_examine_over = json_holiday.get('holiday_over')

    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday is None:
        return bad_request("don't exit the holiday")

    if holiday.apply_over:
        return bad_request("this holiday is over")

    if not holiday.apply_end:
        return bad_request("holiday isn't over and wait to check over")

    current_worker_department = []
    for current_degree in g.current_user.degree_infos:
        current_worker_department.append(current_degree.department_id)

    for holiday_degree in holiday.worker.degree_infos:
        if holiday_degree.department_id not in current_worker_department:
            continue

        holiday_degree_id = check_really_degree(holiday_degree)
        current_degree = WorkerDegree.query.filter(WorkerDegree.worker_id == g.current_user.id,
                                  WorkerDegree.department_id == holiday_degree.department_id).first()
        current_degree_id = check_really_degree(current_degree)

        if current_degree_id - 1 == holiday_degree_id:
            holiday.apply_end = True
            holiday.apply_over = True
            holiday.end_time = datetime.datetime.now()
            add_to_db(holiday)
            return jsonify({
                'message': 'your examine over the holiday'
            })

    return bad_request("your can't examine the holidays")
