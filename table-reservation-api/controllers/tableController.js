const Table = require('../models/Table');
const User = require('../models/User'); // Assuming you have a User model
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhruvsheth01102003@gmail.com',
    pass: 'jhhozekydjsadaao'
  }
});

const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate('reservedBy', 'name contact');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reserveTable = async (req, res) => {
  try {
    const { number } = req.body;
    const userId = req.user.id;
    const table = await Table.findOne({ number });

    if (!table.reserved) {
      table.reserved = true;
      table.reservedBy = userId;
      await table.save();
      const populatedTable = await Table.findById(table._id).populate('reservedBy');

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
};

const unreserveTable = async (req, res) => {
  try {
    const { number } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role; // Fetch the user's role from the token
    const table = await Table.findOne({ number });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (userRole === 'admin' || (table.reserved && String(table.reservedBy) === String(userId))) {
      const reservedByUser = await User.findById(table.reservedBy);
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
};

const adminUnreserveTable = async (req, res) => {
  try {
    const { number } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const table = await Table.findOne({ number });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const reservedByUser = await User.findById(table.reservedBy);
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
};

const addTable = async (req, res) => {
  try {
    const { number } = req.body;
    const table = new Table({ number });
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTable = async (req, res) => {
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
};

module.exports = {
  getAllTables,
  reserveTable,
  unreserveTable,
  adminUnreserveTable,
  addTable,
  deleteTable
};
