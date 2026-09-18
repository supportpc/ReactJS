require("dotenv").config({
    path: ".env.local",
});

const logger = require("../winston/config");

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const backupDir = path.join(__dirname, "../database-backups");

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();

const date = now.toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "-")
    .split(".")[0];

const backupFile = path.join(
    backupDir,
    `${process.env.DB_NAME}_${date}.sql`
);

const args = [
    `--host=${process.env.DB_HOST}`,
    `--user=${process.env.DB_USER}`,
    `--password=${process.env.DB_PASSWORD}`,
    "--single-transaction",
    "--routines",
    "--triggers",
    "--events",
    process.env.DB_NAME
];


execFile("mysqldump", args, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {

    if (error) {
        logger.error("Database backup failed:", error);
        logger.error(stderr);
        process.exit(1);
    }

    fs.writeFileSync(backupFile, stdout);


    // Delete backups older than 30 days
    const files = fs.readdirSync(backupDir);

    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    for (const file of files) {

        if (!file.endsWith(".sql")) {
            continue;
        }

        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtimeMs < thirtyDaysAgo) {
            fs.unlinkSync(filePath);
            logger.error(`Deleted old backup: ${file}`);
        }
    }

});