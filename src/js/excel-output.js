import { saveAsFile } from './import-export.js';

const excelExport = (table, worksheet = 'Worksheet') => {
  const TEMPLATE = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>${worksheet}</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
          <![endif]-->
        </head>
        <body>
            <table>${table}</table>
        </body>
    </html>`;

  const fileName = `AXA-Time-Tracker-Excel-Export-${new Date().toISOString()}.xls`;

  return saveAsFile(fileName, TEMPLATE, 'application/vnd.ms-excel');
};

export const timeSheet2Excel = timeSheet => {
  const { header = [], rows = [] } = timeSheet;

  const columnHeader = ({ colspan, title = '' }) =>
    `<th${colspan ? ' colspan="' + colspan + '"' : ''}>${title}</th>`;

  const PROLOGUE = columnHeaders =>
    `<thead><tr>${columnHeaders
      .map(columnHeader)
      .join('')}</tr></thead><tbody>`;

  const EPILOGUE = '</tbody>';

  let table = [PROLOGUE(header)];

  const cell = (aCell = '') => `<td>${aCell}</td>`;
  const row = (cells = []) => `<tr>${cells.map(cell).join('')}</tr>`;

  table = table.concat(rows.map(row));
  table.push(EPILOGUE);

  return excelExport(table.join(''), 'AXA Time Tracker Export');
};
