const { ObjectId } = require("mongodb");
class AuthServices {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    extractConactData(payload) {
        const user = {
            name: payload.name,
            username: payload.username,
            password: payload.password,
            is_admin: payload.is_admin,
        };
        Object.keys(user).forEach((key) => {
            user[key] === undefined && delete user[key];
        });
        return user;
    }
    async create(payload) {
        const user = this.extractConactData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.User.find({
            name: { $regex: new RegExp(name), $options: ";" },
        });
    }
    async findById(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        return await this.User.findOne(filter);
    }
}
module.exports = AuthServices;
