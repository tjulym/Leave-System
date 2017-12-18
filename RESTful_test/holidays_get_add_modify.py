#!/usr/bin/env python
# encoding=utf-8

import requests

from test_config import *


def get_token(auth):
    r = requests.get(get_token_url, auth=auth)
    return r.json().get('token')


def get_holidays(token):
    r = requests.get(holidays_url, auth=(token, ''))
    return r


def add_holiday(token, data):
    r = requests.post(holidays_url, auth=(token, ''), json=data)
    return r


def modify_holiday(token, data, num):
    r = requests.put(holidays_url + '/' + str(num), auth=(token, ''), json=data)
    return r

# get the token
token = get_token(test_user1)
get_infos = get_holidays(token)
print(get_infos.json())

# add a new holidays
data = {
        "holiday_type": "1",
        "holiday_time_begin": "2016-10-1",
        "holiday_time_end": "2016-10-6",
        "holiday_reason": "123"
}
add_infos = add_holiday(token, data)
print(add_infos.json())

# modify the num just add
num = add_infos.json().get('holiday_id')
data = {
    "holiday_reason": "just haha",
    "holiday_begin_time": "2016-10-1",
    "holiday_end_time": "2016-10-20",
    "holiday_type": "3",
    "holiday_over": "1"
}
modify_infos = modify_holiday(token, data, num)
print(modify_infos.json())
