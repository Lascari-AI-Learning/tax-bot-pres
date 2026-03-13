from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime


class Item(BaseModel):
    id: int
    title: str
    description: str | None = None
    owner_id: int
    price: float = 0.0
