#!/usr/bin/env python
# encoding=utf-8

from datetime import date, datetime

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import api
from .errors import bad_request
from ..models import Holiday, WorkAdd, HolidayType, WorkaddInfo


@api.route('/worker/holidays/')
def get_holidays_info():
    page = request.args.get('page')
    per_page = request.args.get('per_page')
    want_all = request.args.get('want_all')

    if not page:
        page = "1"
    if not per_page:
        per_page = "10"

    if not page.isdigit():
        return bad_request('page must be number')
    if not per_page.isdigit():
        return bad_request('per_page must be number')

    page = int(page)
    per_page = int(per_page)

    if want_all:
        holidays = g.current_user.holidays
        info = []
        for holiday in holidays:
            info.append(holiday.to_json())
        return jsonify({"holidays": info})

    try:
        holidays = Holiday.query.filter(Holiday.worker_id == g.current_user.id).paginate(page=page, per_page=per_page)
    except:
        return jsonify({'holidays': []})

    page_nums = holidays.pages
    holiday_info = holidays.items
    if not holiday_info:
        holiday_info = []
    holiday_info = holiday_info[::-1]
    info = []
    for holiday in holiday_info:
        info.append(holiday.to_json())
    return jsonify({'holidays': info,
                    'total_page_num': page_nums})


# not add to document
@api.route('/worker/holidays/<int:id>/')
def get_holiday_info(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()
    if holiday is None:
        return bad_request('no exit the holiday')
    if holiday.worker_id != g.current_user.id:
        return bad_request('you can look other people holiday')

    return jsonify(holiday.to_json())


@api.route('/worker/holidays/', methods=['POST'])
def create_holiday():
    json_holiday = request.json
    holiday_type = json_holiday.get('holiday_type')
    holiday_time_begin = json_holiday.get('holiday_time_begin')
    holiday_time_end = json_holiday.get('holiday_time_end')
    reason = json_holiday.get('holiday_reason')
    worker_id = g.current_user.id

    male = g.current_user.male
    print(male)

    if(male == True and holiday_type == str(HolidayType.query.filter(HolidayType.name == '产假').first().id)):
        return bad_request("男性不能请产假")

    if (male == False and holiday_type == str(HolidayType.query.filter(HolidayType.name == '陪产假').first().id)):
        return bad_request("女性不能请陪产假")

    holiday = Holiday(type=holiday_type, worker_id=worker_id, holiday_time_begin=holiday_time_begin,
                      holiday_time_end=holiday_time_end, apply_time=datetime.now(), reason=reason)

    add_to_db(holiday)

    if holiday.holiday_time_begin > holiday.holiday_time_end:
        delete_to_db(holiday)
        return bad_request('begin is latter than end')

    if holiday.holiday_time_begin <= datetime.now():
        delete_to_db(holiday)
        return bad_request('begin must latter than todays')

    if reason is None or reason == "":
        delete_to_db(holiday)
        return bad_request('you need reason to apply')

    if HolidayType.query.get(holiday_type) is None:
        delete_to_db(holiday)
        return bad_request('the holiday type not exit')

    if holiday.type == 2:
        long = (holiday.holiday_time_end - holiday.holiday_time_begin).days
        if holiday.worker.year_holidays_residue < long:
            delete_to_db(holiday)
            return bad_request("your annual leave nums isn't enough")
        else:
            sub_residue(holiday.worker, long)

    add_to_db(holiday)
    return jsonify({
        'holiday_id': holiday.id
    }), 201


@api.route('/worker/holidays/<int:id>/', methods=['PUT'])
def modify_the_holiday(id):
    holiday = Holiday.query.filter(Holiday.id == id).first()

    if holiday is None:
        return bad_request("the holiday isn't exit")

    if holiday.worker_id != g.current_user.id:
        return bad_request("your can't modify the holiday which is not belong you")

    if holiday.apply_over:
        return bad_request("your can't modify the holiday is over")

    json_holiday = request.json
    holiday_end = json_holiday.get('holiday_end')

    if holiday_end:
        if holiday.apply_ok != 1:
            return bad_request('your can apply to end the holiday maybe in check or apply faily')

        holiday.apply_end = True

        add_to_db(holiday)
        return jsonify({"message": "your apply to end the holiday"})

    if holiday.apply_ok == 1:
        return bad_request("you can't modify the apply ok holiday")

    if holiday.apply_state not in [0, -1] and holiday.apply_ok != -1:
        return bad_request("you can't modify the holiday in check")

    holiday_time_begin = json_holiday.get("holiday_time_begin")
    holiday_time_end = json_holiday.get("holiday_time_end")
    type = json_holiday.get('holiday_type')

    male = g.current_user.male

    if(male == True and type == str(HolidayType.query.filter(HolidayType.name == '产假').first().id)):
        return bad_request("男性不能请产假")

    if(male == False and type == str(HolidayType.query.filter(HolidayType.name == '陪产假').first().id)):
        return bad_request("女性不能请陪产假")

    old_holiday_begin = holiday.holiday_time_begin
    old_holiday_end = holiday.holiday_time_end

    holiday.holiday_time_begin = holiday_time_begin if holiday_time_begin else old_holiday_begin
    holiday.holiday_time_end = holiday_time_end if holiday_time_end else old_holiday_end

    add_to_db(holiday)

    holiday_over = json_holiday.get('holiday_over')

    # cancel the apply holiday
    if holiday_over:
        if holiday.type == 2:
            add_residue(holiday.worker, (old_holiday_end - old_holiday_begin).days)
        holiday.apply_over = True
        add_to_db(holiday)
        return jsonify({'message': 'you cancle your holiday'})

    if holiday.holiday_time_begin < datetime.now():
        holiday.holiday_time_begin = datetime.now()

    add_to_db(holiday)

    if holiday.holiday_time_begin > holiday.holiday_time_end:
        holiday.holiday_time_begin = old_holiday_begin
        holiday.holiday_time_end = old_holiday_end
        add_to_db(holiday)
        return bad_request('begin is latter than end')

    long = (holiday.holiday_time_end - holiday.holiday_time_begin).days
    old_long = (old_holiday_end - old_holiday_begin).days

    if holiday.type == 2:
        if type == '2':
            if holiday.worker.year_holidays_residue + old_long < long:
                holiday.holiday_time_begin = old_holiday_begin
                holiday.holiday_time_end = old_holiday_end
                add_to_db(holiday)
                return bad_request("your annual leave nums isn't enough")
            else:
                add_residue(holiday.worker, old_long)
                sub_residue(holiday.worker, long)
        elif HolidayType.query.get(type):
            # from year to other
            add_residue(holiday.worker, old_long)
    # this mean your change the holiday not year to year
    elif type == '2':
        if holiday.worker.year_holidays_residue < long:
            holiday.holiday_time_begin = holiday_time_begin
            holiday.holiday_time_end = holiday_time_end
            add_to_db(holiday)
            return bad_request("your annual leave nums isn't enough")
        else:
            sub_residue(holiday.worker, long)

    if json_holiday.get('holiday_reason'):
        holiday.reason = json_holiday.get('holiday_reason')

    if HolidayType.query.get(type):
        holiday.type = type

    holiday.apply_ok = 0
    holiday.apply_state = 0

    add_to_db(holiday)
    return jsonify({'message': 'your modify your holiday apply'})


@api.route('/worker/workadds/')
def get_workadds_info():
    page = request.args.get('page')
    per_page = request.args.get('per_page')
    want_all = request.args.get('want_all')

    if not page:
        page = "1"
    if not per_page:
        per_page = "10"

    if not page.isdigit():
        return bad_request('page must be number')
    if not per_page.isdigit():
        return bad_request('per_page must be number')

    page = int(page)
    per_page = int(per_page)

    if want_all:
        workadds = g.current_user.workadds
        info = []
        for workadd in workadds:
            info.append(workadd.to_json())
        return jsonify({"workadds": info})

    try:
        workadds = WorkAdd.query.filter(WorkAdd.worker_id == g.current_user.id).paginate(page=page, per_page=per_page)
    except:
        return jsonify({'workadds': []})

    page_nums = workadds.pages
    workadds_info = workadds.items
    if not workadds_info:
        workadds_info = []
    info = []
    workadds_info = workadds_info[::-1]
    for workadd in workadds_info:
        info.append(workadd.to_json())
    return jsonify({'workadds': info,
                    'total_page_num': page_nums})


@api.route('/worker/workadds/', methods=['POST'])
def create_wordadd():
    json_workadd = request.json
    worker_id = g.current_user.id
    add_start = json_workadd.get('workadd_start')
    add_end = json_workadd.get('workadd_end')
    add_reason = json_workadd.get('workadd_reason')
    add_type = json_workadd.get('workadd_type')

    workadd = WorkAdd(worker_id=worker_id, add_start=add_start, add_end=add_end, add_reason=add_reason,
                      apply_time=datetime.now(), type=add_type)
    add_to_db(workadd)

    if workadd.add_start > workadd.add_end:
        delete_to_db(workadd)
        return bad_request('workadd start laster than end')

    if workadd.add_start <= datetime.now():
        delete_to_db(workadd)
        return bad_request('workadd start laster than now')

    if add_reason is None or add_reason == "":
        delete_to_db(workadd)
        return bad_request('workadd must have reason')

    return jsonify({
        'workadd_id': workadd.id
    }), 201


@api.route('/worker/workadds/<int:id>/', methods=['PUT'])
def modify_the_workadd(id):
    workadd = WorkAdd.query.filter(WorkAdd.id == id).first()

    if workadd is None:
        return bad_request("the workadd isn't exit")

    if workadd.worker_id != g.current_user.id:
        return bad_request("your can't modify the holiday isn't belong you")

    if workadd.add_state == 1 or workadd.add_state == -1:
        return bad_request("your can't modify the workadd is ok or cancel")

    json_workadd = request.json
    add_start = json_workadd.get('workadd_start')
    add_end = json_workadd.get('workadd_end')
    add_reason = json_workadd.get('workadd_reason')
    add_type = json_workadd.get('workadd_type')
    add_over = json_workadd.get('workadd_over')

    if add_over:
        workadd.add_state = -1
        add_to_db(workadd)
        return jsonify({'message': 'you cancel your workadd'})

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

    workadd.add_state = 0

    add_to_db(workadd)
    return jsonify({'message': 'you modify your workadd'})


@api.route('/user/', methods=['PUT'])
def modify_worker_info():
    worker = g.current_user

    if worker is None:
        return bad_request('no exits the worker')

    json_worker = request.json
    name = json_worker.get('worker_name')
    email = json_worker.get('worker_email')
    address = json_worker.get('worker_address')
    password = json_worker.get('worker_password')
    year_holidays_residue = json_worker.get('worker_year_holidays_residue')
    year_holidays_used = json_worker.get('worker_year_holidays_use')
    workAdd_time = json_worker.get('workAdd_time')

    if name:
        worker.name = name

    if email:
        worker.email = email

    if address:
        worker.address = address

    if password:
        worker.password = password

    if year_holidays_used:
        worker.year_holidays_used = year_holidays_used

    if year_holidays_residue:
        worker.year_holidays_residue = year_holidays_residue

    if workAdd_time:
        worker.workAdd_time = workAdd_time

    add_to_db(worker)
    return jsonify({'message': 'you modify the worker info'})


@api.route('/user/', methods=['GET'])
def get_worker_info():
    worker = g.current_user

    if worker is None:
        return bad_request('no exits the worker')

    return jsonify(worker.to_json())
