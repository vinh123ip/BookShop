from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    
class Book(BaseModel):
    book_id: int
    title: str
    author: str
    isbn: str
    publication_date: Optional[str] = None
    description: Optional[str] = None
    price: float
    genre: str
    image_url: Optional[str] = None
    stock_quantity: int

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    publication_date: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    genre: Optional[str] = None
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = None

class Promotion(BaseModel):
    id: int
    name: str
    description: str

class Order(BaseModel):
    order_id: int
    user_id: int
    order_date: datetime
    total_amount: float
    status: str
