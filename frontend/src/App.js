import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import BookList from './components/BookList';
import UserList from './components/UserList';
import PromotionList from './components/PromotionList';
import OrderList from './components/OrderList';
import AddBook from './components/AddBook';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from './components/AddUser';//Import New
function App() {
    const [books, setBooks] = useState([]); // Giữ danh sách sách ở đây
    const [users, setUsers] = useState([]); // Giữ danh sách user
    const [loading, setLoading] = useState(true); // Giữ loading state
    const [error, setError] = useState(null); // Giữ error state

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/books/'); // Relative URL
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setBooks(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // New Function: fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users/');
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setUsers(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []); // Call the function when App mount

    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>Admin Panel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/books">Books</Nav.Link>
                            <Nav.Link as={Link} to="/users">Users</Nav.Link>
                            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                            <Nav.Link as={Link} to="/promotions">Promotions</Nav.Link>
                            <Nav.Link as={Link} to="/add-book">Add Book</Nav.Link>
                            <Nav.Link as={Link} to="/add-user">Add User</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Routes>
                    <Route path="/" element={<BookList books={books} loading={loading} error={error} />} />
                    <Route path="/books" element={<BookList books={books} loading={loading} error={error} />} />
                    <Route path="/users" element={<UserList users={users} fetchUsers = {fetchUsers}/>} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/promotions" element={<PromotionList />} />
                    <Route path="/add-book" element={<AddBook onBookAdded={fetchData} />} />
                     <Route path="/add-user" element={<AddUser onUsersAdded={fetchUsers} />} />
                </Routes>
            </Container>
        </Router>
   );
}

export default App;