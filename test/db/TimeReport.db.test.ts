import { time } from 'console';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { TEST_DB_CONNECTION } from '../../src/constants';
import { TimeReportQueries } from '../../src/db/TimeReport/TimeReportQueries';
import { TimeReportUploader } from '../../src/db/TimeReport/TimeReportUploader';
import { TimeReport } from '../../src/entity/TimeReport';
import { TimeReportEntry } from '../../src/entity/TimeReportEntry';

describe('test time report query abstractions', () => {
  const timeReportEntries: TimeReportEntry[] = [
    new TimeReportEntry(new Date('1/4/2023'), 10, 1, 'A'),
    new TimeReportEntry(new Date('1/14/2023'), 5, 1, 'A'),
    new TimeReportEntry(new Date('1/20/2023'), 3, 2, 'B'),
    new TimeReportEntry(new Date('1/20/2023'), 4, 1, 'A'),
  ];

  beforeAll(() => createConnection(TEST_DB_CONNECTION));

  afterAll(() => {
    const conn = getConnection();
    return conn.close();
  });

  test('given a series of time report entries, TimeReportUploader.insertTimeReportEntries inserts into db correctly', async () => {
    const uploader = new TimeReportUploader();

    // What do I do with insert result?
    const insertResult = await uploader.insertTimeReportEntries(timeReportEntries);

    // Retrieve rows from database optionally could use this to assert that exact values we expect are in the db
    const [returnedtimeReportEntries, timeReportEntryCount] = await getRepository(TimeReportEntry).findAndCount();

    // Ensure rows entered in database matches what we expect
    expect(timeReportEntryCount).toStrictEqual(4);

    // Ensure rows in DB when retrieved match what we expect
    returnedtimeReportEntries.forEach((entry, i) => {
      expect(entry.date === timeReportEntries[i].date);
      expect(entry.employeeId === timeReportEntries[i].employeeId);
      expect(entry.hoursWorked === timeReportEntries[i].hoursWorked);
      expect(entry.jobGroup === timeReportEntries[i].jobGroup);
    });
  });

  test('given a time report id, TimeReportUploader.registerTimeReportId inserts it into db correctly', async () => {
    const timeReportID: TimeReport = {
      id: 29,
    };

    const uploader = new TimeReportUploader();
    const result = await uploader.registerTimeReportId(timeReportID);

    const [returnedTimeReports, timeReportCounts] = await getRepository(TimeReport).findAndCount();

    expect(timeReportCounts).toStrictEqual(1);

    expect(returnedTimeReports[0].id).toStrictEqual(29);
  });

  test('given a time report, TimeReportQueries.findTimeReportWithID searches and returns existing time reports', async () => {
    const timeReportId = 29;

    const queries = new TimeReportQueries();
    const result = await queries.findTimeReportWithID(timeReportId);

    expect(result).toBeTruthy();

    expect(result.id).toStrictEqual(timeReportId);
  });

  test('TimeReportQueries.getTimeReportEntries() returns all time reports in db', async () => {
    const queries = new TimeReportQueries();
    const result = await queries.getTimeReportEntries();

    // Ensure rows entered in database matches what we expect
    expect(result.length).toStrictEqual(4);

    // Ensure rows in DB when retrieved match what we expect
    result.forEach((entry, i) => {
      expect(entry.date === timeReportEntries[i].date);
      expect(entry.employeeId === timeReportEntries[i].employeeId);
      expect(entry.hoursWorked === timeReportEntries[i].hoursWorked);
      expect(entry.jobGroup === timeReportEntries[i].jobGroup);
    });
  });
});
