const express = require('express');
const Table = require('../models/Table');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('reservedBy', 'name email');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reserve a table
router.post('/reserve', fetchUser, async (req, res) => {
  try {
    const { number } = req.body;
    const userId = req.user.id;
    const table = await Table.findOne({ number });
    if (!table.reserved) {
      table.reserved = true;
      table.reservedBy = userId;
      await table.save();
      const populatedTable = await Table.findById(table._id).populate('reservedBy', 'name email');
      res.json(populatedTable);
    } else {
      res.status(400).json({ message: 'Table is already reserved' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unreserve a table
router.post('/unreserve', fetchUser, async (req, res) => {
  try {
    const { number } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role; // Fetch the user's role from the token
    const table = await Table.findOne({ number });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Admin can unreserve any table, regular user can only unreserve their own table
    if (userRole === 'admin' || (table.reserved && String(table.reservedBy) === String(userId))) {
      table.reserved = false;
      table.reservedBy = null;
      await table.save();
      res.json(table);
    } else {
      res.status(400).json({ message: 'You do not have permission to unreserve this table' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Admin unreserve a table
router.post('/admin/unreserve', fetchUser, async (req, res) => {
  try {
    const { number } = req.body;
    const userRole = req.user.role; // Fetch the user's role from the token

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const table = await Table.findOne({ number });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    table.reserved = false;
    table.reservedBy = null;
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
