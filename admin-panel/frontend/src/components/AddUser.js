import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

function AddUser({ onUsersAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (!name || !email) {
        setErrorMessage('Please fill all fields');
        return;
      }

      const newUser = {
        name: name,
        email: email,
      };

      const response = await axios.post('/api/users/', newUser);
      if (response.status === 201) {
        setSuccessMessage('User added successfully!');
        setName('');
        setEmail('');
        onUsersAdded(); // Gọi hàm callback
      } else {
        setErrorMessage(`Failed to add user: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("An error occurred while adding the user.");
    }
  };

  return (
    <Container>
      <h2>Add New User</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">Add User</Button>
      </Form>
    </Container>
  );
}

export default AddUser;