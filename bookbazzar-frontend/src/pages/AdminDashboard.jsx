import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiPlus,
  FiTrash2,
  FiEdit,
} from 'react-icons/fi';
import logo from "../assets/images/logo.png";
import CreateBook from "../components/CreateBook";
import UserManagement from "../components/UserManagement";
import OrderManagement from "../components/OrderManagement";
import DiscountManagement from "../components/DiscountManagement";
import AnnouncementManagement from "../components/AnnouncementManagement";
import "./AdminDashboard.css";

// API URL for admin data fetching
const API = "http://localhost:5117";

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 86400000));
  const [toDate, setToDate] = useState(new Date());
  const [books, setBooks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockThreshold, setStockThreshold] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

// Fetch functions…
async function fetchSummary() {
const res = await axios.get(`${API}/api/admin/summary`);
setSummary(res.data);
}
async function fetchSales() {
const res = await axios.get(`${API}/api/admin/sales`, {
params: { from: fromDate.toISOString(), to: toDate.toISOString() }
});
setSalesData(res.data);
}
async function fetchBooks() {
const res = await axios.get(`${API}/api/book`, {
params: { search: searchTerm, stockThreshold }
});
setBooks(res.data);
}

useEffect(() => {
  fetchSummary();
  fetchSales();
  fetchBooks();
}, []);

useEffect(() => {
  fetchSales();
  fetchBooks();
}, [fromDate, toDate, searchTerm, stockThreshold]);


async function handleDelete() {
await axios.delete(`${API}/api/book/${deleteId}`);
setDeleteId(null);
fetchBooks();
}

const openCreate = () => {
setEditBook(null);
setShowCreateModal(true);
};

const openEdit = (book) => {
setEditBook(book);
setShowCreateModal(true);
};

if (!summary) return <div className="admin-dashboard">Loading…</div>;

return ( <div className="admin-dashboard">

```
  {showCreateModal && (
    <CreateBook
      book={editBook}
      onClose={() => {
        setShowCreateModal(false);
        fetchBooks();
      }}
    />
  )}

  {/* HEADER */}
  <header className="bb-header">
    <div className="bb-container bb-nav">
      <div className="bb-logo">
        <img src={logo} alt="Book Bazzar" />
      </div>
      <nav className="bb-links">
        <Link to="/" className="active">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="bb-icons">
        <button className="icon-btn"><FiSearch /></button>
        <button className="icon-btn"><FiShoppingCart /></button>
        <div className="bb-profile">
          <button className="icon-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <FiUser />
          </button>
          {showProfileMenu && (
            <ul className="bb-dropdown">
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/logout">Log Out</Link></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  </header>

  {/* Summary */}
  <section className="summary-grid">
    <SummaryCard title="Books" value={summary.totalBooks} />
    <SummaryCard title="Users" value={summary.totalUsers} />
    <SummaryCard title="Admins" value={summary.totalAdmins} />
    <SummaryCard title="Orders" value={summary.totalOrders} />
    <SummaryCard title="Revenue" value={`Rs. ${summary.totalRevenue}`} />
    <SummaryCard title="Pending Orders" value={summary.pendingOrders} />
  </section>

  {/* Sales Chart */}
  <section className="chart-container">
    <div className="chart-header">
      <h2>📈 Weekly Sales</h2>
      <div className="date-controls">
        <DatePicker selected={fromDate} onChange={setFromDate} />
        <DatePicker selected={toDate} onChange={setToDate} />
      </div>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={salesData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </section>

  {/* Search & Filter */}
  <section className="search-stock">
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="stock-alert">
      <label>
        Stock Threshold:{" "}
        <input
          type="number"
          min="0"
          value={stockThreshold}
          onChange={e => setStockThreshold(Number(e.target.value))}
        />
      </label>
    </div>
  </section>

  {/* Book Management */}
  <section className="books-management">
    <div className="bm-header">
      <h2>📚 Book Management</h2>
      <button className="btn-add" onClick={openCreate}>
        <FiPlus /> Add Book
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Title</th><th>Format</th><th>Stock</th><th>Price</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map(b => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.format}</td>
            <td>{b.stock}</td>
            <td>Rs. {b.price}</td>
            <td>
              <button className="btn-edit" onClick={() => openEdit(b)}>
                <FiEdit />
              </button>
              <button className="btn-delete" onClick={() => setDeleteId(b.id)}>
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>

  {/* User Management */}
<section className="user-management-section">

  <UserManagement />
</section>

  {/* Order Management */}
  <section className="order-management-section">
    <OrderManagement />
  </section>

{/* Discount Management */}
  <section className="discount-management-section">
    <DiscountManagement />
  </section>

   {/* Announcement Management */}
  <section className="announcement-management-section">
    <AnnouncementManagement />
  </section>

  {/* Low Stock */}
  <section className="low-stock">
    <h2>📦 Low Stock</h2>
    <ul>{summary.lowStockBooks.map((t,i) => <li key={i}>{t}</li>)}</ul>
  </section>

  {/* Top Rated */}
  <section className="top-rated">
    <h2>⭐ Top Rated Books</h2>
    <ol>{summary.mostRatedBooks.map((t,i) => <li key={i}>{t}</li>)}</ol>
  </section>

  {/* Delete Confirmation */}
  {deleteId && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Book?</h3>
        <p>Are you sure you want to delete this book?</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn-confirm" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  )}

  {/* FOOTER */}
  <footer className="bb-footer">
    <div className="bb-container bb-footer-top">
      <div className="footer-col">
        <div className="footer-logo">
          <img src="https://your-logo-url.com/logo.png" alt="Book Bazzar" />
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