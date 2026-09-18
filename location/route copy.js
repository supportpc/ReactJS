import { NextResponse } from "next/server";
import pool from "@/config/connection";
import bcrypt from "bcryptjs";
import path from "path";
import { uploadFile } from "@/utils/uploadFile";
import { isAuthenticated, authorizeRoles } from "@/middlewares/auth";
import logger from "@/winston/config";
const { Reader } = require("@maxmind/geoip2-node");


const dbPath = path.join(
    process.cwd(),
    "/winston/GeoLite2-City.mmdb"
);

const geoReader = await Reader.open(dbPath);



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



        const ip = "165.101.109.58";
        // req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        // req.socket.remoteAddress;


        // const response = await fetch(`https://ipwho.is/${ip}`);

        // const data = await response.json();

        // const logData = { userAgent: req.headers["user-agent"] || null, data, googleMapLocation: data.latitude != null && data.longitude != null ? `https://www.google.com/maps/place/${data.latitude},${data.longitude}` : null, };

        // logger.error(JSON.stringify(logData));


        const data = geoReader.city(ip);

        const logData = {
            ip,
            method: req.method,
            url: req.originalUrl || req.url,
            userAgent: req.headers["user-agent"] || null,

            country: data.country?.names?.en || null,
            region: data.subdivisions?.[0]?.names?.en || null,
            city: data.city?.names?.en || null,
            postal: data.postal?.code || null,

            latitude: data.location?.latitude || null,
            longitude: data.location?.longitude || null,
            accuracyRadius: data.location?.accuracyRadius || null,
            timezone: data.location?.timeZone || null,

            googleMapLocation:
                data.location?.latitude != null &&
                    data.location?.longitude != null
                    ? `https://www.google.com/maps/place/${data.location.latitude},${data.location.longitude}`
                    : null,
        };

        logger.error(JSON.stringify(logData));



        return NextResponse.json({
            success: true,
            message: "User registered",
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