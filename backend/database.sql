-- Create database
CREATE DATABASE IF NOT EXISTS rk_enterprise;
USE rk_enterprise;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact queries table
CREATE TABLE IF NOT EXISTS contact_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  number VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  specifications JSON,
  status INT DEFAULT 1 COMMENT '1=active, 0=inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
-- Password is hashed using bcrypt
INSERT INTO admin_users (username, password) VALUES 
('admin', '$2b$10$TiICu3WXp.iy9B1h2IrTJujrvhTqYoKc1qBG8PxgUBD/n2ksApf32');

-- Insert sample products
INSERT INTO products (name, image, summary, description, specifications, status) VALUES 
(
  'Super 33+ Tape',
  'assets/img/products/bopptap.jpg',
  '33+ Vinyl Electrical Tape is a professional-grade tape that provides electrical insulation for low to high-voltage wires and cables rated up to 600V',
  'The combination of the pressure-sensitive, rubber-resin adhesive and the PVC backing offers electrical and mechanical protection Provides high resistance to UV rays, abrasion, moisture, alkalis, acids, corrosion and varying weather conditions Tensile strength rating of 15 lbs. per inch meets professional electrical standards.',
  '[{"label":"Width","value":"19mm"},{"label":"Length","value":"20mtr"},{"label":"Colours","value":"Black"},{"label":"Brands","value":"3M"}]',
  1
),
(
  'Temflex 150',
  'assets/img/products/tap.jpg',
  'Premium Quality Electrical Insulation Tapes for cable protection and insulation',
  'Ideal for wire harness, electrical insulation, bundling wires and cables, and basic DIY and hardware applications Suitable for ambient indoor uses.',
  '[{"label":"Brands","value":"3M"},{"label":"Colour","value":"Black, Red, Blue, Yellow, Green"},{"label":"Width","value":"12mm, 15mm, 18mm"},{"label":"Length","value":"6mtr, 8mtr"}]',
  1
),
(
  'Mastic Tape Compound 2229',
  'assets/img/products/mastictape.jpg',
  'Ideal for insulating, padding and sealing of high-voltage cables and accessories',
  '3M™ Scotch-Seal™ Tape 2229 has a UV-resistant pad with a rubber backing, as well as good self-healing properties after being cut or punctured.Tacky mastic adhesive provides excellent adherence over irregular surfaces Safeguards electrical connections, sealing ducts and cable end seals Ideal for insulating, padding and sealing of high-voltage cables and accessories, Withstands temperatures up to 194 degrees F (90 degrees C).',
  '[{"label":"Brands","value":"3M"},{"label":"Colour","value":"Black"},{"label":"Width","value":"38.1mm"},{"label":"Tape Measures","value":"1 1/2in x 30ft x 125 mil"}]',
  1
),
(
  'Wooden Stick',
  'assets/img/products/woodenstick.jpg',
  'At The time Of Winding Of Submersible Motor.',
  'We make all type of wooden stick used in submersible pumps, electric motors and all size are available as per customer requirement.',
  '[{"label":"Shape","value":"Cylindrical"},{"label":"Material Type","value":"Wood"}]',
  1
);

-- Note: To create a new admin password, use this Node.js code:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('your-password', 10);
-- console.log(hash);
