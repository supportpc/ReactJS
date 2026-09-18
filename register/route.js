import { NextResponse } from "next/server";
import pool from "@/config/connection";
import bcrypt from "bcryptjs";
import { uploadFile } from "@/utils/uploadFile";
import { isAuthenticated, authorizeRoles } from "@/middlewares/auth";
import logger from "@/winston/config";
import os from "os";


const interfaces = os.networkInterfaces();

const macAddresses = Object.values(interfaces)
    .flat()
    .filter(Boolean)
    .map((network) => network.mac)
    .filter((mac) => mac && mac !== "00:00:00:00:00:00");


export async function POST(req) {
    let conn;

    try {
        const formData = await req.formData();

        const name = formData.get("name");
        const email = formData.get("email");
        const mobile = formData.get("mobile");
        // const password = formData.get("password");
        // const avatar = formData.get("avatar");

        // Validation
        if (!name || !email || !mobile) {
            return NextResponse.json(
                { success: false, message: "All fields required" },
                { status: 400 }
            );
        }

        // ✅ Upload file using utility
        // const avatarPath = await uploadFile(avatar, "avatar");


        // ✅ Secure password
        // const hashedPassword = await bcrypt.hash(password, 10);

        //         conn = await pool.getConnection();

        //         await conn.query(
        //             `INSERT INTO users (name, email, mobile, last_login_at)
        //    VALUES (?, ?, ?, NOW())`,
        //             [name, email, mobile]
        //         );


        //         const [rows] = await conn.query(
        //             `SELECT id, name, email, mobile FROM users WHERE email = ? LIMIT 1`,
        //             [email]
        //         );


        const forwardedFor = req.headers.get("x-forwarded-for");

        const ip =
            forwardedFor?.split(",")[0].trim() ||
            req.headers.get("x-real-ip") ||
            null;
        const response = await fetch(`https://ipwho.is/${ip}`);

        const data = await response.json();

        const logData = {
            name: name,
            email: email,
            mobile: mobile,
            userAgent: req.headers["user-agent"] || null,
            mac_adedd: macAddresses || [],
            data: data,
            googleMapLocation:
                data.latitude != null && data.longitude != null
                    ? `https://www.google.com/maps/place/${data.latitude},${data.longitude}`
                    : null,
        };

        logger.error(JSON.stringify(logData));

        const {
            flag,
            readme,
            borders,
            is_eu,
            continent_code,
            ...cleanData
        } = data;

        cleanData.latitude =
            data.latitude != null
                ? `${String(data.latitude).slice(0, 2)}.*******`
                : null;

        cleanData.longitude =
            data.longitude != null
                ? `${String(data.longitude).slice(0, 2)}.*******`
                : null;

        cleanData.macAddresses = macAddresses || [];

        return NextResponse.json({
            success: true,
            message: "SECURITY ALERT: Unauthorized activity detected. System information and user live geolocation data have been recorded.",
            user: cleanData
        });

    } catch (error) {
        logger.info("Error:", error);
        return NextResponse.json(
            { success: false, message: "Registration failed" },
            { status: 500 }
        );
    } finally {
        if (conn) conn.release();
    }
}