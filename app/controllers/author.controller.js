const AuthorServices = require("../services/author.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const document = await AuthorService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating the author"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await AuthorService.findByName(name);
        } else {
            documents = await AuthorService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving authors"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const document = await AuthorService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Author not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving author with id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const document = await AuthorService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Author not found"));
        }
        return res.send({ message: "Author was updated successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error updating author with id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const document = await AuthorService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Author not found"));
        }
        return res.send({ message: "Author was deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete author with id=${req.params.id}`));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const AuthorService = new AuthorServices(MongoDB.client);
        const deletedCount = await AuthorService.deleteAll();
        return res.send({
            message: `${deletedCount} authors were deleted successfully`,
        });
    } catch (error) {
        return next(new ApiError(500, "An error occurred while removing all authors"));
    }
};
