const express = require('express');
const {
    getDashboardStats,
    getInvoices,
    createInvoice,
    updateInvoice,
    getInvoicesByUserId,
    createPayment,
    getElectricWaterStats,
    updatePaymentStatus,
} = require('../controllers/invoice.controller');
const invoiceRouter = express.Router();
const upload = require('../middlewares/upload');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

invoiceRouter.get('/electric-water', verifyToken, getElectricWaterStats);
invoiceRouter.get('/stats', verifyToken, getDashboardStats);
invoiceRouter.get('/user/:id', verifyToken, getInvoicesByUserId);
invoiceRouter.post('/create-payment', verifyToken, createPayment);
invoiceRouter.get('/:invoiceId/:userId/payment-status', verifyToken, updatePaymentStatus);
invoiceRouter.get('/', verifyToken, getInvoices);
invoiceRouter.post('/', verifyToken, authorizeRoles('admin'), upload.array('img', 5), createInvoice);
invoiceRouter.put('/:id', verifyToken, authorizeRoles('admin'), upload.array('img', 5), updateInvoice);

module.exports = invoiceRouter;
