import { Asset } from 'src/app/models/asset';
import { InfoService } from 'src/app/services/info/info.service';
import { UtilitiesService } from "src/app/services/utilities/utilities.service";
import { Globals } from 'src/app/globals';
import { IConsumable } from 'src/app/models/IConsumable';
import { KeyValuePair } from 'src/app/models/keyValuePair';

export class Consumable extends Asset {

  private _label: string = '';
  private _quantity: number = 0;
  private _assignmentIds: string[] = [];
  
  constructor(iConsumable: IConsumable){
    super({
      id: iConsumable.id,
      categoryId: iConsumable.categoryId,
      manufacturerId: iConsumable.manufacturerId,
      notes: iConsumable.notes,
      tagIds: iConsumable.tagIds
    });
    if (iConsumable.label) this.label = iConsumable.label;
    if (iConsumable.quantity) this.quantity = iConsumable.quantity;
    if (iConsumable.assignmentIds) this.assignmentIds = iConsumable.assignmentIds;
  }
  
  public get label() : string {
    return this._label;
  }
  public set label(val : string) {
    this._label = val;
  }

  
  public get quantity() : number {
    return this._quantity;
  }
  public set quantity(v : number) {
    this._quantity = v;
  }

  public get checkedOut() : number {
    return this.assignmentIds.length;
  }
  
  get category(){
    let result = null;
    if (this.categoryId){
      result = this.infoService.getConsumablesCategory(this.categoryId);
      if (!result) this.categoryId = '0';
    }
    return result;
  }
  get categoryVal(){
    let result = this.category;
    if (result) return result.value;
    return '';
  }

  get assignmentIds(){ return this._assignmentIds; }
  set assignmentIds(val){ this._assignmentIds = val; }

  get name(){ return `${this.label}`; }

  copy(): Consumable {
    let result = new Consumable({
      id: this.id,
      label: this.label,
      quantity: this.quantity,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentIds: Globals.deepCopy(this.assignmentIds),
      tagIds: Globals.deepCopy(this.tagIds)
    });
    result.injectService(this.infoService);
    return result;
  }

  repair(){
    super.repair();
    this.label = (this.label) ? this.label : '';
    this.quantity = (this.quantity) ? this.quantity : 0;
    this.assignmentIds = (this.assignmentIds) ? this.assignmentIds : [];
  }

}