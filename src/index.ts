import { createServer } from './server';
import { runMigrations, closeConnection } from './db';

runMigrations();
const app = createServer();

app.listen('8000', () => {
    console.log('Server started at port 8000');
});

process.on("SIGINT", () => {
    closeConnection();
});