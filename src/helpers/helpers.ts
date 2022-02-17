import { readFileSync, createReadStream } from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import { TimeReportEntry } from '../entity/TimeReportEntry';
import {
  IEmployeeReport, IPayPeriod, IPayrollReport,
} from '../../types';

export function readFile(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

export function getTimeReportID(fileName: string): number {
  return parseInt((fileName.split('-'))[2].split('.')[0]);
}

export function getFileNameFromFilePath(filePath: string): string {
  return path.basename(filePath);
}

export function parseCSVDateString(csvDate: string): Date {
  const [date, month, year] = csvDate.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
}

export function parseTimeReportCSV(filePath: string) {
  return new Promise<TimeReportEntry[]>((resolve, reject) => {
    const timeReports = [];

    createReadStream(filePath)
      .pipe(csv.parse({ headers: ['date', 'hoursWorked', 'employeeId', 'jobGroup'], renameHeaders: true }))
      .on('data', (row) => {
        const timeReportEntry: TimeReportEntry = new TimeReportEntry(parseCSVDateString(row.date), parseInt(row.hoursWorked), parseInt(row.employeeId), row.jobGroup);
        timeReports.push(timeReportEntry);
      })
      .on('end', () => {
        resolve(timeReports);
      })
      .on('error', reject);
  });
}

export function getDateOutputFormat(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getPayrollReportJSONFromEmployeeReports(employeeReports: IEmployeeReport[]): string {
  const payrollReport: IPayrollReport = {
    employeeReports,
  };
  return JSON.stringify({ payrollReport }, (key, value) => {
    if (key === 'employeeId') {
      return (value as number).toString() as string;
    }

    if (key === 'payPeriod') {
      const payPeriod: IPayPeriod = value;
      return { startDate: getDateOutputFormat(payPeriod.startDate), endDate: getDateOutputFormat(payPeriod.endDate) } as { startDate: string, endDate: string};
    }

    if (key === 'amountPaid') {
      return `\$${(value as number).toFixed(2).toString() as string}`;
    }

    return value;
  });
}
