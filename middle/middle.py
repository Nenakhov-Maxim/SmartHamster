import eel
import getpass
from back.app import StartApp

app = StartApp()

@eel.expose
def start_app():
    user = app.find_user('32428')  #getpass.getuser() - в идеале через эту функцию!
    if user is None:
        return ['Незарегистрированныйй пользователь', 'Неизвестный Email']
    else:
        tasks = app.get_tasks()
        return user, tasks

@eel.expose
def add_to_db(text):
    result = app.add_task(1, text, 1)
    return result

@eel.expose
def get_groups():
    result = app.get_groups()
    return result
@eel.expose
def update_all_data(ID, creation_date, completion_date, text_task, who_appointed, whom_is_assigned, task_group):
    app.updating_task_data(ID, creation_date, completion_date, text_task, who_appointed, whom_is_assigned, task_group)