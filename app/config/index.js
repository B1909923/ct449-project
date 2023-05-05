const config = {
    app: {
        port: process.env.PORT || 5000,
    },
    db: {
        uri: process.env.DB_URI + process.env.DBS_NAME || "mongodb://127.0.0.1:27017/reviewbook",
    },
};
module.exports = config;
