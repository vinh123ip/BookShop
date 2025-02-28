# backend/routes/books.py
from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional
from database import get_db_connection
from models import Book, BookUpdate

router = APIRouter()

@router.get("/api/books/", response_model=List[Book])
async def read_books():
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        mycursor.execute("SELECT * FROM Books")
        results = mycursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if mydb:
            mydb.close()

    book_list = [Book(
        book_id=row[0], title=row[1], author=row[2], isbn=row[3],
        publication_date=str(row[4]) if row[4] else None, description=row[5],
        price=row[6], genre=row[7], image_url=row[8], stock_quantity=row[9]
    ) for row in results]

    return book_list

@router.put("/api/books/{book_id}", response_model=Book)
async def update_book(book_id: int, book: BookUpdate = Body(...)):
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = """
            UPDATE Books 
            SET title = %s, author = %s, isbn = %s, publication_date = %s, 
                description = %s, price = %s, genre = %s, image_url = %s, 
                stock_quantity = %s 
            WHERE book_id = %s
        """
        val = (
            book.title if book.title is not None else None,
            book.author if book.author is not None else None,
            book.isbn if book.isbn is not None else None,
            book.publication_date if book.publication_date is not None else None,
            book.description if book.description is not None else None,
            book.price if book.price is not None else None,
            book.genre if book.genre is not None else None,
            book.image_url if book.image_url is not None else None,
            book.stock_quantity if book.stock_quantity is not None else None,
            book_id
        )
        mycursor.execute(sql, val)
        mydb.commit()
        if mycursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Book not found")
    except Exception as e:
        if mydb:
            mydb.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if mydb:
            mydb.close()

    # Lấy lại thông tin sách vừa sửa
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "SELECT * FROM Books WHERE book_id = %s"
        val = (book_id,)
        mycursor.execute(sql, val)
        result = mycursor.fetchone()

        if result is None:
            raise HTTPException(status_code=404, detail="Book not found after update")

        book = Book(
            book_id=result[0],
            title=result[1],
            author=result[2],
            isbn=result[3],
            publication_date=str(result[4]) if result[4] else None,
            description=result[5],
            price=result[6],
            genre=result[7],
            image_url=result[8],
            stock_quantity=result[9],
        )
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if mydb:
            mydb.close()