import { ConnectionOptions } from 'typeorm';
import { JobGroupName } from '../types';
import { TimeReport } from './entity/TimeReport';
import { TimeReportEntry } from './entity/TimeReportEntry';

export const PORT = 3000;
export const UPLOAD_SUCCESFUL = 'Uploaded succesfully!';
export const DUPLICATE_TIME_REPORT_ID = 'Upload unsuccesful. The time report you attempted to upload has the same ID as a previous time report.';

export const JOB_GROUPS = new Map<JobGroupName, number>([
  ['A', 20.00],
  ['B', 30.00],
]);

export const DB_CONNECTION: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: 5432,
  username: 'waveuser',
  password: 'pg@admin',
  database: 'payroll-challenge-db',
  entities: [
    TimeReport,
    TimeReportEntry,
  ],
  synchronize: true,
  logging: false,
};

export const TEST_DB_CONNECTION: ConnectionOptions = {
  ...DB_CONNECTION,
  host: 'localhost',
  port: 5432,
  database: 'payroll-challenge-db-test',
  dropSchema: true,
};
