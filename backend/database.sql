CREATE DATABASE IF NOT EXISTS lottery_db;

USE lottery_db;

CREATE TABLE numbers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value INT NOT NULL,
  draw_type ENUM('type1', 'type2') NOT NULL,
  is_taken BOOLEAN DEFAULT 0,
  taken_by VARCHAR(255) DEFAULT NULL
);

-- Przykładowe rekordy
INSERT INTO numbers (value, draw_type, is_taken) VALUES
(1, 'type1', 0),
(2, 'type1', 0),
(3, 'type2', 0),
(4, 'type2', 0);
