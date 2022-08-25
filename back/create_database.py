from back.data.database import create_db, Session
from back.data.tasks import Task
from back.data.workers import Worker
from back.data.workgroup import Workgroup
from back.data.task_group import Taskgroup
from back.data.status import Status
from back.data.сustom_lists import CustomList
import datetime

def create_dabase(load_data: bool =  True):
    create_db()
    if load_data:
        _load_data(Session())


def _load_data(session: Session):

    group1 = Workgroup(group_name='Начальник лаборатории')
    group2 = Workgroup(group_name='Заместитель начальника лаборатории')
    group3 = Workgroup(group_name='Руководитель группы оборудования')
    group4 = Workgroup(group_name='Руководитель группы обеспечения испытаний')
    group5 = Workgroup(group_name='Ведущий инженер группы испытаний')
    group6 = Workgroup(group_name='Инженер-конструктор')
    group7 = Workgroup(group_name='Инженер-лаборант')
    group8 = Workgroup(group_name='Инженер по наладке и испытаниям')
    group9 = Workgroup(group_name='Специалист')
    task_gr1 = Taskgroup(group_name='Экология')
    task_gr2 = Taskgroup(group_name='Охрана труда')
    task_gr3 = Taskgroup(group_name='Административные вопросы')
    task_gr4 = Taskgroup(group_name='Здание')
    task_gr5 = Taskgroup(group_name='Персонал')
    task_gr6 = Taskgroup(group_name='Пожарная охрана')
    task_gr7 = Taskgroup(group_name='Оборудование')
    task_gr8 = Taskgroup(group_name='Оснастка')
    task_gr9 = Taskgroup(group_name='Планы мероприятий')
    task_gr10 = Taskgroup(group_name='Прочее')
    statis_gr1 = Status(status_name='Выполнено')
    statis_gr2 = Status(status_name='Выполняется')
    statis_gr3 = Status(status_name='На контроле')
    statis_gr4 = Status(status_name='Контролируется')
    session.add(group1)
    session.add(group2)
    session.add(group3)
    session.add(group4)
    session.add(group5)
    session.add(group6)
    session.add(group7)
    session.add(group8)
    session.add(group9)
    session.commit()
    session.add(task_gr1)
    session.add(task_gr2)
    session.add(task_gr3)
    session.add(task_gr4)
    session.add(task_gr5)
    session.add(task_gr6)
    session.add(task_gr7)
    session.add(task_gr8)
    session.add(task_gr9)
    session.add(task_gr10)
    session.commit()
    session.add(statis_gr1)
    session.add(statis_gr3)
    session.add(statis_gr2)
    session.add(statis_gr4)
    session.commit()
    worker1 = Worker('USER USER USER'.split(' '), group8.id, False, 'user@imf.ru', '32428')
    worker2 = Worker('TEST TEST TEST'.split(' '), group2.id, False, 'test@imf.ru', '33515')
    session.add(worker1)
    session.add(worker2)
    session.commit()
    custom_list = CustomList(list_name='Мой первый список', worker_id=1)
    session.add(custom_list)
    session.commit()
    # new_task1 = Task(worker_id=worker1.id, text_task='Сделать базу данных', creation_date=datetime.datetime.now(), task_group_id=task_gr10.id)
    # new_task2 = Task(worker_id=worker2.id, text_task='Другая задача', creation_date=datetime.datetime.now(),
    #                 task_group_id=task_gr3.id)
    # session.add(new_task1)
    # session.add(new_task2)
    session.commit()
    session.close()