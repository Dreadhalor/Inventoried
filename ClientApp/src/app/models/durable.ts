import { InfoService } from '../services/info/info.service';
import { KeyValuePair } from './keyValuePair';
import { UtilitiesService } from "../services/utilities/utilities.service";
import { Globals } from '../globals';

export class Durable {

  private infoService: InfoService
  
  constructor(
    private _id = UtilitiesService.uuid(),
    private _serialNumber: string = '',
    private _categoryId = 0,
    private _manufacturerId = 0,
    private _notes: string = '',
    private _assignmentId = 0,
    private _tagIds = [],
    private _active: boolean = true
  ){
    if (_serialNumber) this.serialNumber = _serialNumber.toUpperCase();
  }

  injectService(service: InfoService){ this.infoService = service; }

  get id(){ return this._id; }

  get serialNumber(){ return this._serialNumber; }
  set serialNumber(val: string){ this._serialNumber = val.toUpperCase(); }

  get category(){
    let result = null;
    if (this.categoryId){
      result = this.infoService.getDurablesCategory(this.categoryId);
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

  get assignmentId(){ return this._assignmentId; }
  set assignmentId(val){ this._assignmentId = val; }

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

  get active(){ return this._active; }
  set active(val){ this._active = val; }

  copy(): Durable {
    let result = new Durable(
      this.id,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      this.assignmentId,
      Globals.deepCopy(this.tagIds),
      this.active
    );
    result.injectService(this.infoService);
    return result;
  }

  repair(){
    this._id = (this.id) ? this.id : UtilitiesService.uuid();
    this.serialNumber = (this.serialNumber) ? this.serialNumber : '';
    this.categoryId = (this.categoryId) ? this.categoryId : 0;
    this.manufacturerId = (this.manufacturerId) ? this.manufacturerId : 0;
    this.notes = (this.notes) ? this.notes : '';
    this.assignmentId = (this.assignmentId) ? this.assignmentId : 0;
    this.tagIds = (this.tagIds) ? this.tagIds : [];
  }

}