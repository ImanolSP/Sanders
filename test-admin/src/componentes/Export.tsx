// src/componentes/Export.tsx

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportData = (data: any[], format: 'xlsx' | 'pdf' | 'csv') => {
  const exportToCSV = (csvData: any[], fileName: string) => {
    const csv = XLSX.utils.json_to_sheet(csvData);
    const csvBuffer = XLSX.write(
      { Sheets: { data: csv }, SheetNames: ['data'] },
      { bookType: "csv", type: "array" }
    );
    const blob = new Blob([csvBuffer], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  };

  const exportToXLSX = (xlsxData: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob(
      [excelBuffer],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" }
    );
    saveAs(dataBlob, fileName);
  };

  const exportToPDF = (pdfData: any[], fileName: string) => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(pdfData[0]);
    const tableRows = pdfData.map(item => Object.values(item));
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save(fileName);
  };

  const fileName = `export_${new Date().toISOString()}.${format}`;
  switch (format) {
    case 'xlsx':
      exportToXLSX(data, fileName);
      break;
    case 'pdf':
      exportToPDF(data, fileName);
      break;
    case 'csv':
      exportToCSV(data, fileName);
      break;
    default:
      console.error('Unsupported format');
  }
};