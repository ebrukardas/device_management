CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    added_at VARCHAR(100) NOT NULL,
    last_connected_at VARCHAR(100) NOT NULL
);

-- Insert sample data
INSERT INTO devices (id, name, type, status, added_at, last_connected_at) VALUES 
(101, 'Main Thermostat', 'HVAC', 'connected', '3/10/2026, 10:00:00 AM', '3/13/2026, 11:10:00 PM'),
(102, 'Front Door Camera', 'Security', 'disconnected', '3/11/2026, 2:30:00 PM', '3/12/2026, 8:15:00 AM'),
(103, 'Living Room Lights', 'Lighting', 'connected', '3/12/2026, 9:20:00 AM', '3/13/2026, 11:14:34 PM')
ON CONFLICT (id) DO NOTHING;

-- Since we inserted IDs manually, ensure the sequence is updated so subsequent inserts don't fail
SELECT setval('devices_id_seq', (SELECT MAX(id) FROM devices));
