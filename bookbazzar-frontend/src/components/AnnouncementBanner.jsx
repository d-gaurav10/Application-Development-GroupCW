import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnnouncementBanner.css';

const API = "http://localhost:5117";

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchActiveAnnouncements = async () => {
      try {
        const { data } = await axios.get(`${API}/api/announcement/active`);
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchActiveAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="announcement-wrapper">
      <h3 className="announcement-label">Announcements</h3>
      <div className="announcement-container">
        {announcements.map((a, idx) => (
          <div key={idx} className="announcement-card">
            <h4 className="announcement-card__title">{a.title}</h4>
            <p className="announcement-card__message">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
