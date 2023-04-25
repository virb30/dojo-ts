import slugify from 'slugify';
import { db } from '../db';
import { Request, Response } from 'express';

type PostInput = {
    title: string,
    content: string,
    tags: string[]
}

type PostData = {
    id: number | null
    title: string,
    content: string,
    status: 'draft' | 'published'
}

export async function createPost(req: Request, res: Response) {

    const data = req.body as PostInput;

    const post = {
        title: data.title,
        content: data.content,
        status: 'draft'
    } as PostData;

    db.serialize(() => {

        db.run("INSERT INTO posts (title, content, status) VALUES (?, ?,?);", [post.title, post.content, post.status], function (error) {
            if (error) {
                return res.status(500).send({ "message": error.message });
            }
            post.id = this.lastID;
            data.tags.forEach((tag) => {
                const tagSlug = slugify(tag);
                let insertedData: string[] = [];
                db.all<string>("SELECT slug FROM tags WHERE id_post = ?", [post.id], function (error, rows) {
                    if (error) {
                        return res.status(500).send({ "message": error.message });
                    }
                    insertedData = rows;
                });

                if (!insertedData.includes(tagSlug)) {
                    db.run("INSERT INTO tags (slug, id_post) VALUES (?, ?);", [tagSlug, post.id], function (error) {
                        if (error) {
                            return res.status(500).send({ "message": error.message });
                        }
                    });
                }
            });
        });
    });

    return res.status(201).send({ "message": "Post created" });
}