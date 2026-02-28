-- Create database (run this separately if needed)
-- CREATE DATABASE equipment_db;

-- Equipment Types (dynamic, not hardcoded)
CREATE TABLE IF NOT EXISTS equipment_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Equipment
CREATE TABLE IF NOT EXISTS equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id BIGINT NOT NULL REFERENCES equipment_types(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE')),
    last_cleaned_date DATE
);

-- Maintenance Logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    notes TEXT,
    performed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed equipment types (modifiable via DB, no code changes needed)
INSERT INTO equipment_types (name) VALUES
    ('HVAC'),
    ('Electrical'),
    ('Plumbing'),
    ('Mechanical'),
    ('Safety'),
    ('IT Infrastructure')
ON CONFLICT (name) DO NOTHING;

-- Sample equipment data
INSERT INTO equipment (name, type_id, status, last_cleaned_date) VALUES
    ('Air Handler Unit A1', 1, 'ACTIVE', CURRENT_DATE - INTERVAL '5 days'),
    ('Generator G1', 2, 'INACTIVE', CURRENT_DATE - INTERVAL '45 days'),
    ('Water Pump P2', 3, 'UNDER_MAINTENANCE', CURRENT_DATE - INTERVAL '10 days')
ON CONFLICT DO NOTHING;
