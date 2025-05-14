import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import logo from '../assets/images/logo.png';
import banner1 from '../assets/images/banner1.png';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';
import push from '../assets/images/push.png';
import b1 from '../assets/images/book1.jpg';
import b2 from '../assets/images/book2.jpg';
import b3 from '../assets/images/book3.jpg';
import AnnouncementBanner from '../components/AnnouncementBanner';

import './Home.css';

const API = 'http://localhost:5117';

export default function Home() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Fetch order count
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const { data } = await axios.get(`${API}/api/order`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrderCount(data.length);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrderCount();
  }, []);

  const handleCartClick = () => navigate('/cart');
  const toggleProfileMenu = () => setShowProfileMenu(p => !p);

  // 1. Hero slides
  const slides = [
    {
      id: 1,
      tag: 'BACK TO SCHOOL',
      title: 'Special 50% Off',
      subtitle: 'for our student community',
      copy:
        'Get ready for the new semester with our curated selection of textbooks and study guides. Exclusive deals valid until September 30th.',
      image: banner1
    },
    {
      id: 2,
      tag: 'NEW ARRIVALS',
      title: 'Discover Bestsellers',
      subtitle: 'fresh off the press',
      copy:
        'From page-turning thrillers to heartwarming memoirs, explore the top new releases of the season.',
      image: banner2
    },
    {
      id: 3,
      tag: 'SUMMER READS',
      title: 'Up to 40% Off',
      subtitle: 'light reads for sunny days',
      copy:
        'Beach bags packed? Don’t forget a great companion. Shop our summer collection of fiction, non-fiction, and more.',
      image: banner3
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);


   // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

 // Recommendations & Popular
  const recommendedBooks = [
    { title: 'Where the Crawdads Sing',  color: '#8C6FF7' },
    { title: 'Project Hail Mary',       color: '#FF5722' },
    { title: 'The Midnight Library',    color: '#FFC107' },
    { title: 'Educated',                color: '#009688' }
  ];

  const popular2025 = [
    { title: 'Tomorrow, and Tomorrow, and Tomorrow', color: '#1E88E5' },
    { title: 'Sea of Tranquility',                   color: '#673AB7' },
    { title: 'The Seven Husbands of Evelyn Hugo',    color: '#E91E63' },
    { title: 'Demon Copperhead',                     color: '#4CAF50' }
  ];

  // 3. Top Sellers
  const topSellerBooks = [
    {
      id: 1,
      title: 'Pachinko',
      author: 'Min Jin Lee',
      price: 18.99,
      stock: 12,
      img: b1
    },
    {
      id: 2,
      title: 'The Vanishing Half',
      author: 'Brit Bennett',
      price: 16.49,
      stock: 8,
      img: b2
    },
    {
      id: 3,
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      price: 14.99,
      stock: 5,
      img: b3
    }
  ];

  return (
    <div className="bb-wrapper">
      {/* HEADER */}
      <header className="bb-header">
        <div className="bb-container bb-nav">
          <div className="bb-logo">
            <img src={logo} alt="Book Bazzar" />
          </div>
          <nav className="bb-links">
  <Link to="/" className="active">Home</Link>
  <Link to="/products">Products</Link> {/* Update this link */}
  <Link to="/shop">About</Link>
  <Link to="/contact">Contact</Link>
</nav>
          <div className="bb-icons">
            <button className="icon-btn"><FiSearch /></button>
              {/* Cart Button and Modal */}
            <div 
              className="cart-btn-container"
              onClick={handleCartClick}
              onMouseEnter={() => setShowCartModal(true)}
              onMouseLeave={() => setShowCartModal(false)}
            >
              <button className="icon-btn cart-btn">
                <FiShoppingCart />
                {cartItems.length > 0 && (
                  <span className="cart-count">{cartItems.length}</span>
                )}
              </button>

              {showCartModal && (
                <div className="cart-modal">
                  <h4>Shopping Cart ({cartItems.length})</h4>
                  {cartItems.length > 0 ? (
                    <div className="cart-items">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-modal-item">
                          <span className="cart-item-title">{item.book.title}</span>
                          <span className="cart-item-qty">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="cart-empty">Your cart is empty</p>
                  )}
                  <button className="go-to-cart-btn" onClick={handleCartClick}>
                    Go to Cart
                  </button>
                </div>
              )}
            </div>
            <div className="bb-profile">
              <button className="icon-btn" onClick={toggleProfileMenu}>
                <FiUser />
              </button>
              {showProfileMenu && (
                <ul className="bb-dropdown">
                  <li><Link to="/profile">My Profile</Link></li>
                  <li>
                    <Link to="/ordersummary">
                      My Orders ({orderCount}) {/* Show the number of orders */}
                    </Link>
                  </li>
                  <li> <button className="logout-btn" onClick={handleLogout}>
                      Log Out
                      </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* WELCOME */}
      <div className="bb-container">
        <p className="bb-welcome">Welcome to Book Bazzar</p>
      </div>

      {/* HERO + BESTSELLER */}
      <section className="bb-hero-area bb-container">
        {/* Hero Slider */}
        <div className="bb-hero-slider">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`bb-hero-slide${idx === activeSlide ? ' active' : ''}`}
              style={{ display: idx === activeSlide ? 'block' : 'none' }}
            >
              <div className="bb-hero-content">
                <div className="bb-hero-text">
                  <span className="bb-hero-tag">{slide.tag}</span>
                  <h1 className="bb-hero-title">{slide.title}</h1>
                  <p className="bb-hero-subtitle">{slide.subtitle}</p>
                  <p className="bb-hero-copy">{slide.copy}</p>
                  <div className="bb-hero-ctas">
                    <button className="bb-btn-primary">
                      See Details →
                    </button>
                    <button className="bb-btn-secondary">
                      Browse Collection
                    </button>
                  </div>
                </div>
                <div className="bb-hero-image">
                  <img src={slide.image} alt={slide.title} />
                </div>
              </div>
            </div>
          ))}
          <button className="bb-hero-arrow left" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>
            <FiChevronLeft />
          </button>
          <button className="bb-hero-arrow right" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>
            <FiChevronRight />
          </button>
        </div>

        {/* Best Seller */}
        <div className="bb-bestseller-card">
          <h3>Best Seller</h3>
          <span className="bestseller-label">Based on sales this week</span>
          <div className="bb-bestseller-img">
            <img src={push} alt="Pushing Clouds" />
            
          </div>
          <div className="bb-bestseller-info">
            <h4>Pushing Clouds</h4>
            <div className="bb-price-block">
              <del>60.00</del>
              <span>USD 45.25</span>
            </div>
          </div>
        </div>
      </section>

       {/* Announcement */}

       <AnnouncementBanner />

      {/* RECOMMENDED & POPULAR */}
      <section className="bb-categories bb-container">
        <div className="bb-cat-block">
          <h3>Recommended For You</h3>
          <p>Our handpicked selection just for you:</p>
          <div className="bb-chips">
            {recommendedBooks.map((b) => (
              <div key={b.title} className="bb-chip" style={{ backgroundColor: b.color }}>
                {b.title}
              </div>
            ))}
          </div>
        </div>
        <div className="bb-cat-block">
          <h3>Popular in 2025</h3>
          <p>The books everyone’s talking about:</p>
          <div className="bb-chips">
            {popular2025.map((b) => (
              <div key={b.title} className="bb-chip" style={{ backgroundColor: b.color }}>
                {b.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP SELLERS */}
      <section className="bb-top-sellers bb-container">
        <h3>Top Sellers</h3>
        <div className="bb-book-grid">
          {topSellerBooks.map((b) => (
            <div key={b.id} className="bb-book-card">
              <div className="bb-book-img">
                <img src={b.img} alt={b.title} />
              </div>
              <div className="bb-book-info">
                <h4>{b.title}</h4>
                <p className="author">{b.author}</p>
                <div className="meta">
                  <span>${b.price.toFixed(2)}</span>
                  <span>Stock: {b.stock} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bb-footer">
        <div className="bb-container bb-footer-top">
          <div className="footer-col">
            <div className="footer-logo">
              <img src={logo} alt="Book Bazzar" />

            </div>
            <div className="footer-socials">
              <a href="#facebook">Facebook</a>
              <a href="#instagram">Instagram</a>
              <a href="#twitter">Twitter</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">New Releases</Link>
            <Link to="/">Best Sellers</Link>
            <Link to="/">Categories</Link>
            <Link to="/">Gift Cards</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <Link to="/">Contact Us</Link>
            <Link to="/">FAQ</Link>
            <Link to="/">Shipping</Link>
            <Link to="/">Returns</Link>
          </div>
          <div className="footer-col subscribe">
            <h4>Newsletter</h4>
            <form>
              <input type="email" placeholder="Your email address" />
              <button type="submit">→</button>
            </form>
          </div>
        </div>
        <div className="bb-footer-bottom">
          <p>© 2025 Book Bazzar. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
