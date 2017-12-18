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

    def test_find_holiday_type(self):
        one = HolidayType.query.get(1)
        assert one is not None

        hund = HolidayType.query.get(100)
        assert hund is None

    def test_holiday_type_name(self):
        assert  HolidayType.query.get(1).name == "因公请假"

        assert HolidayType.query.get(2).name == "年假"

        assert HolidayType.query.get(3).name == "病假"

        assert HolidayType.query.get(4).name == "事假"

        assert HolidayType.query.get(5).name == "产假"

        assert HolidayType.query.get(6).name == "婚假"

        assert HolidayType.query.get(7).name == "陪产假"

        assert HolidayType.query.get(8).name == "丧假"


