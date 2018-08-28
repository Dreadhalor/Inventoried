import * as uuid from 'uuid/v4';
import { IAssignment } from '../interfaces/IAssignment';

export class Assignment {
  
  public id: string = uuid();
  public userId: string;
  public assetId: string;
  public checkoutDate: string;
  public dueDate: string;
    

  constructor(iassignment: IAssignment){
    if (iassignment.id) this.id = iassignment.id;
    this.userId = iassignment.userId;
    this.assetId = iassignment.assetId;
    this.checkoutDate = iassignment.checkoutDate;
    this.dueDate = iassignment.dueDate;
  }

  public static sqlFieldsWithItem(item){
    return {
      tableName: 'assignment',
      columns: [
        {name: 'id', dataType: 'varchar(max)', primary: true},
        {name: 'userId', dataType: 'varchar(max)'},
        {name: 'assetId', dataType: 'varchar(max)'},
        {name: 'checkoutDate', dataType: 'varchar(max)'},
        {name: 'dueDate', dataType: 'varchar(max)'}
      ],
      item: item
    }
  }

}