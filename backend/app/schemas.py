from pydantic import BaseModel, Field, validator
from datetime import datetime
from enum import Enum
from typing import Optional

class StatusEnum(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class PriorityEnum(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"

class TicketBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    status: StatusEnum = StatusEnum.NEW
    priority: PriorityEnum = PriorityEnum.NORMAL

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None

class Ticket(TicketBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=3)
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        return v

class User(BaseModel):
    id: int
    username: str
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True