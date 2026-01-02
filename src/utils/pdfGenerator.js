import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export const generatePaymentsReportPDF = (payments, filters = {}) => {
  const doc = new PDFDocument({ margin: 50 });
  
  // Header
  doc.fontSize(20).text('Payments Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, { align: 'center' });
  doc.moveDown(2);
  
  // Summary
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const totalUnpaid = payments.reduce((sum, p) => sum + (p.unpaidAmount || 0), 0);
  
  doc.fontSize(14).text('Summary', { continued: false });
  doc.fontSize(10).text(`Total Payments: ${totalPayments}`, { continued: false });
  doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, { continued: false });
  doc.text(`Total Paid: $${totalPaid.toFixed(2)}`, { continued: false });
  doc.text(`Total Unpaid: $${totalUnpaid.toFixed(2)}`, { continued: false });
  doc.moveDown(2);
  
  // Payments list
  doc.fontSize(14).text('Payments Details', { continued: false });
  doc.moveDown();
  
  payments.forEach((payment, index) => {
    // Payment header
    doc.fontSize(12).text(`Payment #${index + 1}`, { continued: false });
    doc.fontSize(10);
    doc.text(`Total Amount: $${payment.totalAmount?.toFixed(2) || '0.00'}`, { continued: false });
    doc.text(`Paid Amount: $${payment.paidAmount?.toFixed(2) || '0.00'}`, { continued: false });
    doc.text(`Unpaid Amount: $${payment.unpaidAmount?.toFixed(2) || '0.00'}`, { continued: false });
    doc.text(`Status: ${payment.status || 'N/A'}`, { continued: false });
    doc.text(`Payment Method: ${payment.paymentMethod || 'N/A'}`, { continued: false });
    doc.text(`Payment Date: ${payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : 'N/A'}`, { continued: false });
    
    // Reference ID
    if (payment.apartmentReference && payment.apartmentReference.referenceId) {
      doc.text(`Reference ID: ${payment.apartmentReference.referenceId}`, { continued: false });
    } else {
      doc.text(`Reference ID: MANUAL`, { continued: false });
    }
    
    // Owner information
    if (payment.ownerName) {
      doc.text(`Owner: ${payment.ownerName}`, { continued: false });
    }
    if (payment.userEmail) {
      doc.text(`Email: ${payment.userEmail}`, { continued: false });
    }
    if (payment.username) {
      doc.text(`Username: ${payment.username}`, { continued: false });
    }
    
    // Status change history
    if (payment.history && payment.history.length > 0) {
      doc.fontSize(9).text('Status Changes:', { continued: false });
      payment.history.forEach(record => {
        const changedBy = record.changedByName || (record.changedBy ? `${record.changedBy.firstName} ${record.changedBy.lastName}` : 'System');
        doc.text(`  • ${record.previousStatus} → ${record.newStatus} on ${format(new Date(record.changeDate), 'yyyy-MM-dd HH:mm')} by ${changedBy}`, { continued: false });
      });
    }
    
    if (payment.description) {
      doc.text(`Description: ${payment.description}`, { continued: false });
    }
    if (payment.notes) {
      doc.text(`Notes: ${payment.notes}`, { continued: false });
    }
    
    doc.moveDown();
    
    // Page break if needed
    if (doc.y > 700) {
      doc.addPage();
    }
  });
  
  return doc;
};

