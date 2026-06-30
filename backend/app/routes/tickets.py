from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app import crud, schemas, auth
from app.database import SessionLocal

router = APIRouter(prefix="/api/tickets", tags=["tickets"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Ticket, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db)
):
    db_ticket = crud.create_ticket(db, ticket)
    return db_ticket

@router.get("/", response_model=dict)
def get_tickets(
    status: Optional[schemas.StatusEnum] = None,
    priority: Optional[schemas.PriorityEnum] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    tickets, total = crud.get_tickets(
        db, status, priority, search, sort_by, sort_order, page, per_page
    )
    tickets_data = [schemas.Ticket.model_validate(ticket) for ticket in tickets]
    return {
        "data": tickets_data,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }

@router.patch("/{ticket_id}/status", response_model=schemas.Ticket)
def update_ticket_status(
    ticket_id: int,
    status_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    if not status_update.status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    try:
        ticket = crud.update_ticket_status(db, ticket_id, status_update.status)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return ticket
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(auth.verify_admin)
):
    try:
        deleted = crud.delete_ticket(db, ticket_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Ticket not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))