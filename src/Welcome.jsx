import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Plus, Trash2, Power, PowerOff } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error(err));
  }, []);

  // Auto-logout user after 5 minutes of inactivity
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes

    const handleInactivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Sign out user by redirecting to login page
        navigate('/', { replace: true });
      }, INACTIVITY_TIME);
    };

    // Listen for user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleInactivity));

    // Initialize the timer
    handleInactivity();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleInactivity));
    };
  }, [navigate]);
  const [selectedId, setSelectedId] = useState(null);

  const selectedDevice = devices.find(d => d.id === selectedId);

  const handleAddDevice = () => {
    const name = prompt("Enter new device name:");
    if (name) {
      const now = new Date().toLocaleString();
      const newDevice = {
        name,
        type: 'Generic System',
        status: 'disconnected',
        addedAt: now,
        lastConnectedAt: '-'
      };
      
      fetch('http://localhost:5000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      })
      .then(res => res.json())
      .then(data => setDevices([...devices, data]))
      .catch(err => console.error(err));
    }
  };

  const handleToggleConnection = () => {
    if (!selectedId) return;
    
    const device = devices.find(d => d.id === selectedId);
    if (!device) return;

    const isConnecting = device.status === 'disconnected';
    const updatedStatus = isConnecting ? 'connected' : 'disconnected';
    const updatedLastConnectedAt = isConnecting ? new Date().toLocaleString() : device.lastConnectedAt;

    fetch(`http://localhost:5000/api/devices/${selectedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updatedStatus, lastConnectedAt: updatedLastConnectedAt })
    })
    .then(res => res.json())
    .then(updatedDevice => {
      setDevices(devices.map(d => d.id === selectedId ? updatedDevice : d));
    })
    .catch(err => console.error(err));
  };

  const handleDeleteDevice = () => {
    if (!selectedId) return;
    if (window.confirm(`Are you sure you want to delete '${selectedDevice.name}'?`)) {
      fetch(`http://localhost:5000/api/devices/${selectedId}`, {
        method: 'DELETE'
      })
      .then(() => {
        setDevices(devices.filter(d => d.id !== selectedId));
        setSelectedId(null);
      })
      .catch(err => console.error(err));
    }
  };

  return (
    <div className="welcome-container">
      <div className="glass-card dashboard-card">
        <header className="dashboard-header">
          <div className="header-title">
            <Home size={28} color="white" />
            <h1>System Dashboard</h1>
          </div>
          <button className="secondary-btn small-btn logout-btn" onClick={() => navigate('/')}>
            <LogOut size={16} />
            Sign Out
          </button>
        </header>

        <section className="dashboard-content">
          <div className="action-bar">
            <button className="primary-btn action-btn" onClick={handleAddDevice}>
              <Plus size={16} />
              Add New Device
            </button>
            <button 
              className={`primary-btn action-btn ${!selectedId ? 'disabled' : ''}`} 
              onClick={handleToggleConnection}
              disabled={!selectedId}
            >
              {selectedDevice?.status === 'connected' ? <PowerOff size={16} /> : <Power size={16} />}
              {selectedDevice?.status === 'connected' ? 'Disconnect Device' : 'Connect Device'}
            </button>
            <button 
              className={`primary-btn action-btn danger-btn ${!selectedId ? 'disabled' : ''}`} 
              onClick={handleDeleteDevice}
              disabled={!selectedId}
            >
              <Trash2 size={16} />
              Delete Device
            </button>
          </div>

          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Device Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Added At</th>
                  <th>Last Connected</th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">No devices found. Add one to get started.</td>
                  </tr>
                ) : (
                  devices.map(device => (
                    <tr 
                      key={device.id} 
                      className={`device-row ${selectedId === device.id ? 'selected' : ''}`}
                      onClick={() => setSelectedId(device.id)}
                    >
                      <td>{device.id}</td>
                      <td>{device.name}</td>
                      <td>{device.type}</td>
                      <td>
                        <span className={`status-badge ${device.status}`}>
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </span>
                      </td>
                      <td>{device.addedAt}</td>
                      <td>{device.lastConnectedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
