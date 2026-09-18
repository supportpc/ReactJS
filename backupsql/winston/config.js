const fs = require("fs");
const path = require("path");
const winston = require("winston");


const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}


const { combine, timestamp, errors, json, colorize, printf } =
    winston.format;

const consoleFormat = printf(
    ({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    }
);



const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(process.cwd(), "logs", "app.log"),
            level: "error",
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true,
        }),

        new winston.transports.File({
            filename: path.join(process.cwd(), "logs", "app.log"),
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});

if (process.env.logging !== "off") {
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: combine(
                colorize(),
                timestamp(),
                errors({ stack: true }),
                consoleFormat
            ),
        })
    );
}

logger.stream = {
    write(message) {
        logger.info(message.trim());
    },
};

module.exports = logger;