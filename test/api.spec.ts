import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../src/server';
import { runMigrations } from '../src/db';
import axios from 'axios';


describe("POST /posts", () => {
    let app: Express;

    beforeEach(() => {
        runMigrations();
        app = createServer();
    })

    it("should create a post", async () => {
        await request(app)
            .post("/posts")
            .send({
                title: "Teste post",
                content: "Este é um post de teste para o blog",
                tags: ["teste", "post", "blog"]
            })
            .expect(201);
    });
});


describe("POST /posts with axios", () => {
    it("should create a post", async () => {
        const response = await axios.post("http://localhost:8000/posts", {
            title: "Teste post",
            content: "Este é um post de teste para o blog",
            tags: ["teste", "post", "blog"]
        })
        expect(response.status).toBe(201);
    })
});