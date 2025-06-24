"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient } = require("mongodb");
// Replace with your actual MongoDB connection string
const uri = process.env.DATABASE_URL;
const dbName = "BiasDb";
const collectionName = "user";
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(uri);
        try {
            yield client.connect();
            console.log("Connected to MongoDB");
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            const result = yield collection.updateMany({
                $or: [{ createdAt: null }, { createdAt: { $exists: false } }],
            }, {
                $set: { createdAt: new Date() },
            });
            console.log(`Updated ${result.modifiedCount} user(s).`);
        }
        catch (error) {
            console.error("Error updating documents:", error);
        }
        finally {
            yield client.close();
        }
    });
}
run();
