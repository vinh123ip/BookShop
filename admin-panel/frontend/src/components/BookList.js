import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container, Button, Form } from 'react-bootstrap';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/books/');
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBook = (bookId) => {
    const bookToEdit = books.find(book => book.book_id === bookId);
    setEditingBookId(bookId);
    setEditFormData({ ...bookToEdit });
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    if (fieldName === 'price') {
      fieldValue = parseFloat(fieldValue);
      if (isNaN(fieldValue)) {
        console.error("Invalid price");
        return;
      }
    }

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (typeof editFormData.price !== 'number') {
        setError('Price must be a valid number.');
        return;
      }
      const response = await axios.put(`/api/books/${editingBookId}`, editFormData);
      if (response.status === 200) {
        console.log('Book updated successfully');
        fetchData();
        setEditingBookId(null);
      } else {
        setError(`Failed to update book: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError('An error occurred while updating the book.');
      console.error("Update Error", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await axios.delete(`/api/books/${bookId}`);
        if (response.status === 204) {
          console.log('Book deleted successfully');
          fetchData();
        } else {
          setError(`Failed to delete book: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setError('An error occurred while deleting the book.');
        console.error("Delete Error", error);
      }
    }
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Book List</h2>
      <Row>
        {books.map(book => (
          <Col md={4} key={book.book_id}>
            <Card className="mb-3">
              <Card.Body>
                {editingBookId === book.book_id ? (
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
                      <Form.Label>Price:</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={editFormData.price || ""}
                        onChange={handleEditFormChange}
                        required="required"
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </Form>
                ) : (
                  <>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
                    <Card.Text>
                      {book.price.toLocaleString('vi-VN') + ' đ'}  {/* Thêm ' đ' vào cuối */}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleEditBook(book.book_id)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteBook(book.book_id)}>
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default BookList;