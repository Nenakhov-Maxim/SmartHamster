from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class Status(Base):
    __tablename__ = 'statusgroup'
    id = Column(Integer, primary_key=True)
    group_name = Column(String)
    status = relationship('Task')



    def __repr__(self):
        return f'Группа: {self.group_name}, id: {self.id}'