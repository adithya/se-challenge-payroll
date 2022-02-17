import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { resolve } from 'path';
import {
  DUPLICATE_TIME_REPORT_ID, PORT, TEST_DB_CONNECTION, UPLOAD_SUCCESFUL,
} from '../../src/constants';
import { app } from '../../src/app';
import { TimeReportEntry } from '../../src/entity/TimeReportEntry';

describe('Test the upload API endpoint', () => {
  const filePath = resolve(__dirname, 'time-report-29.csv');

  beforeEach(() => createConnection(TEST_DB_CONNECTION));

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('timekeeping information within time report must be stored in db', async () => {
    await request(app)
      .post('/upload')
      .attach('time-report', filePath)
      .expect(200)
      .then(async (response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(UPLOAD_SUCCESFUL);

        const expectedEntries: TimeReportEntry[] = [
          new TimeReportEntry(new Date('1/4/2023'), 10, 1, 'A'),
          new TimeReportEntry(new Date('1/14/2023'), 5, 1, 'A'),
          new TimeReportEntry(new Date('1/20/2023'), 3, 2, 'B'),
          new TimeReportEntry(new Date('1/20/2023'), 4, 1, 'A'),
        ];

        // Retrieve rows from database optionally could use this to assert that exact values we expect are in the db
        const [timeReportEntries, timeReportEntryCount] = await getRepository(TimeReportEntry).findAndCount();

        // Ensure rows entered in database matches what we expect
        expect(timeReportEntryCount).toBe(4);

        // Ensure rows in DB when retrieved match what we expect
        timeReportEntries.forEach((entry, i) => {
          expect(entry.date === expectedEntries[i].date);
          expect(entry.employeeId === expectedEntries[i].employeeId);
          expect(entry.hoursWorked === expectedEntries[i].hoursWorked);
          expect(entry.jobGroup === expectedEntries[i].jobGroup);
        });
      });
  });

  test('if time report has same ID as a previous time report, upload should fail with an error message', async () => {
    // The first time we upload it should be succesful
    await request(app)
      .post('/upload')
      .attach('time-report', filePath)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(UPLOAD_SUCCESFUL);
      });

    await request(app)
      .post('/upload')
      .attach('time-report', filePath)
      .then((response) => {
        expect(response.statusCode).toBe(403);
        expect(response.body).toBe(DUPLICATE_TIME_REPORT_ID);
      });
  });
});
