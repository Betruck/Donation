const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register User
exports.register = (req, res) => {
    console.log('Register Request Body:', req.body);
    const { username, email, password } = req.body;

    // Check if the email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error during email check' });
        }

        if (results.length > 0) {
            // Email already exists
            return res.status(400).json({ success: false, message: 'Email is already registered, kindly proceed to login' });
        }

        // Hash the password and insert new user
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ success: false, message: 'Server error during password hashing' });
            }

            const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [username, email, hashedPassword], (error, result) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ success: false, message: 'Database error during registration' });
                }

                res.status(201).json({ success: true, message: 'User registered successfully' });
            });
        });
    });
};

// Login User
exports.login = (req, res) => {
    console.log('Login Request Body:', req.body);
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?'; // Login via username, adjust to email if needed
    db.query(sql, [username], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Database error during login' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = result[0];
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error during password comparison:', err);
                return res.status(500).json({ success: false, message: 'Server error during password check' });
            }

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }

            // Include the user object in the response
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: { // Send the user object
                    username: user.username,
                    email: user.email
                }
            });
        });
    });
};
