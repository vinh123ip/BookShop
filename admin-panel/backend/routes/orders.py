from fastapi import APIRouter, HTTPException
from typing import List
from database import get_db_connection
from models import Order

router = APIRouter()

@router.get("/api/orders/", response_model=List[Order])
async def read_orders():
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        mycursor.execute("SELECT * FROM Orders")
        results = mycursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mydb.close()

    order_list = [Order(
        order_id=row[0], user_id=row[1], order_date=row[2],
        total_amount=row[3], status=row[4]
    ) for row in results]

    return order_list