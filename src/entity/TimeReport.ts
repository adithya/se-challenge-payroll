import { Entity, PrimaryColumn } from 'typeorm';
import { ITimeReport } from '../../types';

@Entity()
export class TimeReport implements ITimeReport {
    @PrimaryColumn('int')
      id: number;
}
