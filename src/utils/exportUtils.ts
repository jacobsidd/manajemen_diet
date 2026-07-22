import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { HospitalConfig } from '../types';

export function generateDistributionPDF(
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number)[][],
  config: HospitalConfig
) {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Header Box / Kop Surat
  doc.setFillColor(30, 64, 175); // Dark Blue
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(config.name.toUpperCase(), 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${config.address} | Telp: ${config.phone}`, 14, 18);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 14, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(subtitle, 14, 39);

  // Table
  autoTable(doc, {
    startY: 44,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    margin: { left: 14, right: 14 },
  });

  // Footer Signatures
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 150;
  
  if (finalY < 160) {
    const todayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Dicetak pada: ${todayStr}`, 14, finalY + 15);

    doc.text('Petugas Penanggung Jawab Gizi,', 220, finalY + 15);
    doc.text('( _______________________ )', 220, finalY + 35);
    doc.text(config.chiefDietitian, 220, finalY + 40);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`SIPG: ${config.licenseNumber}`, 220, finalY + 44);
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportToExcel(filename: string, sheetName: string, headers: string[], rows: (string | number)[][]) {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
