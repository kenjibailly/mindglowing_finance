"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
// Function to hash the password
function hashPassword(password) {
    // Use SHA-256 hashing algorithm
    const hashedPassword = crypto_1.default
        .createHash("sha256")
        .update(password)
        .digest("hex");
    return hashedPassword;
}
// Hash the provided password
const hashedPassword = hashPassword(process.env.MONGO_PASSWORD);
// Use the hashed password in the MongoDB connection string
const mongodb_URI = `mongodb://${process.env.MONGO_USER}:${hashedPassword}@mindglowing_finance_mongo_db:27017/mindglowing_finance`;
// Export the MongoDB URI
exports.default = mongodb_URI;
