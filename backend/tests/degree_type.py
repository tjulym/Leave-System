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
        self.app_context.pop()

    def test_find_degree_type(self):
        one = Degree.query.get(1)
        assert one is not None

        hund = Degree.query.get(1000)
        assert hund is None

    def test_degree_type_name(self):
        assert Degree.query.get(1).name == "WORK"

        assert Degree.query.get(2).name == "CHIEF"

        assert Degree.query.get(3).name == "MINISTER"

        assert Degree.query.get(4).name == "Manager"

        assert Degree.query.get(5).name == "CEO"

        assert Degree.query.get(100).name == "Administrator"


