from fastapi import APIRouter, HTTPException, Body
from database import get_db_connection
from models import User, UserUpdate

router = APIRouter()

# API: Tạo mới người dùng
@router.post("/api/users/", response_model=User, status_code=201)
async def create_user(user: User = Body(...)):
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "INSERT INTO Users (name, email) VALUES (%s, %s)"
        val = (user.name, user.email)
        mycursor.execute(sql, val)
        mydb.commit()

        # Lấy ID vừa được tạo
        user_id = mycursor.lastrowid

        # Lấy thông tin user từ database để trả về
        sql = "SELECT id, name, email FROM Users WHERE id = %s"
        mycursor.execute(sql, (user_id,))
        result = mycursor.fetchone()
        if result is None:
            raise HTTPException(status_code=500, detail="Failed to retrieve user after creation")

        return User(id=result[0], name=result[1], email=result[2])
    except Exception as e:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()


# API: Lấy danh sách tất cả người dùng
@router.get("/api/users/", response_model=list[User])
async def get_all_users():
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        mycursor.execute("SELECT id, name, email FROM Users")
        users = mycursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()
    return [{"id": u[0], "name": u[1], "email": u[2]} for u in users]


# API: Lấy thông tin người dùng theo ID
@router.get("/api/users/{user_id}", response_model=User)
async def get_user_by_id(user_id: int):
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "SELECT id, name, email FROM Users WHERE id = %s"
        mycursor.execute(sql, (user_id,))
        user = mycursor.fetchone()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user[0], "name": user[1], "email": user[2]}


# API: Cập nhật thông tin người dùng (PUT)
@router.put("/api/users/{user_id}", response_model=User, tags=["Users"])
async def update_user(user_id: int, user: UserUpdate = Body(...)):
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "UPDATE Users SET name = %s, email = %s WHERE id = %s"
        val = (user.name, user.email, user_id)
        mycursor.execute(sql, val)
        mydb.commit()

        if mycursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()

    # Lấy lại thông tin người dùng đã cập nhật
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "SELECT id, name, email FROM Users WHERE id = %s"
        mycursor.execute(sql, (user_id,))
        result = mycursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="User not found after update")
        return {"id": result[0], "name": result[1], "email": result[2]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()


# API: Xoá người dùng
@router.delete("/api/users/{user_id}", status_code=204, tags=["Users"])
async def delete_user(user_id: int):
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    try:
        sql = "DELETE FROM Users WHERE id = %s"
        mycursor.execute(sql, (user_id,))
        mydb.commit()
        if mycursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        mycursor.close()
        mydb.close()