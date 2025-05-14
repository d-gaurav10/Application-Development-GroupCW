import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateBook.css";

const API = "http://localhost:5117";

export default function CreateBook({ book, onClose }) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [format, setFormat] = useState(book?.format || "Paperback");
  const [language, setLanguage] = useState(book?.language || "English");
  const [price, setPrice] = useState(book?.price || 0);
  const [discountPrice, setDiscountPrice] = useState(
    book?.discountPrice || 0
  );
  const [onSale, setOnSale] = useState(book?.onSale || false);
  const [stock, setStock] = useState(book?.stock || 0);
  const [description, setDescription] = useState(
    book?.description || ""
  );
  const [coverImage, setCoverImage] = useState(null);
  const [categoryName, setCategoryName] = useState(
    book?.category?.name || ""
  );
  const [publisherName, setPublisherName] = useState(
    book?.publisher?.name || ""
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/Category`).then((res) =>
      setCategories(res.data)
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("Title", title);
    form.append("Author", author);
    form.append("ISBN", isbn);
    form.append("Format", format);
    form.append("Language", language);
    form.append("Price", price);
    form.append("DiscountPrice", discountPrice);
    form.append("OnSale", onSale);
    form.append("Stock", stock);
    form.append("Description", description);
    if (coverImage) form.append("CoverImage", coverImage);
    form.append("CategoryName", categoryName);
    form.append("PublisherName", publisherName);

    const url = book
      ? `${API}/api/Book/${book.id}`
      : `${API}/api/Book`;
    const method = book ? "put" : "post";

    await axios[method](url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onClose();
  };

  return (
    <div className="create-book-overlay">
      <div className="create-book-container">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{book ? "Edit Book" : "Create New Book"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option>Paperback</option>
              <option>Hardcover</option>
              <option>Ebook</option>
              <option>Audiobook</option>
            </select>
          </div>

          <div className="form-group">
            <label>Language</label>
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Discount Price</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(+e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>On Sale</label>
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(+e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Publisher Name</label>
            <input
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="create-book-btn">
            {book ? "Save Changes" : "Create Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
