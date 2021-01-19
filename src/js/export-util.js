import Persistence from './persistence.js';
import { timeSheet2Excel } from './excel-output.js';

const persistence = new Persistence();

// This is just an example. I needed a "type" to understand what to do with this.
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
        debugger;
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
