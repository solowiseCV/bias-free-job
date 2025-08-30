import XLSX from "xlsx";
import mammoth from "mammoth";
import fs from "fs/promises"; // Use fs/promises for async operations

async function convertDocxToExcel(filePath: string, outputExcelPath: string) {
  try {
    // Read the .docx file as a buffer
    const fileBuffer = await fs.readFile(filePath);

    // Parse the .docx file using mammoth to extract text, including table structure
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
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
    const data: string[][] = [headers]; // Start with headers as the first row

    // Process each line to build rows
    let currentRow: string[] = [];
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Matches DD/MM/YYYY format

    for (const line of dataLines) {
      const cells = line.split("\t").map((cell) => cell.trim()); // Split by tabs

      // Check if the line starts with a date to start a new row
      if (cells.length > 0 && dateRegex.test(cells[0])) {
        if (currentRow.length > 0) {
          // Add the previous row (ensuring it has 6 columns, pad with empty if needed)
          while (currentRow.length < 6) currentRow.push("");
          data.push(currentRow);
        }
        currentRow = [...cells]; // Start new row with the date line
      } else {
        // Append to the current row (e.g., multi-line PURPOSE)
        currentRow.push(...cells);
      }
    }

    // Add the last row if it exists
    if (currentRow.length > 0) {
      while (currentRow.length < 6) currentRow.push("");
      data.push(currentRow);
    }

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate and save the Excel file
    XLSX.writeFile(wb, outputExcelPath);

    console.log(
      `Excel file "${outputExcelPath}" has been generated at ${new Date().toLocaleString(
        "en-US",
        { timeZone: "Africa/Lagos" }
      )}.`
    );
  } catch (error) {
    console.error("Error converting DOCX to Excel:", error);
    throw error;
  }
}

const filePath = "./(BUILDING_COST)[1].docx";
const outputExcelPath = "./building_cost.xlsx";

export const convertFile = async () => {
  try {
    await convertDocxToExcel(filePath, outputExcelPath);
  } catch (error) {
    console.error("Failed to convert file:", error);
    throw error; // Let the caller handle the error if needed
  }
};
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
