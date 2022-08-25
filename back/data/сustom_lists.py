from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from back.data.database import Base

class CustomList(Base):
    __tablename__ = 'customlist'
    id = Column(Integer, primary_key=True)
    list_name = Column(String)
    worker_id = Column(Integer, ForeignKey('workers.id'))
    worker = relationship('Worker', foreign_keys=[worker_id])

    def __repr__(self):
        return f'{self.list_name}'