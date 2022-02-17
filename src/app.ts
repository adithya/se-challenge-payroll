import express from 'express';
import multer from 'multer';
import 'reflect-metadata';
import os from 'node:os';
import {
  getPayrollReportJSONFromEmployeeReports, getTimeReportID, parseTimeReportCSV,
} from './helpers/helpers';
import { TimeReportQueries } from './db/TimeReport/TimeReportQueries';
import { TimeReportUploader } from './db/TimeReport/TimeReportUploader';
import { DUPLICATE_TIME_REPORT_ID, UPLOAD_SUCCESFUL } from './constants';
import { reportCalculator } from './report/reportCalculator';

export const app = express();
const upload = multer({ dest: os.tmpdir() });

app.post('/upload', upload.single('time-report'), async (req, res) => {
  const { file } = req;
  const filePath = file.path;

  // Get reporID
  const reportID = getTimeReportID(file.originalname);

  // Check if report id exists in DB
  const timeReportQueries = new TimeReportQueries();
  const existingTimeReportWithSameID = await timeReportQueries.findTimeReportWithID(reportID);

  if (!existingTimeReportWithSameID) {
    // else Parse CSV
    const timeReports = await parseTimeReportCSV(filePath);

    // Archive TimeReport Entries to DB
    const uploader = new TimeReportUploader();
    await uploader.insertTimeReportEntries(timeReports);

    // Register time report id
    await uploader.registerTimeReportId({ id: reportID });

    // Response body has message UPLOAD_SUCCESFUl
    // Send 200OK back
    res.status(200).jsonp(UPLOAD_SUCCESFUL);
  } else {
    res.status(403).jsonp(DUPLICATE_TIME_REPORT_ID);
  }
});

app.get('/payrollReport', async (_, res) => {
  const timeReportQuery = new TimeReportQueries();
  const timeReportEntries = await timeReportQuery.getTimeReportEntries();

  const employeeReports = reportCalculator(timeReportEntries);

  res.status(200).send(getPayrollReportJSONFromEmployeeReports(employeeReports));
});
