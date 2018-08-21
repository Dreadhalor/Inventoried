import { IDurable } from './../interfaces/IDurable';
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

  public static sqlFields(){
    return [
      'durables',
      ['id', 'serialNumber', 'categoryId', 'manufacturerId','notes','assignmentId','tagIds','active'],
      ['varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','bit']
    ]
  }
  public static sqlFieldsWithValues(durable: IDurable){
    return {
      tableName: 'durables',
      fields: ['id', 'serialNumber', 'categoryId', 'manufacturerId','notes','assignmentId','tagIds','active'],
      types: ['varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','bit'],
      values: this.formatDurable(durable)
    }
  }

  public static formatDurable(idurable: IDurable){
    let keys = Object.keys(idurable);
    let result = [];
    keys.forEach((key) => {
      if (typeof idurable[key] == 'object')
        result.push(idurable[key].join(','));
      else result.push(idurable[key]);
    });
    return result;
  }
}