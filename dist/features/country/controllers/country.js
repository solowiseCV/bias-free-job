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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const response_util_1 = __importDefault(require("../../../utils/helpers/response.util"));
const country_service_1 = require("../services/country.service");
const countryService = new country_service_1.CountryService();
class CountryController {
    createCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = req.body;
                const newCountry = yield countryService.createCountry(country);
                new response_util_1.default(201, true, "Country Stored Successfully!", res, newCountry);
            }
            catch (err) {
                console.log("Failed to craete application: ", err);
                const status = err.statusCode || 500;
                new response_util_1.default(status, true, err.message, res, err);
            }
        });
    }
    // Get users applications
    getCountryList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countries = yield countryService.getCountryList();
                new response_util_1.default(200, true, "Successful!", res, countries);
            }
            catch (err) {
                console.log("Failed to get application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
    updateCounrtyList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = req.body;
                const id = req.params.id;
                const updatedCountry = yield countryService.updateCountry(id, country);
                new response_util_1.default(200, true, "Updated successfully!", res, updatedCountry);
            }
            catch (err) {
                console.log("Failed to get application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
    deleteCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const deleted = yield countryService.deleteCountry(id);
                new response_util_1.default(200, true, "Job posting retrieved successfully", res, deleted);
            }
            catch (err) {
                console.log("Failed to get application: ", err);
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.CountryController = CountryController;
