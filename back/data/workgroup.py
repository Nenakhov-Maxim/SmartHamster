from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class Workgroup(Base):
    __tablename__ = 'workgroup'
    id = Column(Integer, primary_key=True)
    group_name = Column(String)
    #workers = relationship('Worker')



    def __repr__(self):
        return f'{self.group_name}/{self.id}'

