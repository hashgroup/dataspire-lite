import {get} from 'lodash';
import { Column } from '../table/table.definition';

// Make sure these keys are correct with BE api response
enum GuestFieldMap {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  ltvClass = 'ltvClass',
  low = 'low',
  mid = 'mid',
  high = 'high',
  type = 'type',
}

export enum GuestType {
  firstTime = '1st-Time Guest',
  returning = 'Returning Guest'
}

export class GuestInfo {
  fullName: string;
  email: string;
  type: string;
  low: number;
  mid: number;
  high: number;

  constructor(object: object) {
    this.fullName = `${get(object, GuestFieldMap.firstName, '')} ${get(object, GuestFieldMap.lastName, '')}`;
    this.email = get(object, GuestFieldMap.email, null);
    this.type = get(object, GuestFieldMap.type, null);
    this.low = get(object, GuestFieldMap.low, 0);
    this.mid = get(object, GuestFieldMap.mid, 0);
    this.high = get(object, GuestFieldMap.high, 0);
  }
}

export const GUEST_COLUMNS = [
  new Column('fullName', 'Full Name'),
  new Column('email', 'Email Address'),
  new Column('type', 'Type'),
  new Column('low', 'Low'),
  new Column('mid', 'Mid'),
  new Column('high', 'High'),
]
