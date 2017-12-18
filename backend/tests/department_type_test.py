#!/usr/bin/env python
# encoding=utf-8
1
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
        self.app_context.pop()

    def test_find_department_type(self):
        one = Department.query.get(1)
        assert one is not None

        hund = Department.query.get(100)
        assert hund is None

    def test_department_type_name(self):
        assert Department.query.get(1).name == "工程部"

        assert Department.query.get(2).name == "科研部"

        assert Department.query.get(3).name == "人力资源部"

        assert Department.query.get(4).name == "对外商务部"
