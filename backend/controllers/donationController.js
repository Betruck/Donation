const db = require('../config/db');

// Store new donation
exports.createDonation = (req, res) => {
    const { userId, donationType, amount, clothingType, itemCount, otherType } = req.body;

    const sql = `INSERT INTO donations (user_id, donation_type, amount, clothing_type, item_count, other_type) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [userId, donationType, amount || null, clothingType || null, itemCount || null, otherType || null], (err, result) => {
        if (err) {
            console.error('Error storing donation:', err);
            return res.status(500).json({ success: false, message: 'Error storing donation' });
        }
        res.status(201).json({ success: true, message: 'Donation created successfully', donationId: result.insertId });
    });
};

// Get user donations
exports.getUserDonations = (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT * FROM donations WHERE user_id = ?`;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err);
            return res.status(500).json({ success: false, message: 'Error fetching donations' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No donations found for this user' });
        }

        res.status(200).json({ success: true, donations: results });
    });
};

// Get total contributions (sum of monetary and clothing donations)
exports.getUserTotalContributions = (req, res) => {
    const userId = req.params.userId;

    const sqlMonetary = `SELECT SUM(amount) AS totalMonetary FROM donations WHERE user_id = ? AND donation_type = 'monetary'`;
    const sqlClothing = `SELECT SUM(item_count) AS totalClothing FROM donations WHERE user_id = ? AND donation_type = 'clothing'`;

    db.query(sqlMonetary, [userId], (err, monetaryResult) => {
        if (err) {
            console.error('Error fetching total monetary donations:', err);
            return res.status(500).json({ success: false, message: 'Error fetching total monetary donations' });
        }

        db.query(sqlClothing, [userId], (err, clothingResult) => {
            if (err) {
                console.error('Error fetching total clothing donations:', err);
                return res.status(500).json({ success: false, message: 'Error fetching total clothing donations' });
            }

            res.status(200).json({
                success: true,
                totalContributions: {
                    monetary: monetaryResult[0].totalMonetary || 0,
                    clothing: clothingResult[0].totalClothing || 0
                }
            });
        });
    });
};
