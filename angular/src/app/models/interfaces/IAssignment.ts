import * as moment from 'moment';

export interface IAssignment {
  id: string,
  userId: string,
  assetId: string,
  checkoutDate: moment.Moment,
  dueDate: moment.Moment
}