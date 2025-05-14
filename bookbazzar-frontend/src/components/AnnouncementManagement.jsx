import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnnouncementForm from './AnnouncementForm';
import './AnnouncementManagement.css';

const API = "http://localhost:5117";

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API}/api/announcement`);
      setAnnouncements(response.data);
    } catch (err) {
      toast.error("Error fetching announcements");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/announcement/${id}`);
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success("Announcement deleted successfully");
    } catch (err) {
      toast.error("Failed to delete announcement");
    }
  };

  const handleAdd = (newAnnouncement) => {
    setAnnouncements([...announcements, newAnnouncement]);
    setShowForm(false);
  };

  return (
    <div className="announcement-management">
      <h2>Announcement Management</h2>
      <button className="btn-add" onClick={() => setShowForm(true)}>Add Announcement</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.message}</td>
              <td>{new Date(a.startTime).toLocaleString()}</td>
              <td>{a.endTime ? new Date(a.endTime).toLocaleString() : 'N/A'}</td>
              <td>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <AnnouncementForm
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AnnouncementManagement;
