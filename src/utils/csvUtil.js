/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }

  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header] || '';
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Parse CSV string to array of objects
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : '';
    });
    data.push(obj);
  }

  return data;
};

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current); // Add last value

  return values;
};

