/* eslint-disable eol-last */
/* eslint-disable indent */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
    } = request.payload;

    const id = nanoid(16);
    const finished = (readPage === pageCount);
    const reading = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
    };

    if (name != null) {
        if (!(readPage > pageCount)) {
            books.push(newBook);
            const isSuccess = books.filter((book) => book.id === id).length > 0;
            if (isSuccess) {
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    },
                });
                response.code(201);
                return response;
            }
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name: nameQuery, reading, finished } = request.query;
    const getResponse = (booksFiltered) => {
        const booksMaped = booksFiltered.map((book) => {
            const { id, name, publisher } = book;
            return { id, name, publisher };
        });
        const response = {
            status: 'success',
            data: {
                books: booksMaped,
            },
        };
        return response;
    };
    if (nameQuery) {
        return {
            status: 'success',
            data: {
                books: getResponse(books.filter((n) => n.name === nameQuery)),
            },
        };
    }
    if (reading) {
        return {
            status: 'success',
            data: {
                books: getResponse(books.filter((r) => r.reading === reading)),
            },
        };
    }
    if (finished) {
        return {
            status: 'success',
            data: {
                books: getResponse(books.filter((f) => f.finished === finished)),
            },
        };
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => {
                const { id, name, publisher } = book;
                return { id, name, publisher };
            }),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
    } = request.payload;
    const finished = (readPage === pageCount);
    const reading = false;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (name != null) {
        if (!(readPage > pageCount)) {
            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                    finished,
                    updatedAt,
                };
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil diperbarui',
                });
                response.code(200);
                return response;
            }
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};