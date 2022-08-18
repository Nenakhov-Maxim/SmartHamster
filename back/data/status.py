from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class Status(Base):
    __tablename__ = 'statusgroup'
    id = Column(Integer, primary_key=True)
    status_name = Column(String)
    status = relationship('Task')



    def __repr__(self):
        return f'{self.group_name}/{self.id}'