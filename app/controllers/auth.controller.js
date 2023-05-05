const AuthServices = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    } else if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    let data = req.body;
    data.is_admin = false;
    try {
        const AuthService = new AuthServices(MongoDB.client);
        const document = await AuthService.create(data);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating the user"));
    }
};
exports.login = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    let data = {
        username: req.body.username,
        password: req.body.password,
    };
    try {
        const AuthService = new AuthServices(MongoDB.client);
        const document = await AuthService.find(data);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An error occurred while creating the user"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const AuthService = new AuthServices(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await AuthService.findByName(name);
        } else {
            documents = await AuthService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving users"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const AuthService = new AuthServices(MongoDB.client);
        const document = await AuthService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving user with id=${req.params.id}`));
    }
};
