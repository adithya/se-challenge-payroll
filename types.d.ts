export type JobGroupName = 'A' | 'B';

export interface ITimeReport {
    id: number // files will be named in the format time-report-{x}.csv where x is an integer ID
}

export interface ITimeReportEntry {
    date: Date, // date
    hoursWorked: number, // hours worked
    employeeId: number, // employee id
    jobGroup: JobGroupName // job group
}

export interface IJobGroup {
    jobGroup: JobGroupName,
    hourlyRate: number
}

export interface ITimeReports {
    timeReports: ITimeReport[]
}

export interface ITimeReportEntries {
    timeReportEntries: ITimeReportEntry[]
}

export interface IPayPeriod {
    startDate: Date,
    endDate: Date
}

export interface IEmployeeReport {
    employeeId: number,
    payPeriod: IPayPeriod,
    amountPaid: number
}

export interface IPayrollReport {
    employeeReports: IEmployeeReport[]
}
