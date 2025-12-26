import ReactExport from 'react-data-export';
import XLSX from 'xlsx';
const { ExcelFile, ExcelSheet } = ReactExport;

const exportToExcel = (data, filename, sheetname) => {
  const dataset = [
    {
      columns: [
        // Define your columns
        { title: 'Column 1', style: { font: { sz: '18', bold: true } } },
        { title: 'Column 2', style: { font: { sz: '18', bold: true } } },
        // Add more columns as needed
      ],
      data: data.map(item => [
        // Map your data to rows
        { value: item.column1 },
        { value: item.column2 },
        // Add more columns as needed
      ]),
    },
  ];

  return (
    <ExcelFile filename={filename}>
      <ExcelSheet dataSet={dataset} name={sheetname} />
    </ExcelFile>
  );
};

export default exportToExcel;