import { IConsumable } from './../interfaces/IConsumable';
import { Asset } from './asset';
export class Consumable {
  public static sample(){
    let sample: IConsumable = {
      id: '',
      label: '',
      quantity: 0,
      categoryId: '',
      manufacturerId: '',
      notes: '',
      assignmentIds: [''],
      tagIds: ['']
    }
    return sample;
  }

  public static sqlFieldsWithValues(consumable: IConsumable){
    return {
      tableName: 'consumables',
      fields: ['id', 'label', 'quantity', 'categoryId', 'manufacturerId','notes','assignmentIds','tagIds'],
      types: ['varchar(max)','varchar(max)','int','varchar(max)','varchar(max)','varchar(max)','varchar(max)','varchar(max)'],
      values: Asset.formatAsset(consumable)
    }
  }
}