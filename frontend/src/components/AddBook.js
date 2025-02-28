import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

function AddBook({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn tải lại trang
    setSuccessMessage(''); // Xóa thông báo cũ
    setErrorMessage('');

    try {
      // Validate data (ví dụ: kiểm tra các trường bắt buộc)
      if (!title || !author || !price) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      const newBook = {
        book_id: Math.floor(Math.random() * 1000), // Tạo ID ngẫu nhiên (chỉ cho ví dụ)
        title: title,
        author: author,
        price: parseFloat(price),
        // ... thêm các trường khác nếu có ...
      };

      const response = await axios.post('/api/books/', newBook); // Gửi POST request
      if (response.status === 201) {
        console.log('Book added:', response.data);
        setSuccessMessage('Book added successfully!');
        setTitle(''); // Reset form
        setAuthor('');
        setPrice('');
        onBookAdded(); // Gọi hàm callback để thông báo cho BookList
      } else {
        setErrorMessage(`Failed to add book: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setErrorMessage('An error occurred while adding the book.');
    }
  };

  return (
    <Container>
      <h2>Add New Book</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author:</Form.Label>
          <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price:</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">Add Book</Button>
      </Form>
    </Container>
  );
}

export default AddBook;