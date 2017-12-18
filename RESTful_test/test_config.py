base_url = 'http://127.0.0.1:5000/api/v1.0'

get_token_url = base_url + '/token'

# normal
holidays_url = base_url + '/worker/holidays'
workadds_url = base_url + '/worker/workadds'

# examine
examine_holidays_url = base_url + '/examine/holidays'
examine_workadds_url = base_url + '/examine/workadds'
examine_holidays_check = examine_holidays_url + '/{}/check'
examine_holidays_over = examine_holidays_url + '/{}/over'

admin = ('3013218065', '123')
test_user1 = ('30132180xx', '123')
test_user2 = ('3013218000', '123')
