CREATE TABLE IF NOT EXISTS streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cap_rounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stream_id INT NOT NULL,
  round_name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  form_link VARCHAR(500) NOT NULL,
  FOREIGN KEY (stream_id) REFERENCES streams(id)
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  stream_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_email_stream (email, stream_id),
  FOREIGN KEY (stream_id) REFERENCES streams(id)
);

INSERT IGNORE INTO streams (name) VALUES
  ('Engineering'), ('Pharmacy'), ('MBA'), ('MCA');
