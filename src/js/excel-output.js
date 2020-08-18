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

  const base64 = (string) => window.btoa(unescape(encodeURIComponent(string)));

  window.location.href =
    'data:application/vnd.ms-excel;base64,' + base64(TEMPLATE);
};

export const timeSheet2Excel = (timeSheet) => {
  const { header = [], rows = [] } = timeSheet;

  const columnHeader = ({ colspan, title = '' }) =>
    `<tr><th${colspan ? ' colspan="' + colspan + '"' : ''}>${title}</th></tr>`;

  const PROLOGUE = (columnHeaders) =>
    `<thead>${columnHeaders.map(columnHeader)}</thead><tbody>`;

  const EPILOGUE = '</tbody>';

  const table = [PROLOGUE(header)];

  const cell = (aCell = '') => `<td>${aCell}</td>`;
  const row = (cells = []) => `<tr>${cells.map(cell)}</tr>`;

  table = table.concat(rows.map(row));
  table.push(EPILOGUE);

  excelExport(null, 'AXA TimeTracker Export', table.join(''));
};
