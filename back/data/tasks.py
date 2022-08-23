from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from back.data.database import Base
from back.data.workers import Worker

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    worker_id = Column(Integer, ForeignKey('workers.id'))
    text_task = Column(String)
    status = Column(String, ForeignKey('statusgroup.id'))
    important = Column(Boolean)
    visibility = Column(Boolean)
    creation_date = Column(TIMESTAMP)
    completion_date = Column(TIMESTAMP)
    who_appointed_id = Column(Integer, ForeignKey('workers.id'))
    whom_is_assigned_id = Column(Integer, ForeignKey('workers.id'))
    task_group_id = Column(Integer, ForeignKey('taskgroup.id'))
    alarm_time = Column(TIMESTAMP)
    is_alarmed = Column(Boolean)
    worker = relationship('Worker', foreign_keys=[worker_id])
    who_appointed = relationship('Worker', foreign_keys=[who_appointed_id])
    whom_is_assigned = relationship('Worker', foreign_keys=[whom_is_assigned_id])
    task_group = relationship('Taskgroup', foreign_keys=[task_group_id])
    cooperation_id = Column(Integer, ForeignKey('tasks.id'))
    cooperation = relationship('Task', foreign_keys=[cooperation_id])


    def __repr__(self):
        return f'{self.id}/{self.worker}/{self.creation_date}/{self.completion_date}/' \
               f'{self.text_task}/{self.status}/{self.visibility}/{self.who_appointed_id}/' \
               f'{self.whom_is_assigned}/' \
               f'{self.task_group}/{self.important}/' \
               f'{self.alarm_time}'


