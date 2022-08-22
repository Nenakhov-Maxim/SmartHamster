import eel
import getpass
from back.app import StartApp

app = StartApp()

@eel.expose
def start_app(key: str = 'P'):
    user = app.find_user('32428')  #getpass.getuser() - в идеале через эту функцию! #33515, 32428
    if user is None:
        return ['Незарегистрированныйй пользователь', 'Неизвестный Email']
    else:
        tasks = app.get_tasks(key)
        return user, tasks

@eel.expose
def add_to_db(text):
    result = app.add_task(1, text)
    return result

@eel.expose
def get_groups():
    result = app.get_groups()
    return result
@eel.expose
def update_all_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group):
    app.updating_task_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group)

@eel.expose
def update_important(ID, impr):
    app.update_important_task(ID, impr)

@eel.expose
def del_task(ID):
    app.delete_task(ID)

@eel.expose
def get_workers():
    return app.info_workers()

@eel.expose
def update_st(ID, val):
    app.update_status(ID, val)