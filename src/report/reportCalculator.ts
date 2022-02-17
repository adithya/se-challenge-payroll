import {
  IEmployeeReport, IPayPeriod, IPayrollReport, ITimeReportEntry, JobGroupName,
} from '../../types';
import { JOB_GROUPS } from '../constants';
import { getDateOutputFormat } from '../helpers/helpers';

export function getPayPeriodFromDate(date: Date) : IPayPeriod {
  // 1st to the 15th inclusive
  if (date.getDate() >= 1 && date.getDate() <= 15) {
    return {
      startDate: new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)),
      endDate: new Date(Date.UTC(date.getFullYear(), date.getMonth(), 15)),
    };
    // 16th to the end of the month, inclusive
  }
  return {
    startDate: new Date(Date.UTC(date.getFullYear(), date.getMonth(), 16)),
    endDate: new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)),
  };
}

export function getPayPeriodStartFromDate(date: Date) {
  return getPayPeriodFromDate(date).startDate;
}

export function getAmountPaidForTimeReportEntry(hoursWorked: number, jobGroupName: JobGroupName) {
  return hoursWorked * JOB_GROUPS.get(jobGroupName);
}

export function reportCalculator(timeReportEntries: ITimeReportEntry[]): IEmployeeReport[] {
    interface IPayrollReportMap {
        [key: string]: IEmployeeReport
    }

    const payrollReportMap: IPayrollReportMap = {};

    timeReportEntries.forEach((entry) => {
      const employeeReport: IEmployeeReport = {
        employeeId: entry.employeeId,
        payPeriod: getPayPeriodFromDate(entry.date),
        amountPaid: getAmountPaidForTimeReportEntry(entry.hoursWorked, entry.jobGroup),
      };

      const keyForEmployeeReport = `${employeeReport.employeeId.toString()}_${getDateOutputFormat(employeeReport.payPeriod.startDate)}`;

      if (!payrollReportMap[keyForEmployeeReport]) {
        payrollReportMap[keyForEmployeeReport] = employeeReport;
      } else {
        payrollReportMap[keyForEmployeeReport].amountPaid += employeeReport.amountPaid;
      }
    });

    const employeeReports: IEmployeeReport[] = Object.values(payrollReportMap).sort((a, b) => {
      // Compare IDs
      if (a.employeeId < b.employeeId) {
        return -1;
      } if (a.employeeId > b.employeeId) {
        return 1;
        // If IDs are the same compare startDates
      }
      if (a.payPeriod.startDate.getTime() < b.payPeriod.startDate.getTime()) {
        return -1;
      }
      return 1;
    });

    // one more pass of employeeReports to serialize numbers and dates to string for JSON

    return employeeReports;
}
