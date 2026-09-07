import React, { useState, useEffect } from 'react';
import CartItem from '../cart/CartItem';
import { api } from '../../services/api';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    setLoading(false);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(id);
      return;
    }
    try {
      await api.updateCartItem(id, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div className="loading">Loading...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛍️ Cart is empty</h2>
        <p>Add items to cart to checkout</p>
        <a href="/catalog" className="back-link">Go to catalog</a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <p>Your selected items</p>
      </div>

      <div className="cart-container">
        <div className="cart-table">
          <div className="cart-header-row">
            <span>Product</span>
            <span>Name</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span>Actions</span>
          </div>

          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">Total: £{total.toFixed(2)}</div>
          <button className="checkout-btn">✅ Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;