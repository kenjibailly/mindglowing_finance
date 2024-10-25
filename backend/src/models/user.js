"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the user schema
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    setup: { type: Boolean, required: true, default: false },
    date_format: { type: String, default: undefined },
    time_zone: { type: String, default: undefined },
    currency_name: { type: String, default: undefined },
    currency_symbol: { type: String, default: undefined },
    picture: { type: String, default: undefined },
    personal_information: {
        first_name: { type: String, default: undefined },
        last_name: { type: String, default: undefined },
        email: { type: String, default: undefined },
        company_name: { type: String, default: undefined },
    },
    address_information: {
        street: { type: String, default: undefined },
        street2: { type: String, default: undefined },
        city: { type: String, default: undefined },
        state: { type: String, default: undefined },
        zip: { type: String, default: undefined },
        country: { type: String, default: undefined },
    },
});
// Create the User model
const User = mongoose_1.default.model("User", userSchema);
// Export the User model
exports.default = User;
