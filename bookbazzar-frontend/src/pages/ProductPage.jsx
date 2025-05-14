import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import "./ProductPage.css";

const API = "http://localhost:5117";

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title (A-Z)" },
  { value: "title_desc", label: "Title (Z-A)" },
  { value: "price_asc", label: "Price (Low to High)" },
  { value: "price_desc", label: "Price (High to Low)" }
];

const GENRES = [
  "Fiction", "Non-Fiction", "Self-Help", "Science", 
  "History", "Technology", "Biography", "Children"
];

export default function ProductPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    genre: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "title_asc"
  });

  // Fetch all books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/book`);
      setBooks(response.data);
      applyFilters(response.data); // Apply initial filters
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter function
  const applyFilters = useCallback((booksToFilter = books) => {
    let result = [...booksToFilter];

    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      result = result.filter(book => book.category?.name === filters.genre);
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(book => book.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(book => book.price <= parseFloat(filters.maxPrice));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredBooks(result);
  }, [books, searchText, filters]);

  // Effect to apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      genre: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "title_asc"
    });
    setSearchText("");
  };

  return (
    <div className="product-page">
      <header className="product-header">
        <div className="product-nav">
          <div className="product-logo">BookBazzar</div>
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FiX /> : <FiFilter />}
            Filters
          </button>
        </div>
      </header>

      <main className="product-main">
        <div className="search-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="filter-section">
            <label>Genre</label>
            <select 
              name="genre" 
              value={filters.genre}
              onChange={handleFilterChange}
            >
              <option value="">All Genres</option>
              {GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <label>Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="no-results">
            <p>No books found matching your criteria</p>
          </div>
        ) : (
          <div className="book-grid">
            {filteredBooks.map(book => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <img
                  src={
                    book.coverImage
                      ? `${API}/uploads/books/${book.coverImage}`
                      : "/placeholder-cover.jpg"
                  }
                  alt={book.title}
                  className="book-cover"
                />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author || "Unknown Author"}</p>
                  <p className="category">{book.category?.name}</p>
                  <p className="price">Rs. {book.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}