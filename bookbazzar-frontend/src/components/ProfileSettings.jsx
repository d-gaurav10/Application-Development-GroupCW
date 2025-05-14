import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfileSettings.css';

const API_BASE = 'http://localhost:5117';

export default function ProfileSettings() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const { data } = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForm(prev => ({
          ...prev,
          fullName: data.fullName || '',
          email: data.email || ''
        }));
      } catch (error) {
        console.error('Error loading profile:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error('Failed to load profile information');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        fullName: form.fullName,
        ...(form.currentPassword && { currentPassword: form.currentPassword }),
        ...(form.newPassword && { newPassword: form.newPassword })
      };
      await axios.put(`${API_BASE}/api/users/profile`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Profile updated successfully');
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2><FiUser /> Profile Settings</h2>
      <form className="profile-form" onSubmit={onSubmit}>
        <label>
          <FiUser /> Full Name
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
          />
        </label>
        <label>
          <FiMail /> Email (read-only)
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
          />
        </label>
        <label>
          <FiLock /> Current Password
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            placeholder="••••••••"
          />
        </label>
        <label>
          <FiLock /> New Password
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            placeholder="••••••••"
          />
        </label>
        <label>
          <FiLock /> Confirm New Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
          />
        </label>
        <button type="submit" className="btn-save" disabled={saving}>
          {saving ? 'Saving…' : <><FiSave /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}