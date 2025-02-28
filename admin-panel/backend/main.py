from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import books
from routes import users
from routes import orders
from routes import promotions
app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1:3000",
    "http://127.0.0.1",
    "*",  # KHÔNG DÙNG TRONG PRODUCTION
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(promotions.router)
@app.on_event("startup")
def debug_routes():
    print("=== Debug: Danh sách routes được đăng ký ===")
    for route in app.routes:
        print(f"Path: {route.path}, Name: {route.name}, Methods: {route.methods}")

@app.get("/")  # Định nghĩa route cho endpoint gốc
async def root():
    return {"message": "Chao mung den voi Cheems Shop!"}