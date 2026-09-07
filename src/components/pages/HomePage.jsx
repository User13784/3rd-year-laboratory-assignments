import React from 'react';

function HomePage({ title = "Best Furniture For Your Interior" }) {
  return (
    <div className="home-page">
      <div className="hero-content">
        <p className="hero-small">Save The Weekend</p>
        <p className="hero-medium">Awesome design</p>
        <p className="hero-large furniture-line">Best Furniture For</p>
        <p className="hero-large interior-line">Your Interior.</p>
        <a href="/catalog" className="hero-button">Explore More</a>
      </div>
    </div>
  );
}

export default HomePage;