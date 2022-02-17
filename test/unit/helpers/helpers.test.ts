import { resolve } from 'path';
import { TimeReportEntry } from '../../../src/entity/TimeReportEntry';
import {
  getDateOutputFormat, getFileNameFromFilePath, getPayrollReportJSONFromEmployeeReports, getTimeReportID, parseCSVDateString, parseTimeReportCSV, readFile,
} from '../../../src/helpers/helpers';
import { IEmployeeReport } from '../../../types';

describe('test helper functions', () => {
  const filePath = resolve(__dirname, 'time-report-29.csv');

  test('given a time report file path, file contents should be returned', () => {
    const readCSVString = 'date,hours worked,employee id,job group\r\n4/1/2023,10,1,A\r\n14/1/2023,5,1,A\r\n20/1/2023,3,2,B\r\n20/1/2023,4,1,A';

    expect(readFile(filePath)).toStrictEqual(readCSVString);
  });

  test('given a valid time report object, correct corresponding js objects should be returned', async () => {
    const expectedEntries: TimeReportEntry[] = [
      new TimeReportEntry(new Date('1/4/2023'), 10, 1, 'A'),
      new TimeReportEntry(new Date('1/14/2023'), 5, 1, 'A'),
      new TimeReportEntry(new Date('1/20/2023'), 3, 2, 'B'),
      new TimeReportEntry(new Date('1/20/2023'), 4, 1, 'A'),
    ];

    const timeReportCSV = 'date,hours worked,employee id,job group\r\n4/1/2023,10,1,A\r\n14/1/2023,5,1,A\r\n20/1/2023,3,2,B\r\n20/1/2023,4,1,A';

    const timeReportEntriesFromCSV: TimeReportEntry[] = await parseTimeReportCSV(filePath);

    expect(timeReportEntriesFromCSV.length).toBe(4);

    // Verify that objects returned (parsed from CSV) are what we expect
    timeReportEntriesFromCSV.forEach((entry, i) => {
      expect(entry.date).toStrictEqual(expectedEntries[i].date);
      expect(entry.employeeId).toStrictEqual(expectedEntries[i].employeeId);
      expect(entry.hoursWorked).toStrictEqual(expectedEntries[i].hoursWorked);
      expect(entry.jobGroup).toStrictEqual(expectedEntries[i].jobGroup);
    });
  });

  test('given a file path, file name is retrieved', () => {
    expect(getFileNameFromFilePath(filePath)).toStrictEqual('time-report-29.csv');
  });

  test('given a time report file, correct id is retrieved', () => {
    expect(getTimeReportID('time-report-29.csv')).toStrictEqual(29);
  });

  test('given a date in csv input format, return correct date object', () => {
    const date: Date = parseCSVDateString('4/1/2023');
    expect(date.getDate()).toStrictEqual(4);
    expect(date.getFullYear()).toStrictEqual(2023);
    expect(date.getMonth()).toStrictEqual(0); // js dates indexed to 0
    expect(date.getHours()).toStrictEqual(0);
    expect(date.getMinutes()).toStrictEqual(0);
    expect(date.getSeconds()).toStrictEqual(0);
    expect(date.getMilliseconds()).toStrictEqual(0);
  });

  // get output date YYYY-MM-DD
  test('given a date object, return in format YYYY-MM-DD', () => {
    expect(getDateOutputFormat(new Date('1/4/2023'))).toStrictEqual('2023-01-04');
  });

  test('given a series of employeeReports, correct json output is returned', () => {
    const expectedPayrollReport = '{"payrollReport":{"employeeReports":[{"employeeId":"1","payPeriod":{"startDate":"2023-01-01","endDate":"2023-01-15"},"amountPaid":"$300.00"},{"employeeId":"1","payPeriod":{"startDate":"2023-01-16","endDate":"2023-01-31"},"amountPaid":"$80.00"},{"employeeId":"2","payPeriod":{"startDate":"2023-01-16","endDate":"2023-01-31"},"amountPaid":"$90.00"}]}}';

    const employeeReports: IEmployeeReport[] = [
      { employeeId: 1, payPeriod: { startDate: new Date('2023-01-01'), endDate: new Date('2023-01-15') }, amountPaid: 300.00 },
      { employeeId: 1, payPeriod: { startDate: new Date('2023-01-16'), endDate: new Date('2023-01-31') }, amountPaid: 80.00 },
      { employeeId: 2, payPeriod: { startDate: new Date('2023-01-16'), endDate: new Date('2023-01-31') }, amountPaid: 90.00 },
    ];

    const generatedPayrollReport = getPayrollReportJSONFromEmployeeReports(employeeReports);

    expect(generatedPayrollReport).toStrictEqual(expectedPayrollReport);
  });
});
