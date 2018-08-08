import { InfoService } from 'src/app/services/info/info.service';
import { KeyValuePair } from './keyValuePair';
import { UtilitiesService } from "src/app/services/utilities/utilities.service";
import { Globals } from 'src/app/globals';

export class Consumable {

  private infoService: InfoService
  
  constructor(
    private _id = UtilitiesService.uuid(),
    private _label = '',
    private _quantity = 0,
    private _categoryId = 0,
    private _manufacturerId = 0,
    private _notes: string = '',
    private _assignmentIds = [],
    private _tagIds: any[] = []
  ){}

  injectService(service: InfoService){ this.infoService = service; }

  get id(){ return this._id; }
  
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
      if (!result) this.categoryId = 0;
    }
    return result;
  }
  get categoryVal(){
    let result = this.category;
    if (result) return result.value;
    return '';
  }
  get categoryId(){ return this._categoryId; }
  set categoryId(val){ this._categoryId = val; }

  get manufacturer(){
    let result = null;
    if (this.manufacturerId){
      result = this.infoService.getManufacturer(this.manufacturerId);
      if (!result) this.manufacturerId = 0;
    }
    return result;
  }
  get manufacturerVal(){
    let result = this.manufacturer;
    if (result) return result.value;
    return '';
  }
  get manufacturerId(){ return this._manufacturerId; }
  set manufacturerId(val){ this._manufacturerId = val; }
  
  get notes(){ return this._notes; }
  set notes(val){ this._notes = val; }

  get assignmentIds(){ return this._assignmentIds; }
  set assignmentIds(val){ this._assignmentIds = val; }

  get tagIds(){ return this._tagIds; }
  get tags(){
    let result: KeyValuePair[] = [];
    if (this.tagIds){
      for (let i = this.tagIds.length; i >= 0; i--){
        let tag = this.infoService.getTag(this.tagIds[i]);
        if (tag){
          result.unshift(tag);
        } else this.tagIds.splice(i,1);
      }
    } else this.repair();
    return result;
  }
  set tagIds(val){ this._tagIds = val; }

  copy(): Consumable {
    let result = new Consumable(
      this.id,
      this.label,
      this.quantity,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      Globals.deepCopy(this.assignmentIds),
      Globals.deepCopy(this.tagIds)
    );
    result.injectService(this.infoService);
    return result;
  }

  repair(){
    this._id = (this.id) ? this.id : UtilitiesService.uuid();
    this.label = (this.label) ? this.label : '';
    this.quantity = (this.quantity) ? this.quantity : 0;
    this.categoryId = (this.categoryId) ? this.categoryId : 0;
    this.manufacturerId = (this.manufacturerId) ? this.manufacturerId : 0;
    this.notes = (this.notes) ? this.notes : '';
    this.assignmentIds = (this.assignmentIds) ? this.assignmentIds : [];
    this.tagIds = (this.tagIds) ? this.tagIds : [];
  }

}