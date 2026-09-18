require("dotenv").config({
    path: ".env.local",
});

const logger = require("../winston/config");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { ZipArchive } = require("archiver");
const sendGmail = require("../utils/sendGmail");

const backupDir = path.join(__dirname, "../bks");

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, {
        recursive: true,
    });
}

async function runBackup() {

    const now = new Date();

    const date = now
        .toISOString()
        .replace(/T/, "_")
        .replace(/:/g, "-")
        .split(".")[0];

    const sqlFile = path.join(
        backupDir,
        `nus_academy_${date}.sql`
    );

    const zipFile = path.join(
        backupDir,
        `nus_academy_${date}.zip`
    );

    const args = [
        `--host=${process.env.DB_HOST}`,
        `--user=${process.env.DB_USER}`,
        `--password=${process.env.DB_PASSWORD}`,
        "--single-transaction",
        "--routines",
        "--triggers",
        "--events",
        process.env.DB_NAME,
    ];


    await new Promise((resolve, reject) => {

        execFile(
            "mysqldump",
            args,
            {
                maxBuffer: 1024 * 1024 * 500,
            },
            (error, stdout, stderr) => {

                if (error) {
                    logger.error(
                        "Database backup failed:",
                        error
                    );

                    if (stderr) {
                        logger.error(stderr);
                    }

                    reject(error);
                    return;
                }

                try {

                    fs.writeFileSync(
                        sqlFile,
                        stdout
                    );

                    resolve();

                } catch (err) {

                    reject(err);
                }
            }
        );

    });

    try {

        await createZip(
            sqlFile,
            zipFile
        );

        await sendGmail.sendMail({

            from:
                `"COMPANY NAME" <${process.env.EMAIL_ADDRESS}>`,

            to:
                process.env.BACKUP_EMAIL,

            subject:
                `Daily Database Backup - COMPANY - ${date}`,

            text:
                `COMPANY daily database backup.\n\n` +
                `Backup date: ${date}\n\n` +
                `The database backup is attached.`,

            attachments: [
                {
                    filename:
                        path.basename(zipFile),

                    path:
                        zipFile,
                },
            ],
        });

        if (fs.existsSync(sqlFile)) {
            fs.unlinkSync(sqlFile);
        }

        deleteOldBackups();


    } catch (err) {

        logger.error(
            "Backup/email process failed:",
            err
        );

        throw err;
    }
}


function createZip(sourceFile, outputFile) {

    return new Promise((resolve, reject) => {

        const output =
            fs.createWriteStream(outputFile);

        const archive =
            new ZipArchive({
                zlib: {
                    level: 9,
                },
            });

        output.on("close", resolve);

        output.on("error", reject);

        archive.on("error", reject);

        archive.on("warning", (err) => {

            if (err.code !== "ENOENT") {
                reject(err);
            }
        });

        archive.pipe(output);

        archive.file(
            sourceFile,
            {
                name: path.basename(sourceFile),
            }
        );

        archive.finalize();
    });
}


function deleteOldBackups() {

    const files =
        fs.readdirSync(backupDir);

    const thirtyDaysAgo =
        Date.now() -
        (30 * 24 * 60 * 60 * 1000);

    for (const file of files) {

        if (!file.endsWith(".zip")) {
            continue;
        }

        const filePath =
            path.join(backupDir, file);

        const stats =
            fs.statSync(filePath);

        if (stats.mtimeMs < thirtyDaysAgo) {

            fs.unlinkSync(filePath);

        }
    }
}


// IMPORTANT
module.exports = runBackup;