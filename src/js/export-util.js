import Persistence from './persistence.js';
import { timeSheet2Excel } from './excel-output.js';

const persistence = new Persistence();

// This is just an example. I needed a "type" to understand what to do with this.
const datamodel = {
  header: [{ colspan: 1, title: 'world' }],
  rows: [['Day', 'Month'], [], []],
};

const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const exportToExcel = async () => {
  const items = await persistence.getTimeFromAllDays();

  const excelData = {
    header: [],
    rows: [],
  };

  let monthOffset = 0;
  // ## Map over years
  Object.entries(items).map(([year, months], yearIndex) => {
    debugger;
    if (months && Object.keys(months).length) {
      //   excelData.header.push({
      //     colspan: Object.keys(months).length,
      //     title: `${year}`,
      //   });
      // ## Map over months
      Object.entries(months).map(([month, days], monthIndex) => {
        if (days) {
          // ## Map over days
          for (let d = 0; d < 31; ++d) {
            if (days[String(d)]) {
              // Time entry was found for this day
              // TODO BUGFIX @raphaellueckl: It could be that monthIndex is always 0. Investigate on the next inno day!
              excelData.rows[monthIndex + monthOffset][d] = days[String(d)];
            } else {
              // No time entry for this day
              (excelData.rows[monthIndex + monthOffset]
                ? excelData.rows[monthIndex + monthOffset]
                : (excelData.rows[monthIndex + monthOffset] = []))[d] = '0';
            }
          }
          excelData.rows[monthIndex + monthOffset][31] = monthLabels[month]; // Write current month for reference
          excelData.rows[monthIndex + monthOffset][32] = year; // Write current year for reference
        }
      });
      monthOffset = Object.keys(months).length;
    }
  });

  const warpedRows = (data) => {
    let rows = [];

    // 34 = 31 days + month label + year label
    for (let i = 0; i < 33; ++i) {
      data.rows.forEach((r) => {
        if (!rows[i]) rows[i] = [];
        rows[i].push(r[i]);
      });
    }
    // Ignore the first index
    rows[0].unshift('');
    for (let i = 1; i < 32; ++i) {
      rows[i].unshift(i);
    }

    data.rows = rows;
    return data;
  };

  const warpedData = warpedRows(excelData);

  timeSheet2Excel(excelData);
};
