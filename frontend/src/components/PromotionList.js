import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap'; // Import ListGroup và Container

function PromotionList() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/promotions/'); // Relative URL
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setPromotions(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading promotions...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Promotion List</h2>
      <ListGroup>
        {promotions.map(promotion => (
          <ListGroup.Item key={promotion.id}>
            {promotion.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default PromotionList;