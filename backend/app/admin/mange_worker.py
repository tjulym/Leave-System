#!/usr/bin/env python
# encoding=utf-8

from datetime import date

from flask import jsonify, request, g

from app.util import add_to_db, delete_to_db, add_residue, sub_residue
from . import admin_api
from .errors import bad_request, validation_error
from ..models import Admin, Worker, WorkerDegree, Degree


@admin_api.route('/workers/')
def get_worker_info():
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
        workers = Worker.query.filter(1 == 1).all()
        info = []
        for worker in workers:
            info.append(worker.to_json())
        return jsonify({"workers": info})

    try:
        workers = Worker.query.filter(1 == 1).paginate(page=page, per_page=per_page)
    except:
        return jsonify({'workers': []})

    page_nums = workers.pages
    workers_info = workers.items
    if not workers_info:
        workers_info = []
    info = []
    for worker in workers_info:
        info.append(worker.to_json())
    return jsonify({'workers': info,
                    'total_page_num': page_nums})


@admin_api.route('/workers/', methods=['POST'])
def add_worker():
    json_worker = request.json
    id = json_worker.get('worker_id')
    name = json_worker.get('worker_name')
    email = json_worker.get('worker_email')
    address = json_worker.get('worker_address')
    password = json_worker.get('password')

    worker = Worker(id=id, name=name, email=email, address=address, password=password)

    try:
        add_to_db(worker)
    except Exception:
        raise validation_error("your enter same error")

    return jsonify({'message': "add the new worker"})


@admin_api.route('/workers/<string:id>/degree/', methods=["POST"])
def add_degree_to_worker(id):
    json_worker = request.json
    department_id = json_worker.get('degree_department_id')
    degree_id = json_worker.get('degree_degree_id')
    worker_id = id

    worker_degree = WorkerDegree(degree_id=degree_id, department_id=department_id, worker_id=worker_id)

    add_to_db(worker_degree)

    return jsonify({'message': 'your add the degree to worker {}'.format(id)})


@admin_api.route('/workers/<string:id>/degree/<string:department_del>', methods=["DELETE"])
def delete_degree_to_worker(id, department_del):
    department_id = department_del
    worker_id = id

    woker = Worker.query.filter(Worker.id == worker_id).first()

    if not woker:
        return jsonify({'message': 'the user isn\'t exit'})

    worker_degree = WorkerDegree.query.filter(WorkerDegree.worker_id == worker_id,
                                              WorkerDegree.department_id == department_id).first()

    if not worker_degree:
        return jsonify({'message': 'the user not in the department'})

    delete_to_db(worker_degree)

    return jsonify({'message': 'your delete the degree to worker {}'.format(id)})


@admin_api.route('/workers/<string:id>/', methods=['PUT'])
def modify_worker_info(id):
    worker = Worker.query.get(id)

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


@admin_api.route('/workers/<string:uid>/department/<int:did>/', methods=['PUT'])
def modify_worker_degree(uid, did):
    worker_degree = WorkerDegree.query.filter(WorkerDegree.worker_id == uid, WorkerDegree.department_id == did).first()

    if worker_degree is None:
        return bad_request("no exits the woker's degree")

    json_worker = request.json
    degree = json_worker.get('worker_degree_degree')

    if Degree.query.filter(Degree.id == degree).first() is None:
        return bad_request("no exits the degree")

    worker_degree.degree_id = degree
    add_to_db(worker_degree)

    return jsonify({'message': 'your modify the worker degree'})
