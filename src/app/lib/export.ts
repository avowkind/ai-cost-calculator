
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CostResult } from '../types';
import { formatCurrency } from '../lib/utils';

export const exportResultsToCSV = (results: CostResult[]): void => {
  // Calculate total
  const totalCost = results.reduce(
    (total, result) => ({
      min: total.min + result.cost.min,
      max: total.max + result.cost.max
    }),
    { min: 0, max: 0 }
  );

  // Create CSV content
  let csvContent = 'Interaction,Model,Monthly Requests,Input Tokens,Output Tokens,Monthly Cost\n';
  
  // Add each result row
  results.forEach(result => {
    const inputTokens = result.inputTokens.min === result.inputTokens.max
      ? result.inputTokens.min.toLocaleString()
      : `${result.inputTokens.min.toLocaleString()} - ${result.inputTokens.max.toLocaleString()}`;
      
    const outputTokens = result.outputTokens.min === result.outputTokens.max
      ? result.outputTokens.min.toLocaleString()
      : `${result.outputTokens.min.toLocaleString()} - ${result.outputTokens.max.toLocaleString()}`;
      
    const cost = result.cost.min === result.cost.max
      ? formatCurrency(result.cost.min)
      : `${formatCurrency(result.cost.min)} - ${formatCurrency(result.cost.max)}`;
      
    csvContent += `"${result.interactionName}","${result.modelName}",${result.monthlyRequestCount.toLocaleString()},"${inputTokens}","${outputTokens}","${cost}"\n`;
  });
  
  // Add total row
  const totalCostFormatted = totalCost.min === totalCost.max
    ? formatCurrency(totalCost.min)
    : `${formatCurrency(totalCost.min)} - ${formatCurrency(totalCost.max)}`;
  csvContent += `"TOTAL","","","","","${totalCostFormatted}"\n`;
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'totara_ai_cost_calculation.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportResultsToPDF = (results: CostResult[]): void => {
  // Calculate total
  const totalCost = results.reduce(
    (total, result) => ({
      min: total.min + result.cost.min,
      max: total.max + result.cost.max
    }),
    { min: 0, max: 0 }
  );

  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Totara LMS AI Cost Calculator Results', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data
  const tableData = results.map(result => [
    result.interactionName,
    result.modelName,
    result.monthlyRequestCount.toLocaleString(),
    result.inputTokens.min === result.inputTokens.max
      ? result.inputTokens.min.toLocaleString()
      : `${result.inputTokens.min.toLocaleString()} - ${result.inputTokens.max.toLocaleString()}`,
    result.outputTokens.min === result.outputTokens.max
      ? result.outputTokens.min.toLocaleString()
      : `${result.outputTokens.min.toLocaleString()} - ${result.outputTokens.max.toLocaleString()}`,
    result.cost.min === result.cost.max
      ? formatCurrency(result.cost.min)
      : `${formatCurrency(result.cost.min)} - ${formatCurrency(result.cost.max)}`
  ]);
  
  // Add total row
  tableData.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    totalCost.min === totalCost.max
      ? formatCurrency(totalCost.min)
      : `${formatCurrency(totalCost.min)} - ${formatCurrency(totalCost.max)}`
  ]);
  
  // Generate table
  autoTable(doc, {
    head: [['Interaction', 'Model', 'Monthly Requests', 'Input Tokens', 'Output Tokens', 'Monthly Cost']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 82, 163] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    footStyles: { fillColor: [220, 220, 220] }
  });
  
  // Save PDF
  doc.save('totara_ai_cost_calculation.pdf');
};

export const handleExport = (results: CostResult[], format: 'csv' | 'pdf'): void => {
  if (format === 'csv') {
    exportResultsToCSV(results);
  } else {
    exportResultsToPDF(results);
  }
};
