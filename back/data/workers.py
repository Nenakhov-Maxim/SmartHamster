from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class Worker(Base):
    __tablename__ = 'workers'
    id: Column = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    patronymic = Column(String)
    email = Column(String)
    employee_number = Column(String)
    group_id = Column(Integer, ForeignKey('workgroup.id'))
    is_chief = Column(Boolean)
    group = relationship('Workgroup')
    #tasks = relationship('Task')



    def __init__(self, full_name:list[str], group:int, is_chief:bool, email:str, emp_num:str):
        self.name = full_name[1]
        self.surname = full_name[0]
        self.patronymic = full_name[2]
        self.email = email
        self.employee_number = emp_num
        self.group_id = group
        self.is_chief = is_chief

    def __repr__(self):
        info: str = f'{self.surname} {self.name} {self.patronymic}/{self.email}/{self.employee_number}/{self.group}/{self.id}'
        return info

    # def return_data(self):
    #     return [self.surname, self.name, self.patronymic, self.email, self.employee_number, self.group_id, self.is_chief]

