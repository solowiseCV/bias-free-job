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
exports.convertFile = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const mammoth_1 = __importDefault(require("mammoth"));
const promises_1 = __importDefault(require("fs/promises")); // Use fs/promises for async operations
function convertDocxToExcel(filePath, outputExcelPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the .docx file as a buffer
            const fileBuffer = yield promises_1.default.readFile(filePath);
            // Parse the .docx file using mammoth to extract text, including table structure
            const result = yield mammoth_1.default.extractRawText({ buffer: fileBuffer });
            let textContent = result.value; // Extracted text, tables as tab-separated values
            // Fallback if no text is extracted
            if (!textContent || textContent.trim() === "") {
                textContent = "BUILDINGCOST"; // Default content
            }
            // Split into lines and remove empty lines
            const lines = textContent
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line !== "");
            // Skip the title (first line) and headers, then process data
            const dataLines = lines.slice(2); // Skip title and headers
            // Headers for the Excel table
            const headers = ["DATE", "NAME", "PURPOSE", "(N)DR", "(N)CR", "(N)BAL"];
            const data = [headers]; // Start with headers as the first row
            // Process each line to build rows
            let currentRow = [];
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Matches DD/MM/YYYY format
            for (const line of dataLines) {
                const cells = line.split("\t").map((cell) => cell.trim()); // Split by tabs
                // Check if the line starts with a date to start a new row
                if (cells.length > 0 && dateRegex.test(cells[0])) {
                    if (currentRow.length > 0) {
                        // Add the previous row (ensuring it has 6 columns, pad with empty if needed)
                        while (currentRow.length < 6)
                            currentRow.push("");
                        data.push(currentRow);
                    }
                    currentRow = [...cells]; // Start new row with the date line
                }
                else {
                    // Append to the current row (e.g., multi-line PURPOSE)
                    currentRow.push(...cells);
                }
            }
            // Add the last row if it exists
            if (currentRow.length > 0) {
                while (currentRow.length < 6)
                    currentRow.push("");
                data.push(currentRow);
            }
            // Create a new workbook and worksheet
            const wb = xlsx_1.default.utils.book_new();
            const ws = xlsx_1.default.utils.aoa_to_sheet(data);
            // Add the worksheet to the workbook
            xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
            // Generate and save the Excel file
            xlsx_1.default.writeFile(wb, outputExcelPath);
            console.log(`Excel file "${outputExcelPath}" has been generated at ${new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })}.`);
        }
        catch (error) {
            console.error("Error converting DOCX to Excel:", error);
            throw error;
        }
    });
}
const filePath = "./(BUILDING_COST)[1].docx";
const outputExcelPath = "./building_cost.xlsx";
const convertFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield convertDocxToExcel(filePath, outputExcelPath);
    }
    catch (error) {
        console.error("Failed to convert file:", error);
        throw error; // Let the caller handle the error if needed
    }
});
exports.convertFile = convertFile;
// import XLSX from "xlsx";
// import docx from "docx";
// import fs from "fs/promises";
// async function convertDocxToExcel(filePath: any, outputExcelPath: any) {
//   try {
//     const fileBuffer = await fs.readFile(filePath);
//     // Use a third-party library to extract text from DOCX buffer
//     const mammoth = require("mammoth");
//     const result = await mammoth.extractRawText({ buffer: fileBuffer });
//     const textContent = result.value;
//     const lines = textContent
//       .split("\n")
//       .filter((line: string) => line.trim() !== "");
//     const data =
//       lines.length > 0
//         ? [lines.map((line: string) => [line])]
//         : [["BUILDINGCOST"]];
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.aoa_to_sheet(data);
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
//     XLSX.writeFile(wb, outputExcelPath);
//     console.log(
//       `Excel file "${outputExcelPath}" has been generated at ${new Date().toLocaleString(
//         "en-US",
//         { timeZone: "Africa/Lagos" }
//       )}.`
//     );
//   } catch (error) {
//     console.error("Error converting DOCX to Excel:", error);
//     throw error;
//   }
// }
// const filePath = "./(BUILDING_COST)[1].docx";
// const outputExcelPath = "./building_cost.xlsx";
// export const convertFile = () => {
//   convertDocxToExcel(filePath, outputExcelPath);
// };
