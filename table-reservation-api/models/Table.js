const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reservationExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Table', tableSchema);
