const BookServices = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.title) {
        return next(new ApiError(400, "Title can not be empty"));
    }
    try {
        const BookService = new BookServices(MongoDB.client);
        const document = await BookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating the book"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const BookService = new BookServices(MongoDB.client);
        const { title } = req.query;
        if (title) {
            documents = await BookService.findByName(title);
        } else {
            documents = await BookService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving books"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const BookService = new BookServices(MongoDB.client);
        const document = await BookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving book with id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const BookService = new BookServices(MongoDB.client);
        const document = await BookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was updated successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error updating book with id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const BookService = new BookServices(MongoDB.client);
        const document = await BookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete book with id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const BookService = new BookServices(MongoDB.client);
        const deletedCount = await BookService.deleteAll();
        return res.send({
            message: `${deletedCount} books were deleted successfully`,
        });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while removing all books"));
    }
};

exports.findAllFavorite = async (_req, res, next) => {
    try {
        const BookService = new BookServices(MongoDB.client);
        const documents = await BookService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving favorite books"));
    }
};
