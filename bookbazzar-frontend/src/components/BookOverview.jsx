import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import "./BookOverview.css";

const API = "http://localhost:5117";

export default function BookOverview() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/book/${bookId}`)
      .then((resp) => setBook(resp.data))
      .catch(console.error);
  }, [bookId]);

   const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      // Check if quantity is valid
      if (quantity > book.stock) {
        toast.error("Requested quantity exceeds available stock");
        return;
      }

      const response = await axios.post(
        `${API}/api/cart`,
        {
          bookId: parseInt(bookId, 10),
          quantity: quantity
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true // Add this to handle CORS with credentials
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Book added to cart successfully!");
        // Update local book stock
        setBook(prev => ({
          ...prev,
          stock: prev.stock - quantity
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 403) {
        // Handle forbidden error - user might need to re-login
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token"); // Clear invalid token
        navigate("/login");
      } else if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Failed to add to cart");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };


  if (!book) return <div className="bo-loading">Loading...</div>;

  return (
    <div className="bo-page">
      <h1 className="bo-title">Book Overview</h1>

      <div className="bo-main">
        {/* Left: Cover */}
        <div className="bo-left">
          <img
            className="bo-cover"
            src={
              book.coverImage
                ? `${API}/uploads/books/${book.coverImage}`
                : "/placeholder-cover.jpg"
            }
            alt={book.title}
          />
        </div>

        {/* Middle: Details */}
        <div className="bo-details">
          <div className="bo-details-card">
            <h2>
              <strong>{book.title}</strong> {book.author}
            </h2>
            <p className="bo-desc">{book.description}</p>
            <ul className="bo-meta-list">
              <li>
                <strong>Author:</strong> {book.author}
              </li>
              <li>
                <strong>Date:</strong>{" "}
                {new Date(book.publishedDate || book.createdAt).toLocaleDateString()}
              </li>
              <li>
                <strong>Rating:</strong>{" "}
                {"★".repeat(Math.round(book.averageRating || 0))}
                {"☆".repeat(5 - Math.round(book.averageRating || 0))}{" "}
                {book.reviewCount} ratings
              </li>
              <li>
                <strong>Created By:</strong> {book.createdBy || "Admin"}
              </li>
              <li>
                <strong>Genre:</strong> {book.category?.name || "—"}
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Purchase box */}
        <div className="bo-purchase">
          <div className="bo-stock-card">
            <div>
              <span>Available Books:</span>
              <span className="bo-available">{book.stock}</span>
            </div>
            <div>
              <span>Sold Out:</span>
              <span className="bo-sold">{book.sold || 0}</span>
            </div>
          </div>

          <div className="bo-order-card">
            <label className="bo-qty-label">
              NO. of Books:
            </label>
            <div className="bo-qty-controls">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>＋</button>
            </div>
            <div className="bo-price">
              Price: <strong>Rs. {book.price}</strong>
            </div>
          </div>

          <button className="bo-btn bo-btn-primary" onClick={addToCart}>
            Add to cart
          </button>
          <button
            className="bo-btn bo-btn-secondary"
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>
        </div>
      </div>

      <hr className="bo-divider" />

      {/* Similar books */}
      <section className="bo-similar">
        <h3>Similar Books..</h3>
        <div className="bo-similar-grid">
          {(book.similarBooks || []).map((sim) => (
            <div
              key={sim.id}
              className="bo-sim-card"
              onClick={() => navigate(`/book/${sim.id}`)}
            >
              <img
                src={
                  sim.coverImage
                    ? `${API}/uploads/books/${sim.coverImage}`
                    : "/placeholder-cover.jpg"
                }
                alt={sim.title}
              />
              <h4>{sim.title}</h4>
              <p>{sim.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
