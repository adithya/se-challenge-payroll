import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ITimeReportEntry, JobGroupName } from '../../types';

@Entity()
export class TimeReportEntry implements ITimeReportEntry {
  /*
        Choosing to keep TimeReportEntry table in line with structure of CSV row and treat as append only for now (set only in constructor), not sure whether rows should be changed after the fact.

        If user wants to change row after the fact they can potentially add "adjustment row" with same date and employee id.

        In this way we treat the table like an event store and can fully recreate events that led up to current pay period values.

        Additionally not sure if employees can be in different jobGroups, so going to allow for flexibility and have potentially different jobGroups for each entry.
    */
  constructor(date: Date, hoursWorked: number, employeedID: number, jobGroup: JobGroupName) {
    this.date = date;
    this.employeeId = employeedID;
    this.hoursWorked = hoursWorked;
    this.jobGroup = jobGroup;
  }

    @PrimaryGeneratedColumn()
      id: number;

    @Column()
      date: Date;

    @Column()
      hoursWorked: number;

    @Column()
      employeeId: number;

    @Column()
      jobGroup: JobGroupName;
}
