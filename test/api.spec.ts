import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../src/server';
import { closeConnection, db, runMigrations } from '../src/db';
import axios from 'axios';


describe("POST /posts", () => {
    let app: Express;

    beforeEach(() => {
        console.log('before');
        app = createServer();
    });

    beforeAll(() => {
        console.log('migrations');
        runMigrations();
    });

    afterAll(() => {
        closeConnection();
        console.log('finished');
    });

    it("should create a post", async () => {
        await request(app)
            .post("/posts")
            .send({
                title: "Teste post",
                content: "Este é um post de teste para o blog",
                tags: ["teste", "post", "blog"]
            })
            .expect(201);

        const postsQuery = new Promise<{ total: number }>((resolve, reject) => db.get<{ total: number }>("SELECT COUNT(*) AS total FROM posts;", function (error, row) {
            if (error) {
                reject(error);
            }
            resolve(row);
        }));

        const postsTotal = await postsQuery;
        expect(postsTotal.total).toBe(1);

        const tagsQuery = new Promise<{ total: number }>((resolve, reject) => db.get<{ total: number }>("SELECT COUNT(*) AS total FROM tags;", function (error, row) {
            if (error) {
                reject(error);
            }
            resolve(row);
        }));

        const tagsTotal = await tagsQuery;
        expect(tagsTotal.total).toBe(3);
    });

    it.skip("example: fails creating a post", async () => {
        await request(app)
            .post("/posts")
            .send({
                title: "Teste post",
                content: "Este é um post de teste para o blog",
                tags: ["teste", "post", "blog"]
            })
            .expect(201);

        db.get<{ total: number }>("SELECT COUNT(*) AS total FROM posts;", function (error, row) {
            console.log('calledPosts');
        });

        db.get<{ total: number }>("SELECT COUNT(*) AS total FROM tags;", function (error, row) {
            console.log('calledTags');
        });
    });

    it.skip("should create a post with axios", async () => {
        const response = await axios.post("http://localhost:8000/posts", {
            title: "Teste post",
            content: "Este é um post de teste para o blog",
            tags: ["teste", "post", "blog"]
        })
        expect(response.status).toBe(201);
    });
});