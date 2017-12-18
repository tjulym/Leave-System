#!/usr/bin/env python
# encoding=utf-8
import unittest
from flask import current_app
from app import create_app, db
from app.models import Department, Degree, WorkerDegree, Holiday, Worker, WorkAdd, HolidayType


class BasicsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.drop_all()
        db.create_all()
        Department.insert_departments()
        Degree.insert_degrees()
        HolidayType.insert_holiday_types()

    def tearDown(self):
        # db.session.commit()
        # db.session.remove()
        # db.drop_all()
        self.app_context.pop()

    def test_create_worker(self):
        w = Worker(id='30132180123', name='hss', email='xxx@tju.edu.cn', address='tju',
                   password='123')
        db.session.add(w)
        db.session.commit()


        # test the password
        assert w.verify_password('123')
        assert not w.verify_password('1234')

        # test the token
        token = w.generate_auth_token(expiration=1000)
        ver_w = w.verify_auth_token(token)
        assert ver_w != Worker.query.get('30132180xx')
        assert ver_w == Worker.query.get('30132180123')

        db.session.add(w)
        db.session.commit()

        d = WorkerDegree(worker_id=w.id, department_id=1)
        db.session.add(d)
        db.session.commit()




