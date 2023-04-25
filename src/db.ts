import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database(':memory:');

export function runMigrations() {
    db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255) NOT NULL, content TEXT NOT NULL, status VARCHAR(50) DEFAULT 'draft', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL);");
    db.run(`CREATE TABLE tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            id_post INTEGER, 
            slug VARCHAR(255) NOT NULL, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
            deleted_at DATETIME DEFAULT NULL,
            FOREIGN KEY(id_post) REFERENCES posts(id));`);
}

export function closeConnection() {
    db.close();
}