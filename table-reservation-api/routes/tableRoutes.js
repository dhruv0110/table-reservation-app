const express = require('express');
const tableController = require('../controllers/tableController');
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();

router.get('/', tableController.getAllTables);

router.post('/reserve', fetchUser, tableController.reserveTable);
router.post('/unreserve', fetchUser, tableController.unreserveTable);
router.post('/admin/unreserve', fetchUser, tableController.adminUnreserveTable);

router.post('/add', tableController.addTable);
router.delete('/delete', tableController.deleteTable);

module.exports = router;
