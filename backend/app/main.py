from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import tickets, auth

app = FastAPI(title="Ticket Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(tickets.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Ticket Management API"}

@app.get("/health")
def health():
    return {"status": "ok"}