const pool = require("../config/connection");
const getResetPasswordToken = require('../utils/getResetPasswordToken');
const ErrorHandler = require('../utils/errorHandler');
const {
    generateVerificationOTPEmail,
    generateWelcomeEmail,
    generateOrderConfirmationEmail,
    generatePasswordResetEmail
} = require('../utils/emailTemplates');

const { trim } = require('../utils/trim');
const { offer } = require('../utils/offer');
const { enquiry } = require('../utils/enquiry');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendGmail = require('../utils/sendGmail');
const crypto = require('crypto');
const winston = require('../winston/config');
const path = require("path");
const fs = require("fs");


exports.getInvoice = catchAsyncErrors(async (req, res) => {
    let conn;

    try {
        const { orderId } = req.query;

        const userId = req.user?.id;
        const role = req.user?.role;

        console.log("INVOICE REQUEST:", {
            orderId,
            userId,
            role
        });

        // Must be logged in
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Login required"
            });
        }

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        conn = await pool.getConnection();

        let rows;

        // ==========================================
        // ADMIN
        // ==========================================
        if (role === "admin") {

            [rows] = await conn.query(
                `SELECT order_id, user_id, path
                 FROM orders
                 WHERE order_id = ?
    LIMIT 1`,
                [orderId]
            );

        }
        // ==========================================
        // NORMAL USER
        // ==========================================
        else {

            [rows] = await conn.query(
                `SELECT order_id, user_id, path
                 FROM orders
                 WHERE order_id = ?
    AND user_id = ?
        LIMIT 1`,
                [orderId, userId]
            );
        }

        // Order does not belong to user / does not exist
        if (!rows.length) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this invoice"
            });
        }

        // ==========================================
        // PDF FILE
        // ==========================================
        const filePath = path.join(
            process.cwd(),
            "bill",
            `${orderId}.pdf`
        );

        console.log("INVOICE FILE:", filePath);

        // Invoice not generated yet
        if (!fs.existsSync(filePath)) {
            return res.status(200).json({
                success: true,
                invoiceAvailable: false
            });
        }

        // ==========================================
        // SEND PDF
        // ==========================================
        const pdfBuffer = fs.readFileSync(filePath);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename = "${orderId}.pdf"`
        );

        res.setHeader(
            "Content-Length",
            pdfBuffer.length
        );

        return res.status(200).send(pdfBuffer);

    } catch (error) {

        console.error("GET INVOICE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to open invoice"
        });

    } finally {

        if (conn) {
            conn.release();
        }
    }
});