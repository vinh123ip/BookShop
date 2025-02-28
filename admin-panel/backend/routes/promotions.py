from fastapi import APIRouter, HTTPException
from typing import List
from models import Promotion

router = APIRouter()

@router.get("/api/promotions/")  # Thêm route cho /api/promotions/
async def read_promotions():
    promotions = [{"id": 1, "name": "Summer Sale"}, {"id": 2, "name": "Winter Discount"}] # Ví dụ - Thay bằng code lấy từ database
    return promotions