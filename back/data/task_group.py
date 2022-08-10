from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class Taskgroup(Base):
    __tablename__ = 'taskgroup'
    id = Column(Integer, primary_key=True)
    group_name = Column(String)
    #task = relationship('Task')



    def __repr__(self):
        return f'{self.group_name}'

