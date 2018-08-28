import { IDurable } from '../interfaces/IDurable';
let db = require('./db');

export class Durable {
  public static sample(){
    let sample: IDurable = {
      id: '',
      serialNumber: '',
      categoryId: '',
      manufacturerId: '',
      notes: '',
      assignmentId: '',
      tagIds: [''],
      active: true
    }
    return sample;
  }

  public static sqlFieldsWithValues(durable: IDurable){
    return {
      tableName: 'durables',
      fields: ['id', 'serialNumber', 'categoryId', 'manufacturerId','notes','assignmentId','tagIds','active'],
      types: ['varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','bit'],
      durable: durable
    }
  }

}