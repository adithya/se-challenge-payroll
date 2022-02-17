import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { resolve } from 'path';
import { app } from '../../src/app';
import { TEST_DB_CONNECTION } from '../../src/constants';

describe('Test the payrollReport API endpoint', () => {
  const expectedPayrollReport = '{"payrollReport":{"employeeReports":[{"employeeId":"1","payPeriod":{"startDate":"2023-01-01","endDate":"2023-01-15"},"amountPaid":"$300.00"},{"employeeId":"1","payPeriod":{"startDate":"2023-01-16","endDate":"2023-01-31"},"amountPaid":"$80.00"},{"employeeId":"2","payPeriod":{"startDate":"2023-01-16","endDate":"2023-01-31"},"amountPaid":"$90.00"}]}}';

  const filePath = resolve(__dirname, 'time-report-29.csv');

  beforeEach(() => createConnection(TEST_DB_CONNECTION));

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('payroll report generates as expected', async () => {
    // Upload time report
    await request(app)
      .post('/upload')
      .attach('time-report', filePath)
      .expect(200);

    // Get payroll report and see if returns what we expect
    await request(app)
      .get('/payrollReport')
      .expect(200)
      .then(async (response) => {
        // Check Response Body
        expect(response.text).toStrictEqual(expectedPayrollReport);
      });
  });
});
