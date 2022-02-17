import exp from 'constants';
import { TimeReportEntry } from '../../../src/entity/TimeReportEntry';
import {
  getAmountPaidForTimeReportEntry, getPayPeriodFromDate, getPayPeriodStartFromDate, reportCalculator,
} from '../../../src/report/reportCalculator';
import {
  IEmployeeReport, IPayPeriod, IPayrollReport, ITimeReportEntry,
} from '../../../types';

describe('test reportCalculator', () => {
  test('given a date, correct pay period start date is returned', () => {
    expect(getPayPeriodStartFromDate(new Date('1/4/2023'))).toStrictEqual(new Date('2023-01-01'));
    expect(getPayPeriodStartFromDate(new Date('1/14/2023'))).toStrictEqual(new Date('2023-01-01'));
    expect(getPayPeriodStartFromDate(new Date('1/20/2023'))).toStrictEqual(new Date('2023-01-16'));
  });

  test('given a date, correct pay period is returned', () => {
    expect(getPayPeriodFromDate(new Date('1/4/2023'))).toStrictEqual({ startDate: new Date('2023-01-01'), endDate: new Date('2023-01-15') } as IPayPeriod);
    expect(getPayPeriodFromDate(new Date('1/14/2023'))).toStrictEqual({ startDate: new Date('2023-01-01'), endDate: new Date('2023-01-15') } as IPayPeriod);
    expect(getPayPeriodFromDate(new Date('1/20/2023'))).toStrictEqual({ startDate: new Date('2023-01-16'), endDate: new Date('2023-01-31') } as IPayPeriod);
  });

  test('given a job group, and number of hours worked, correct amount paid is returned', () => {
    expect(getAmountPaidForTimeReportEntry(10, 'A')).toStrictEqual(200);
    expect(getAmountPaidForTimeReportEntry(5, 'A')).toStrictEqual(100);
    expect(getAmountPaidForTimeReportEntry(3, 'B')).toStrictEqual(90);
    expect(getAmountPaidForTimeReportEntry(4, 'A')).toStrictEqual(80);
  });

  test('given a series of time report entries, correct payroll report is returned', () => {
    const timeReportEntries: ITimeReportEntry[] = [
      new TimeReportEntry(new Date('1/4/2023'), 10, 1, 'A'),
      new TimeReportEntry(new Date('1/14/2023'), 5, 1, 'A'),
      new TimeReportEntry(new Date('1/20/2023'), 3, 2, 'B'),
      new TimeReportEntry(new Date('1/20/2023'), 4, 1, 'A'),
    ];

    const employeeReports: IEmployeeReport[] = reportCalculator(timeReportEntries);

    expect(employeeReports).toBeTruthy();

    const expectedEmployeeReports: IEmployeeReport[] = [
      { employeeId: 1, payPeriod: { startDate: new Date('2023-01-01'), endDate: new Date('2023-01-15') }, amountPaid: 300.00 },
      { employeeId: 1, payPeriod: { startDate: new Date('2023-01-16'), endDate: new Date('2023-01-31') }, amountPaid: 80.00 },
      { employeeId: 2, payPeriod: { startDate: new Date('2023-01-16'), endDate: new Date('2023-01-31') }, amountPaid: 90.00 },
    ];

    expect(employeeReports.length).toBe(3);

    employeeReports.forEach((employeeReport, i) => {
      expect(employeeReport.employeeId).toStrictEqual(expectedEmployeeReports[i].employeeId);
      expect(employeeReport.payPeriod).toStrictEqual(expectedEmployeeReports[i].payPeriod);
      expect(employeeReport.amountPaid).toStrictEqual(expectedEmployeeReports[i].amountPaid);
    });
  });
});
