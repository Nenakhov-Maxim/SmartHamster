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
        result = []
        for it in self.session.query(Worker):
            result.append(it.surname + ' ' + it.name[:1] + '.' + it.patronymic[:1] + '.')
        return result

    def add_task(self, worker_id: int,
                 text_task: str,
                 status: int = 3,
                 visibility: bool = True,
                 completion_date=datetime.datetime.now(),
                 who_appointed: int = None,
                 whom_is_assigned: int = None,
                 task_group: int = 10,
                 important: bool = False,
                 cooperation_id: int = None):
        new_task = Task(worker_id=worker_id,
                        text_task=text_task,
                        creation_date=datetime.datetime.now(),
                        status=status,
                        visibility=visibility,
                        completion_date=completion_date.replace(hour=23, minute=59),
                        who_appointed_id=who_appointed,
                        whom_is_assigned_id=whom_is_assigned,
                        task_group_id=task_group,
                        important=important,
                        cooperation_id=cooperation_id)
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

    def get_tasks(self, key: str = 'P'):
        result = []
        print(key)
        if key == 'P':
            for it in self.session.query(Task).filter(Task.worker_id == self.login_user):
                parse_task = self.parseTask(it)
                result.append(parse_task)
            return result
        elif key == 'M':
            for it in self.session.query(Task).filter(Task.worker_id == self.login_user):
                if it.completion_date != None and it.completion_date.date() == datetime.datetime.now().date():
                    parse_task = self.parseTask(it)
                    result.append(parse_task)
            return result
        elif key == 'I':
            for it in self.session.query(Task).filter(and_(Task.worker_id == self.login_user,
                                                           Task.important == True)):
                parse_task = self.parseTask(it)
                result.append(parse_task)
            return result
        elif key == 'As':
            for it in self.session.query(Task).filter(and_(Task.worker_id == self.login_user,
                                                           Task.status == 4)):
                parse_task = self.parseTask(it)
                result.append(parse_task)
            return result
        elif key == 'At':
            for it in self.session.query(Task).filter(and_(Task.worker_id == self.login_user,
                                                           Task.status == 2)):
                parse_task = self.parseTask(it)
                result.append(parse_task)
            return result
    def parseTask(self, it):
        who_appointed = ''
        whom_is_assigned = ''
        if it.who_appointed == None:
            who_appointed = 'Нет'
        else:
            who_appointed = f"{it.who_appointed.surname} {it.who_appointed.name[:1]}.{it.who_appointed.patronymic[:1]}."
        if it.whom_is_assigned == None:
            whom_is_assigned = 'Нет'
        else:
            whom_is_assigned = f"{it.whom_is_assigned.surname} {it.whom_is_assigned.name[:1]}.{it.whom_is_assigned.patronymic[:1]}."
        user_name = f"{it.worker.name} {it.worker.surname} {it.worker.patronymic}"
        user_email = it.worker.email
        user_number = it.worker.employee_number
        user_group = it.worker.group.group_name
        user_group_id = it.worker.group.id
        user_id = it.worker.id
        task = [str(it.id), user_name, user_email, user_number, user_group, str(user_group_id), str(user_id),
                str(it.creation_date), str(it.completion_date), it.text_task, it.status,
                str(it.visibility), who_appointed, whom_is_assigned, str(it.task_group), str(it.important)]
        return task

    def get_groups(self):
        result = []
        for it in self.session.query(Taskgroup):
            result.append(str(it))
        return result

    # Обновление данных
    def updating_task_data(self, ID, completion_date, text_task, who_appointed, whom_is_assigned,
                           task_group):

        for it in self.session.query(Worker).filter(Worker.surname == who_appointed.split(' ')[0]):
            who_appointed = it.id
            break
        else:
            who_appointed = None
        for it in self.session.query(Worker).filter(Worker.surname == whom_is_assigned.split(' ')[0]):
            whom_is_assigned = it.id
            for it in self.session.query(Task).filter(Task.id == ID):
                who_appointed = it.worker_id
                if it.status != 2:
                    self.update_status(ID, 2)
                    self.add_task(whom_is_assigned, text_task, 4, who_appointed=who_appointed, cooperation_id=ID)
            break
        else:
            whom_is_assigned = None
        for it in self.session.query(Taskgroup).filter(Taskgroup.group_name == task_group):
            task_group = it.id
            break
        if completion_date == '':
            completion_date = None
        else:
            completion_date = datetime.datetime.strptime(completion_date, '%Y-%m-%d %H:%M')
        self.session.query(Task).filter(Task.id == ID).update(
            {'completion_date': completion_date,
             'text_task': text_task,
             'who_appointed_id': who_appointed,
             'whom_is_assigned_id': whom_is_assigned,
             'task_group_id': task_group})
        self.session.commit()

    def update_important_task(self, ID, value: bool):
        self.session.query(Task).filter(Task.id == ID).update({'important': value})
        self.session.commit()

    def update_status(self, ID, val):
        task = self.session.query(Task).get(ID)
        if task.cooperation_id == None:
            self.session.query(Task).filter(Task.id == ID).update({'status': val})
        else:
            if val not in [1, 4]:
                self.session.query(Task).filter(Task.id == ID).update({'status': val})
                self.update_status(task.cooperation_id, val)
            else:
                match val:
                    case 1:
                        self.session.query(Task).filter(Task.id == ID).update({'status': val})
                        self.update_status(task.cooperation_id, val)
                    case 4:
                        self.session.query(Task).filter(Task.id == ID).update({'status': val})
                        self.update_status(task.cooperation_id, 2)



        '''                          '''
        if val not in [1, 3]:
            self.session.query(Task).filter(Task.id == ID).update({'status': val})
        else:
            task = self.session.query(Task).get(ID)
            if task.cooperation_id != None:
                if val == 1:
                    self.session.query(Task).filter(Task.id == ID).update({'status': val})
                    self.update_status(task.cooperation_id, val)
                elif val == 4:
                    self.session.query(Task).filter(Task.id == ID).update({'status': val})
                    self.update_status(task.cooperation_id, 2)
            else:
                self.session.query(Task).filter(Task.id == ID).update({'status': val})
        self.session.commit()


    def delete_task(self, ID):
        self.session.query(Task).filter(Task.id == ID).update({'visibility': False})
        self.session.commit()

