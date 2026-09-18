require('dotenv').config({ path: '.env.local' });

const { createServer } = require('http');
const next = require('next');
const connection = require("./config/connection");
const logger = require("./winston/config");
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();

const PORT = process.env.PORT || 4000;
const schedule = require("node-schedule");
const runBackup = require("./config/bks.js");

// Static middleware
const serve = serveStatic(path.join(process.cwd(), 'public'), {
    index: false,
});


connection.getConnection((error) => {

    if (error) {

        logger.error(`Database connection failed: ${error.message}`);

        throw error;
    }

    logger.info('Database is connected successfully');

});

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION', {
        message: err.message,
        stack: err.stack,
    });

    console.error(err);
});

process.on('unhandledRejection', (reason) => {
    logger.error('UNHANDLED REJECTION', {
        message: reason?.message,
        stack: reason?.stack,
    });

});


let backupRunning = false;

schedule.scheduleJob(
    { hour: 2, minute: 0 },
    async () => {

        if (backupRunning) {
            return;
        }

        backupRunning = true;

        try {
            await runBackup();

        } catch (error) {

            logger.error(
                "Scheduled database backup failed:",
                error
            );

        } finally {

            backupRunning = false;
        }
    }
);


app.prepare().then(() => {

    createServer((req, res) => {

        serve(req, res, (err) => {

            if (err) {

                finalhandler(req, res)(err);

            } else {

                handle(req, res);
            }
        });

    }).listen(PORT, (err) => {

        if (err) {

            logger.error(`Error on server.js: ${err.message}`);

            throw err;
        }


        logger.info(`Server running on http://localhost:${PORT}`);
    });

});