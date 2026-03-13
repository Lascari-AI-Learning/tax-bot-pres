# My FastAPI App

A simple REST API built with FastAPI.

## Quick Start

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Endpoints

- `GET /health` — Health check
- `GET /api/users` — List users
- `POST /api/users` — Create user
- `GET /api/items/{id}` — Get item
