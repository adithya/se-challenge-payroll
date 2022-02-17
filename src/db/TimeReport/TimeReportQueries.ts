import {
  getRepository, Repository,
} from 'typeorm';
import { ITimeReportEntry } from '../../../types';
import { TimeReport } from '../../entity/TimeReport';
import { TimeReportEntry } from '../../entity/TimeReportEntry';

interface ITimeReportQueries {
    findTimeReportWithID(timeReportId: number): Promise<TimeReport>;
    getTimeReportEntries(): Promise<ITimeReportEntry[]>;
}

export class TimeReportQueries implements ITimeReportQueries {
  readonly TimeReportEntryTable: Repository<TimeReportEntry>;

  readonly TimeReportsTable: Repository<TimeReport>;

  constructor() {
    this.TimeReportEntryTable = getRepository(TimeReportEntry);
    this.TimeReportsTable = getRepository(TimeReport);
  }

  findTimeReportWithID(timeReportId: number): Promise<TimeReport> {
    return this.TimeReportsTable.findOne(timeReportId);
  }

  getTimeReportEntries(): Promise<ITimeReportEntry[]> {
    return this.TimeReportEntryTable.find();
  }
}
