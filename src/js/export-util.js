import Persistence from './persistence.js';
import { timeSheet2Excel } from './excel-output.js';

const persistence = new Persistence();

const datamodel = {
  header: [{ colspan: 1, title: 'world' }],
  rows: [['Day', 'Month'], [], []],
};

export const exportToExcel = async () => {
  const items = await persistence.getTimeFromAllDays();

  const excelData = {
    header: [],
    rows: [],
  };

  let rowIndex = 0;
  //   let yearSpan1 = 1;
  //   let yearSpan2 = 1;

  //   let yearSpans = [];

  //   Object.entries(items).forEach(([year, months]) => {
  //     items[year].yearHeaderSpan = Object.keys(months).length
  //   });

  let monthOffset = 0;
  Object.entries(items).map(([year, months], yearIndex) => {
    if (months && Object.keys(months).length) {
      //   excelData.header.push({
      //     colspan: Object.keys(months).length,
      //     title: `${year}`,
      //   });
      Object.entries(months).map(([month, days], monthIndex) => {
        if (days) {
          for (let d = 0; d < 31; ++d) {
            if (days[String(d)]) {
              // Time entry was found for this day
              excelData.rows[monthIndex + monthOffset][d] = days[String(d)];
            } else {
              // No time entry for this day
              (excelData.rows[monthIndex + monthOffset]
                ? excelData.rows[monthIndex + monthOffset]
                : (excelData.rows[monthIndex + monthOffset] = []))[d] = '0';
            }
          }
          excelData.rows[monthIndex + monthOffset][32] = month; // Write current month for reference
          excelData.rows[monthIndex + monthOffset][33] = year; // Write current year for reference
        }
      });
      monthOffset = Object.keys(months).length;
    }
  });

  debugger;

  timeSheet2Excel(excelData);
};
