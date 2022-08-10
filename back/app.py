import os
import datetime
from sqlalchemy import and_, insert
from back.data.tasks import Task
from back.data.workers import Worker
from back.data.workgroup import Workgroup
from back.data.task_group import Taskgroup
from back.data.database import DATABASE_NAME, Session
import back.create_database as db_creater


class StartApp:
    db_is_created = os.path.exists(DATABASE_NAME)
    session = Session()

    def __init__(self):
        if not self.db_is_created:
            db_creater.create_dabase()
            self.login_user = None

    def info_task_group(self):
        for it in self.session.query(Taskgroup):
            print(it)

    def info_work_group(self):
        for it in self.session.query(Workgroup):
            print(it)

    def info_workers(self):
        for it in self.session.query(Worker):
            return str(it).split('/')

    def add_task(self, worker_id: int, text_task: str, status: int, visibility: bool = True, completion_date=None,
                 who_appointed: int = None,
                 whom_is_assigned: int = None, task_group: int = None):
        new_task = Task(worker_id=worker_id, text_task=text_task, creation_date=datetime.datetime.now(), status=status,
                        visibility=visibility, completion_date=completion_date, who_appointed_id=who_appointed,
                        whom_is_assigned_id=whom_is_assigned,
                        task_group_id=task_group)
        self.session.add(new_task)
        self.session.commit()
        return True

    def find_user(self, num_card):
        for it in self.session.query(Worker).filter(
            Worker.employee_number == num_card):
            self.login_user = str(it).split('/')[5]
            return str(it).split('/')
        else:
            return None

    def get_tasks(self):
        result = []
        for it in self.session.query(Task).filter(Task.worker_id == self.login_user):
            result.append(str(it).split('/'))
        return result

    def get_groups(self):
        result = []
        for it in self.session.query(Taskgroup):
            result.append(str(it))
        return result    



# if __name__ == '__main__':
#     app = StartApp()
#     res = app.find_user('32428')
#     app.get_tasks()
    # result = str(app.info_workers()).split(' ')
    # print(result)

    # app.info_task_group()
    # print('*' * 30)
    # app.info_work_group()
    # print('*' * 30)
    # app.info_workers()
    # app.add_task(1, 'Новая задача', 2, task_group=10)
    # app.add_task(1, 'Новая задача2', 3, task_group=10, who_appointed=1, whom_is_assigned=1)

    # db_is_created = os.path.exists(DATABASE_NAME)
    # if not db_is_created:
    #     db_creater.create_dabase()

    # session = Session()
    # for it in session.query(Worker):
    #     print(it)
    # print('*' * 30)
    # for it in session.query(Worker).filter(Worker.id == 1):
    #     print(it)
    # print('*' * 30)
    # for it in session.query(Worker).filter(and_(Worker.id == 1,
    #                                             Worker.name.like('Максим%'))):
    #     print(it)
    # print('*' * 30)
    # for it in session.query(Worker).join(Workgroup).filter(Workgroup.group_name == 'Инженер по наладке и испытаниям'):
    #     print(it)
    # print('*' * 30)
    # for it, gr in session.query(Worker, Workgroup).join(Workgroup):
    #     print(it, gr)
    # print('*' * 30)
    # for it in session.query(Task):
    #     print(it)
    # print('*' * 30)
    # for persona in session.query(Worker).filter(Worker.surname == 'Иванов'):
    #     print(f'персона - {persona}')
    #     break
    # else:
    #     print('нет')
    # print('*' * 30)
    # # new_task = Task(worker=1, text_task='Добавление из кода', date=datetime.datetime.now())
    # # session.add(new_task)
    # # session.commit()
    # # session.close()
