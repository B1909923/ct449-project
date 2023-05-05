const { ObjectId } = require("mongodb");
class AuthorServices {
    constructor(client) {
        this.Author = client.db().collection("authors");
    }
    extractConactData(payload) {
        const author = {
            name: payload.name,
        };
        Object.keys(author).forEach((key) => {
            author[key] === undefined && delete author[key];
        });
        return author;
    }
    async create(payload) {
        const author = this.extractConactData(payload);
        const result = await this.Author.findOneAndUpdate(
            author,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Author.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.Author.find({
            name: { $regex: new RegExp(name), $options: ";" },
        });
    }
    async findById(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        return await this.Author.findOne(filter);
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Author.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.Author.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll() {
        const result = await this.Author.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = AuthorServices;
