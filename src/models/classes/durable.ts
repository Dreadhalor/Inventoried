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
      ['varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)','text','bit']
    ]
  }
  public static sqlFieldsWithValues(vals: any[]){
    return [
      'durables',
      ['id', 'serialNumber', 'categoryId', 'manufacturerId','notes','assignmentId','tagIds','active'],
      vals
    ]
  }

  public static formatDurable(idurable: IDurable){
    let keys = Object.keys(idurable);
    let result = [];
    keys.forEach((key) => result.push = idurable[key].join(','));
    return result;
  }
}