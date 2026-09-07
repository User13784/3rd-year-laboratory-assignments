import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await api.getFeedback();
      setFeedback(data);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="feedback-page">
      <div className="catalog-header">
        <h1>⭐ Customer Reviews</h1>
        <p>Share your opinion about products</p>
      </div>
      <div className="feedback-container">
        {feedback.length === 0 ? (
          <div className="no-reviews">💬 No reviews yet. Be the first!</div>
        ) : (
          feedback.map(review => (
            <div key={review.id} className="review-card">
              <h3>{review.userNickname}</h3>
              <p>{review.text.en}</p>
              <span>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;