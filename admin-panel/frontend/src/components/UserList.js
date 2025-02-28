import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Container, Button, Form } from 'react-bootstrap';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/books/');
      setBooks(response.data);
      setError(null); // Reset lỗi nếu tải thành công
    } catch (error) {
      setError(`Failed to load books: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBook = async (bookId) => {
    console.log("Editing book ID:", bookId); // Kiểm tra ID có bị undefined không
    if (!bookId) {
      alert("Error: bookId is undefined or invalid");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/books/${bookId}`);
      console.log("Book data:", response.data);
      setEditFormData(response.data);
      setEditingBookId(bookId); // Đừng quên set editingBookId
    } catch (error) {
      console.error("Fetch Error", error);
      alert(`Failed to fetch book: ${error.response?.status} - ${error.response?.data?.detail}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setError(null);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`/api/books/${editingBookId}`, editFormData);
      if (response.status === 200) {
        console.log('Book updated successfully');
        fetchData(); // Cập nhật lại danh sách sách
        setEditingBookId(null);
        setError(null);
      }
    } catch (error) {
      const errorMessage = error.response
        ? `Failed to update book: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`
        : `Failed to update book: ${error.message}`;

      setError(errorMessage);
      console.error("Update Error", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    console.log("Deleting book ID:", bookId); // Kiểm tra ID trước khi gọi API
    if (!bookId) {
      alert("Error: bookId is undefined or invalid");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/books/${bookId}`);
      console.log("Delete response:", response);
      if (response.status === 204) {
        fetchData(); // Cập nhật danh sách sách
      } else {
        alert(`Failed to delete book: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete Error", error);
      alert(`Failed to delete book: ${error.response?.status} - ${error.response?.data?.detail}`);
    }
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  return (
    <Container>
      <h2>Book List</h2>
      <ListGroup>
        {books.map(book => (
          <ListGroup.Item key={book.book_id}>
            {editingBookId === book.book_id ? (  //Show Edit Form
              <Form onSubmit={handleEditFormSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editFormData.title || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Author:</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={editFormData.author || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN:</Form.Label>
                  <Form.Control
                    type="text"
                    name="isbn"
                    value={editFormData.isbn || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Publication Date:</Form.Label>
                  <Form.Control
                    type="date"
                    name="publication_date"
                    value={editFormData.publication_date || ""}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={editFormData.description || ""}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price:</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editFormData.price || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Genre:</Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    value={editFormData.genre || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL:</Form.Label>
                  <Form.Control
                    type="text"
                    name="image_url"
                    value={editFormData.image_url || ""}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity:</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock_quantity"
                    value={editFormData.stock_quantity || ""}
                    onChange={handleEditFormChange}
                    required="required"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit} type="button">
                  Cancel
                </Button>
              </Form>
            ) : (
              <>
                <strong>{book.title}</strong>
                <br />
                Author: {book.author}
                <br />
                ISBN: {book.isbn}
                <br />
                Publication Date: {book.publication_date}
                <br />
                Description: {book.description}
                <br />
                Price: {book.price}
                <br />
                Genre: {book.genre}
                <br />
                Image URL: {book.image_url}
                <br />
                Stock Quantity: {book.stock_quantity}
                <Button variant="primary" onClick={() => handleEditBook(book.book_id)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteBook(book.book_id)}>
                  Delete
                </Button>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default BookList;