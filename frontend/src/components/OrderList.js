import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap'; // Đã sửa và gộp import

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/orders/'); // Relative URL
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setOrders(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Order List</h2>
      <ListGroup>
        {orders.map(order => (
          <ListGroup.Item key={order.order_id}>
            <strong>Order ID:</strong> {order.order_id}<br />
            <strong>User ID:</strong> {order.user_id}<br />
            <strong>Total:</strong> ${order.total_amount}<br />
            <strong>Status:</strong> {order.status}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default OrderList;