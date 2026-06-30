from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, case
from app import models, schemas
from datetime import datetime
from typing import Optional, Tuple
import hashlib

def create_ticket(db: Session, ticket: schemas.TicketCreate) -> models.Ticket:
    db_ticket = models.Ticket(**ticket.model_dump())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket(db: Session, ticket_id: int) -> Optional[models.Ticket]:
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()

def get_tickets(
    db: Session,
    status: Optional[schemas.StatusEnum] = None,
    priority: Optional[schemas.PriorityEnum] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    per_page: int = 10
) -> Tuple[list[models.Ticket], int]:
    query = db.query(models.Ticket)
    
    if status:
        query = query.filter(models.Ticket.status == status)
    if priority:
        query = query.filter(models.Ticket.priority == priority)
    
    if search:
        search_filter = or_(
            models.Ticket.title.contains(search),
            models.Ticket.description.contains(search)
        )
        query = query.filter(search_filter)
    
    total = query.count()
    
    if sort_by == "priority":
        priority_order = {
            schemas.PriorityEnum.HIGH: 0,
            schemas.PriorityEnum.NORMAL: 1,
            schemas.PriorityEnum.LOW: 2
        }
        priority_case = case(
            priority_order,
            value=models.Ticket.priority
        )
        if sort_order == "desc":
            query = query.order_by(priority_case.asc())
        else:
            query = query.order_by(priority_case.desc())
    else:
        sort_column = getattr(models.Ticket, sort_by, models.Ticket.created_at)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    return query.all(), total

def update_ticket_status(
    db: Session,
    ticket_id: int,
    new_status: schemas.StatusEnum
) -> Optional[models.Ticket]:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None
    
    if db_ticket.status == schemas.StatusEnum.DONE:
        raise ValueError("Cannot update status of done ticket")
    
    if new_status == schemas.StatusEnum.DONE and db_ticket.status != schemas.StatusEnum.DONE:
        db_ticket.status = new_status
        db_ticket.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_ticket)
        return db_ticket
    
    db_ticket.status = new_status
    db_ticket.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def delete_ticket(db: Session, ticket_id: int) -> bool:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return False

    if db_ticket.status == schemas.StatusEnum.DONE:
        raise ValueError("Cannot delete done ticket")
    
    db.delete(db_ticket)
    db.commit()
    return True

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data: schemas.UserCreate) -> models.User:
    password_hash = hashlib.sha256(user_data.password.encode()).hexdigest()
    db_user = models.User(
        username=user_data.username,
        password_hash=password_hash,
        is_admin=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user