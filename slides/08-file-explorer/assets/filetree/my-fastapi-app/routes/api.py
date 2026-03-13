from fastapi import APIRouter, HTTPException
from models import Item, User

router = APIRouter()

# In-memory store for demo purposes
users: dict[int, User] = {}
items: dict[int, Item] = {}


@router.get("/users")
async def list_users():
    return list(users.values())


@router.post("/users")
async def create_user(user: User):
    users[user.id] = user
    return user


@router.get("/items/{item_id}")
async def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(404, "Item not found")
    return items[item_id]
