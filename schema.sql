-- =====================================================
-- PROJECT SKY WAITLIST DATABASE SCHEMA (MySQL)
-- =====================================================

CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number INT UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('pending', 'approved', 'invited') DEFAULT 'pending',
  source VARCHAR(100) DEFAULT 'website',
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_ticket (ticket_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
