
require('dotenv').config(); // Load environment variables

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  JWT_SECRET: process.env.JWT_SECRET || '09f16fcc44fa3de82cb44401db88954225fb99a8aa4eb29e48c0b2d33fa32a2b',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Database Configuration
  DB_CONFIG: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rk_enterprise',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectTimeout: 10000, // 10 seconds
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  
  // Database Tables (for reference)
  DB_TABLES: {
    ADMIN_USERS: 'admin_users',
    PRODUCTS: 'products',
    CONTACT_QUERIES: 'contact_queries'
  },
  
  // File Upload Configuration
  UPLOAD: {
    DIR: path.join(__dirname, '../public/assets/img/products'),
    MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: /jpeg|jpg|png|gif/,
    ALLOWED_MIMETYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  },
  
  CORS_OPTIONS: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

const app = express();

// ==================================================
// DATABASE CONNECTION
// ==================================================
const db = mysql.createConnection(CONFIG.DB_CONFIG);

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(CONFIG.UPLOAD.DIR)) {
      fs.mkdirSync(CONFIG.UPLOAD.DIR, { recursive: true });
    }
    cb(null, CONFIG.UPLOAD.DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: CONFIG.UPLOAD.MAX_SIZE },
  fileFilter: (req, file, cb) => {
    const extname = CONFIG.UPLOAD.ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
    const mimetype = CONFIG.UPLOAD.ALLOWED_TYPES.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
  }
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  });
};


const sendError = (res, statusCode, message, error = null) => {
  const response = { message };
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message || error;
  }
  return res.status(statusCode).json(response);
};

const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { message };
  if (data) {
    Object.assign(response, data);
  }
  return res.status(statusCode).json(response);
};


const parseProductSpecifications = (product) => ({
  ...product,
  specifications: product.specifications ? JSON.parse(product.specifications) : []
});

/**
 * Delete file from filesystem
 */
const deleteFile = (filePath) => {
  if (!filePath) {
    console.log('No file path provided for deletion');
    return;
  }

  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const fullPath = path.join(__dirname, '../public', cleanPath);
  
  console.log('Attempting to delete file:', fullPath);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath); // Use synchronous version for immediate deletion
      console.log('✓ File deleted successfully:', fullPath);
    } catch (err) {
      console.error('✗ Error deleting file:', fullPath, err.message);
    }
  } else {
    console.log('✗ File not found:', fullPath);
  }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return sendError(res, 400, 'Username and password are required');
    }

    // Query database
    const query = `SELECT * FROM ${CONFIG.DB_TABLES.ADMIN_USERS} WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return sendError(res, 500, 'Database error', err);
      }

      if (results.length === 0) {
        return sendError(res, 401, 'Invalid credentials');
      }

      const user = results[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return sendError(res, 401, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username }, 
        CONFIG.JWT_SECRET, 
        { expiresIn: CONFIG.JWT_EXPIRES_IN }
      );
      
      sendSuccess(res, 200, 'Login successful', {
        token,
        user: { id: user.id, username: user.username }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'An error occurred during login', error);
  }
});

// ==================================================
// USER MANAGEMENT ROUTES (Admin only)
// ==================================================

// Get All Users
app.get('/api/admin/users', verifyToken, (req, res) => {
  try {
    const query = `SELECT id, username, created_at FROM ${CONFIG.DB_TABLES.ADMIN_USERS} ORDER BY id ASC`;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fetch users error:', err);
        return sendError(res, 500, 'Failed to fetch users', err);
      }
      res.json({ users: results });
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Add New User
app.post('/api/admin/users', verifyToken, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return sendError(res, 400, 'Username and password are required');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    // Check if username already exists
    const checkQuery = `SELECT id FROM ${CONFIG.DB_TABLES.ADMIN_USERS} WHERE username = ?`;
    
    db.query(checkQuery, [username], async (err, results) => {
      if (err) {
        console.error('Check user error:', err);
        return sendError(res, 500, 'Database error', err);
      }

      if (results.length > 0) {
        return sendError(res, 400, 'Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertQuery = `INSERT INTO ${CONFIG.DB_TABLES.ADMIN_USERS} (username, password) VALUES (?, ?)`;
      
      db.query(insertQuery, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Add user error:', err);
          return sendError(res, 500, 'Failed to add user', err);
        }
        
        sendSuccess(res, 201, 'User added successfully', { 
          userId: result.insertId 
        });
      });
    });
  } catch (error) {
    console.error('Add user error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Update User
app.put('/api/admin/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid user ID');
    }

    // Validate input
    if (!username) {
      return sendError(res, 400, 'Username is required');
    }

    if (password && password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    // Check if username already exists (excluding current user)
    const checkQuery = `SELECT id FROM ${CONFIG.DB_TABLES.ADMIN_USERS} WHERE username = ? AND id != ?`;
    
    db.query(checkQuery, [username, id], async (err, results) => {
      if (err) {
        console.error('Check user error:', err);
        return sendError(res, 500, 'Database error', err);
      }

      if (results.length > 0) {
        return sendError(res, 400, 'Username already exists');
      }

      // Update user
      let updateQuery, params;
      
      if (password) {
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery = `UPDATE ${CONFIG.DB_TABLES.ADMIN_USERS} SET username = ?, password = ? WHERE id = ?`;
        params = [username, hashedPassword, id];
      } else {
        // Update only username
        updateQuery = `UPDATE ${CONFIG.DB_TABLES.ADMIN_USERS} SET username = ? WHERE id = ?`;
        params = [username, id];
      }
      
      db.query(updateQuery, params, (err, result) => {
        if (err) {
          console.error('Update user error:', err);
          return sendError(res, 500, 'Failed to update user', err);
        }
        
        if (result.affectedRows === 0) {
          return sendError(res, 404, 'User not found');
        }
        
        sendSuccess(res, 200, 'User updated successfully');
      });
    });
  } catch (error) {
    console.error('Update user error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Delete User
app.delete('/api/admin/users/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid user ID');
    }

    // Prevent deleting the logged-in user
    if (parseInt(id) === req.userId) {
      return sendError(res, 400, 'Cannot delete your own account');
    }

    const deleteQuery = `DELETE FROM ${CONFIG.DB_TABLES.ADMIN_USERS} WHERE id = ?`;
    
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Delete user error:', err);
        return sendError(res, 500, 'Failed to delete user', err);
      }
      
      if (result.affectedRows === 0) {
        return sendError(res, 404, 'User not found');
      }
      
      sendSuccess(res, 200, 'User deleted successfully');
    });
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// ==================================================
// FILE UPLOAD ROUTES
// ==================================================

// Image Upload (Admin only)
app.post('/api/admin/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No file uploaded');
    }
    
    const imagePath = `assets/img/products/${req.file.filename}`;
    
    sendSuccess(res, 200, 'File uploaded successfully', {
      path: imagePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    sendError(res, 500, 'Upload failed', error);
  }
});

// ==================================================
// CONTACT/QUERIES ROUTES
// ==================================================

// Submit Contact Form (Public)
app.post('/api/contact/submit', (req, res) => {
  try {
    const { name, email, number, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return sendError(res, 400, 'Name, email, and message are required');
    }

    const query = `INSERT INTO ${CONFIG.DB_TABLES.CONTACT_QUERIES} (name, email, number, subject, message) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [name, email, number, subject, message], (err, result) => {
      if (err) {
        console.error('Contact form error:', err);
        return sendError(res, 500, 'Failed to submit query', err);
      }
      sendSuccess(res, 201, 'Query submitted successfully', { id: result.insertId });
    });
  } catch (error) {
    console.error('Contact form error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Get All Contact Queries (Admin only)
app.get('/api/queries', verifyToken, (req, res) => {
  try {
    const query = `SELECT * FROM ${CONFIG.DB_TABLES.CONTACT_QUERIES} ORDER BY created_at DESC`;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fetch queries error:', err);
        return sendError(res, 500, 'Failed to fetch queries', err);
      }
      res.json({ queries: results });
    });
  } catch (error) {
    console.error('Fetch queries error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Delete Contact Query (Admin only)
app.delete('/api/queries/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid query ID');
    }

    const query = `DELETE FROM ${CONFIG.DB_TABLES.CONTACT_QUERIES} WHERE id = ?`;
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Delete query error:', err);
        return sendError(res, 500, 'Failed to delete query', err);
      }
      
      if (result.affectedRows === 0) {
        return sendError(res, 404, 'Query not found');
      }
      
      sendSuccess(res, 200, 'Query deleted successfully');
    });
  } catch (error) {
    console.error('Delete query error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// ==================================================
// PRODUCT ROUTES
// ==================================================

// Get All Active Products (Public)
app.get('/api/products', (req, res) => {
  try {
    const query = `SELECT * FROM ${CONFIG.DB_TABLES.PRODUCTS} WHERE status = 1 ORDER BY created_at DESC`;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fetch products error:', err);
        return sendError(res, 500, 'Failed to fetch products', err);
      }
      
      const products = results.map(parseProductSpecifications);
      res.json({ products });
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Get All Products - Including Inactive (Admin only)
app.get('/api/admin/products', verifyToken, (req, res) => {
  try {
    const query = `SELECT * FROM ${CONFIG.DB_TABLES.PRODUCTS} ORDER BY created_at DESC`;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fetch products error:', err);
        return sendError(res, 500, 'Failed to fetch products', err);
      }
      
      const products = results.map(parseProductSpecifications);
      res.json({ products });
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Get Single Product by ID (Public)
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid product ID');
    }

    const query = `SELECT * FROM ${CONFIG.DB_TABLES.PRODUCTS} WHERE id = ?`;
    
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Fetch product error:', err);
        return sendError(res, 500, 'Failed to fetch product', err);
      }
      
      if (results.length === 0) {
        return sendError(res, 404, 'Product not found');
      }
      
      const product = parseProductSpecifications(results[0]);
      res.json({ product });
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Create New Product (Admin only)
app.post('/api/admin/products', verifyToken, upload.single('image'), (req, res) => {
  try {
    const { name, summary, description, specifications, status } = req.body;

    // Validate required fields
    if (!req.file) {
      return sendError(res, 400, 'Product image is required');
    }

    if (!name || !summary) {
      return sendError(res, 400, 'Required fields: name, summary');
    }

    const imagePath = `assets/img/products/${req.file.filename}`;

    const query = `
      INSERT INTO ${CONFIG.DB_TABLES.PRODUCTS} 
      (name, image, summary, description, specifications, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      name.trim(),
      imagePath,
      summary.trim(),
      description?.trim() || null,
      specifications || null,
      status !== undefined ? parseInt(status) : 1
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Add product error:', err);
        // Delete uploaded image if database insert fails
        deleteFile(imagePath);
        return sendError(res, 500, 'Failed to add product', err);
      }
      
      sendSuccess(res, 201, 'Product added successfully', { 
        productId: result.insertId 
      });
    });
  } catch (error) {
    console.error('Add product error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Update Product (Admin only)
app.put('/api/admin/products/:id', verifyToken, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, summary, description, specifications, status, existingImage } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid product ID');
    }

    // Validate required fields
    if (!name || !summary) {
      return sendError(res, 400, 'Required fields: name, summary');
    }

    // Determine image path
    const imagePath = req.file 
      ? `assets/img/products/${req.file.filename}` 
      : existingImage;

    if (!imagePath) {
      return sendError(res, 400, 'Product image is required');
    }

    // Delete old image if new one uploaded
    if (req.file && existingImage) {
      console.log('New image uploaded, deleting old image:', existingImage);
      deleteFile(existingImage);
    }

    const query = `
      UPDATE ${CONFIG.DB_TABLES.PRODUCTS} 
      SET name = ?, image = ?, summary = ?, 
          description = ?, specifications = ?, status = ?
      WHERE id = ?
    `;
    
    const params = [
      name.trim(),
      imagePath,
      summary.trim(),
      description?.trim() || null,
      specifications || null,
      status !== undefined ? parseInt(status) : 1,
      id
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Update product error:', err);
        // Delete new uploaded image if database update fails
        if (req.file) {
          deleteFile(imagePath);
        }
        return sendError(res, 500, 'Failed to update product', err);
      }
      
      if (result.affectedRows === 0) {
        return sendError(res, 404, 'Product not found');
      }
      
      sendSuccess(res, 200, 'Product updated successfully');
    });
  } catch (error) {
    console.error('Update product error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Toggle Product Status (Admin only)
app.patch('/api/admin/products/:id/status', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid product ID');
    }

    // Validate status
    if (status !== 0 && status !== 1) {
      return sendError(res, 400, 'Status must be either 0 (inactive) or 1 (active)');
    }

    const query = `UPDATE ${CONFIG.DB_TABLES.PRODUCTS} SET status = ? WHERE id = ?`;
    
    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Update status error:', err);
        return sendError(res, 500, 'Failed to update product status', err);
      }
      
      if (result.affectedRows === 0) {
        return sendError(res, 404, 'Product not found');
      }
      
      sendSuccess(res, 200, 'Product status updated successfully');
    });
  } catch (error) {
    console.error('Update status error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});

// Delete Product (Admin only)
app.delete('/api/admin/products/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, 'Invalid product ID');
    }
    
    // Get product to find its image
    const selectQuery = `SELECT image FROM ${CONFIG.DB_TABLES.PRODUCTS} WHERE id = ?`;
    
    db.query(selectQuery, [id], (err, results) => {
      if (err) {
        console.error('Delete product error:', err);
        return sendError(res, 500, 'Failed to fetch product', err);
      }
      
      if (results.length === 0) {
        return sendError(res, 404, 'Product not found');
      }
      
      const product = results[0];
      console.log('Product to delete:', { id, image: product.image });
      
      // Delete associated image file first
      if (product.image) {
        console.log('Deleting product image:', product.image);
        deleteFile(product.image);
      } else {
        console.log('No image to delete for product:', id);
      }
      
      // Then delete from database
      const deleteQuery = `DELETE FROM ${CONFIG.DB_TABLES.PRODUCTS} WHERE id = ?`;
      
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('Delete product error:', err);
          return sendError(res, 500, 'Failed to delete product', err);
        }
        console.log('Product deleted from database:', id);
        sendSuccess(res, 200, 'Product deleted successfully');
      });
    });
  } catch (error) {
    console.error('Delete product error:', error);
    sendError(res, 500, 'An error occurred', error);
  }
});


app.use((req, res) => {
  sendError(res, 404, 'Route not found');
});


app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 400, 'File size too large. Maximum 5MB allowed');
    }
    return sendError(res, 400, 'File upload error', err);
  }
  
  sendError(res, 500, 'Internal server error', err);
});

// ==================================================
// START SERVER
// ==================================================
app.listen(CONFIG.PORT, () => {
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

