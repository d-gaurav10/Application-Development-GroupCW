import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";

const API = "http://localhost:5117";

const SummaryCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-md p-4 text-center">
    <h2 className="text-gray-500 text-sm">{title}</h2>
    <p className="text-2xl font-semibold text-indigo-600">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [toDate, setToDate] = useState(new Date());

  const [books, setBooks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchSummary = async () => {
    const res = await axios.get(`${API}/api/admin/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSummary(res.data);
  };

  const fetchSales = async () => {
    const res = await axios.get(`${API}/api/admin/sales`, {
      params: { from: fromDate.toISOString(), to: toDate.toISOString() },
      headers: { Authorization: `Bearer ${token}` },
    });
    setSalesData(res.data);
  };

  const fetchBooks = async () => {
    const res = await axios.get(`${API}/api/book`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(res.data);
  };

  const deleteBook = async () => {
    await axios.delete(`${API}/api/book/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteId(null);
    fetchBooks();
  };

  useEffect(() => {
    fetchSummary();
    fetchSales();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fromDate, toDate]);

  if (!summary) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard title="Books" value={summary.totalBooks} />
        <SummaryCard title="Users" value={summary.totalUsers} />
        <SummaryCard title="Admins" value={summary.totalAdmins} />
        <SummaryCard title="Orders" value={summary.totalOrders} />
        <SummaryCard title="Revenue" value={`Rs. ${summary.totalRevenue}`} />
        <SummaryCard title="Pending Orders" value={summary.pendingOrders} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">📈 Weekly Sales</h2>
        <div className="flex space-x-4 items-center mb-3">
          <DatePicker selected={fromDate} onChange={setFromDate} />
          <DatePicker selected={toDate} onChange={setToDate} />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Books Management */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">📚 Book Management</h2>
          <a href="/admin/add-book" className="bg-green-600 text-white px-4 py-1 rounded text-sm">+ Add Book</a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th>Title</th>
              <th>Format</th>
              <th>Stock</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-b">
                <td>{b.title}</td>
                <td>{b.format}</td>
                <td>{b.stock}</td>
                <td>Rs. {b.price}</td>
                <td>
                  <button onClick={() => setDeleteId(b.id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">📦 Low Stock</h2>
        <ul className="list-disc list-inside text-sm">
          {summary.lowStockBooks.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>

      {/* Most Rated */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">⭐ Top Rated Books</h2>
        <ol className="list-decimal list-inside text-sm">
          {summary.mostRatedBooks.map((b, i) => <li key={i}>{b}</li>)}
        </ol>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold">Delete Book?</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this book?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-1 border rounded">Cancel</button>
              <button onClick={deleteBook} className="px-4 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
