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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.DATABASE_URL;
const client = new mongodb_1.MongoClient(uri);
function applyIndexes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const db = client.db();
            const profiles = db.collection("Profile");
            yield profiles.createIndex({ interestedRoles: 1 });
            yield profiles.createIndex({ experienceLevel: 1 });
            yield profiles.createIndex({ workMode: 1 });
            yield profiles.createIndex({ jobType: 1 });
            yield profiles.createIndex({ skills: 1 });
            yield profiles.createIndex({ industry: 1 });
            console.log("Indexes created successfully");
        }
        catch (error) {
            console.error("Error applying indexes:", error);
        }
        finally {
            yield client.close();
        }
    });
}
applyIndexes();
