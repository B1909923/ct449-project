const booksRouter = require("./book.route");
const authorsRouter = require("./author.route");
const authsRouter = require("./auth.route");
const ApiError = require("../api-error");

module.exports = (app) => {
    //handle apis
    app.use("/api/books", booksRouter);
    app.use("/api/authors", authorsRouter);
    app.use("/api/auths", authsRouter);

    // handle home api
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to book book application." });
    });
    // handle error when call  api
    app.use((req, res, next) => {
        return next(new ApiError(404, "Resource not found"));
    });

    app.use((err, req, res, next) => {
        return res.status(err.statusCode || 500).json({
            message: err.message || "Internal Server Error",
        });
    });
};
