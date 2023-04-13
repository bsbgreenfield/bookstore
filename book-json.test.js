process.env.NODE_ENV ="test"

const request = require('supertest')
const db = require('./db')
const app = require('./app')

afterAll(async function(){
await db.end();
})

afterEach(async function(){
    await db.query(`DELETE FROM books`)
})

describe("POST /books", function(){
    test("Should accept valid JSON for new book", async function(){
        let newBook = {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        let response = await request(app).post('/books').send(newBook)
        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual({"book" : newBook})
    })
})

describe("PUT /books/:isbn", function(){
    test("should return valid book JSON", async function(){
        let isbn = "0691161518"
        let newBook = {
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        await request(app).post('/books').send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
        let response = await request(app).put(`/books/${isbn}`).send(newBook)
        expect(response.statusCode).toEqual(200)
        newBook.isbn = isbn
        expect(response.body).toEqual({"book" : newBook})
    })
})
describe("POST /books", function(){
    test("Should reject invalid (empty) data", async function(){
        let newBook = { }
        let response = await request(app).post('/books').send(newBook)
        expect(response.statusCode).toEqual(400)
        expect(response.body.message[0]).toEqual("instance requires property \"isbn\"")
        expect(response.body.message[1]).toEqual("instance requires property \"amazon_url\"")
    })
})
describe("POST /books", function(){
    test("Should reject invalid data where isbn is int", async function(){
        let newBook = {
            "isbn": 691161518,
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        let response = await request(app).post('/books').send(newBook)
        expect(response.statusCode).toEqual(400)
        expect(response.body.message[0]).toEqual("instance.isbn is not of a type(s) string")
    })
})
describe("PUT /books/:isbn", function(){
    test("should reject invalid data where author is boolean", async function(){
        let isbn = "0691161518"
        let newBook = {
            "amazon_url": "http://a.co/eobPtX2",
            "author": true,
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        }
        await request(app).post('/books').send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
        let response = await request(app).put(`/books/${isbn}`).send(newBook)
        expect(response.statusCode).toEqual(400)
        expect(response.body.message[0]).toEqual("instance.author is not of a type(s) string")
    })
})

