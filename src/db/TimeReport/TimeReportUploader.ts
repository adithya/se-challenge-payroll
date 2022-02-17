import { getRepository, InsertResult, Repository } from 'typeorm';
import { ITimeReportEntry } from '../../../types';
import { TimeReport } from '../../entity/TimeReport';
import { TimeReportEntry } from '../../entity/TimeReportEntry';

interface ITimeReportUploader {
    insertTimeReportEntries(timeReportEntries: ITimeReportEntry[]): Promise<InsertResult>
    registerTimeReportId(timeReportId: TimeReport): Promise<InsertResult>
}

export class TimeReportUploader implements ITimeReportUploader {
  readonly TimeReportEntryTable: Repository<TimeReportEntry>;

  readonly TimeReportsTable: Repository<TimeReport>;

  constructor() {
    this.TimeReportEntryTable = getRepository(TimeReportEntry);
    this.TimeReportsTable = getRepository(TimeReport);
  }

  insertTimeReportEntries(timeReportEntries: ITimeReportEntry[]): Promise<InsertResult> {
    return this.TimeReportEntryTable.insert(timeReportEntries);
  }

  registerTimeReportId(timeReport: TimeReport): Promise<InsertResult> {
    return this.TimeReportsTable.insert(timeReport);
  }
}
