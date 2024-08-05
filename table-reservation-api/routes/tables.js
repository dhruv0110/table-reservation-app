const express = require('express');
const Table = require('../models/Table');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhruvsheth01102003@gmail.com',
    pass: 'jhhozekydjsadaao'
  }
});

// Utility function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'dhruvsheth01102003@gmail.com',
    to,
    subject,
    text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

// Utility function to unreserve a table
const unreserveTable = async (tableId) => {
  try {
    const table = await Table.findById(tableId);
    if (table) {
      const reservedByUser = await User.findById(table.reservedBy); // Get the user who reserved the table

      table.reserved = false;
      table.reservedBy = null;
      table.reservationExpiry = null;
      await table.save();

      // Send email notification
      if (reservedByUser) {
        await sendEmail(
          reservedByUser.email,
          'Table Unreserved',
          `Your reservation for table number ${table.number} has been automatically canceled due to expiry. Please book again if needed.`
        );
      }
    }
  } catch (error) {
    console.error('Error unreserving table:', error);
  }
};

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('reservedBy', 'name contact');
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
      const now = new Date();
      const expiryTime = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute from now

      table.reserved = true;
      table.reservedBy = userId;
      table.reservationExpiry = expiryTime;
      await table.save();

      // Set a timer to unreserve the table after 1 minute
      setTimeout(() => unreserveTable(table._id), 1 * 60 * 1000);

      const populatedTable = await Table.findById(table._id).populate('reservedBy');

      // Get user email
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const mailOptions = {
        from: 'dhruvsheth01102003@gmail.com',
        to: user.email,
        subject: 'Table Reserved',
        text: `Thank you for reserving a table. Your table number ${number} is reserved successfully.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error sending email' });
        } else {
          res.status(200).json({ message: 'Table reserved and email sent successfully', table: populatedTable });
        }
      });
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
      const reservedByUser = await User.findById(table.reservedBy); // Get the user who reserved the table
      table.reserved = false;
      table.reservedBy = null;
      await table.save();

      const mailOptions = {
        from: 'dhruvsheth01102003@gmail.com',
        to: reservedByUser.email,
        subject: 'Table Unreserved',
        text: `Your reservation for table number ${number} has been canceled. Please book again if needed.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error sending email' });
        } else {
          res.status(200).json({ message: 'Table unreserved and email sent successfully', table });
        }
      });
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

    const reservedByUser = await User.findById(table.reservedBy); // Get the user who reserved the table
    table.reserved = false;
    table.reservedBy = null;
    await table.save();

    const mailOptions = {
      from: 'dhruvsheth01102003@gmail.com',
      to: reservedByUser.email,
      subject: 'Table Unreserved',
      text: `Your reservation for table number ${number} has been canceled by the admin. Please book again if needed.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Table unreserved by admin and email sent successfully', table });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new table
router.post('/add', async (req, res) => {
  try {
    const { number } = req.body;
    const table = new Table({ number });
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a table
router.delete('/delete', async (req, res) => {
  try {
    const { number } = req.body;
    const table = await Table.findOneAndDelete({ number });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
