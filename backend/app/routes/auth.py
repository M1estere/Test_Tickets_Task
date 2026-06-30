from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app import schemas, auth, crud
from app.database import SessionLocal
import hashlib
import secrets

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    if request.username == auth.ADMIN_USERNAME and request.password == auth.ADMIN_PASSWORD:
        return {
            "access_token": auth.create_admin_token(),
            "token_type": "bearer",
            "username": request.username,
            "is_admin": True
        }
    
    user = crud.get_user_by_username(db, request.username)
    if user and user.password_hash == hash_password(request.password):
        return {
            "access_token": create_user_token(user.id),
            "token_type": "bearer",
            "username": user.username,
            "is_admin": user.is_admin
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    user = crud.create_user(db, user_data)
    return {
        "message": "User created successfully",
        "username": user.username
    }

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_user_token(user_id: int) -> str:
    return f"user_token_{user_id}_{secrets.token_hex(8)}"