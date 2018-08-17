import { IConsumable } from './../interfaces/IConsumable';
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
}