from fastapi import FastAPI
from routes.api import router

app = FastAPI(
    title="My FastAPI App",
    version="1.0.0",
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
