const { ObjectId } = require("mongodb");
class BookServices {
    constructor(client) {
        this.Book = client.db().collection("books");
    }
    extractConactData(payload) {
        const book = {
            title: payload.title,
            subtitle: payload.subtitle,
            author: payload.author,
            image: payload.image,
            description: payload.description,
            favorite: payload.favorite,
        };
        Object.keys(book).forEach((key) => {
            book[key] === undefined && delete book[key];
        });
        return book;
    }
    async create(payload) {
        const book = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: { favorite: book.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }
    async findByName(title) {
        return await this.Book.find({
            title: { $regex: new RegExp(title), $options: ";" },
        });
    }
    async findById(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        return await this.Book.findOne(filter);
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite() {
        return await this.Book.find({ favorite: true });
    }
    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = BookServices;
