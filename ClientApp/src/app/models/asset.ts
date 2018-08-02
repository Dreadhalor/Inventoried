import { KeyValuePair } from './keyValuePair';
import { UtilitiesService } from "../services/utilities/utilities.service";

export class Asset {
  
  constructor(
    private _id = UtilitiesService.uuid(),
    private _serialNumber: string = '',
    private _categoryId = 0,
    private _manufacturerId = 0,
    private _notes: string = '',
    private _assignmentId = 0,
    private _tags: KeyValuePair[] = [],
    private _active: boolean = true
  ){
    if (_serialNumber) this.serialNumber = _serialNumber.toUpperCase();
  }

  get id(){ return this._id; }

  get serialNumber(){ return this._serialNumber; }
  set serialNumber(val: string){ this._serialNumber = val.toUpperCase(); }

  get categoryId(){ return this._categoryId; }
  set categoryId(val){ this._categoryId = val; }

  get manufacturerId(){ return this._manufacturerId; }
  set manufacturerId(val){ this._manufacturerId = val; }
  
  get notes(){ return this._notes; }
  set notes(val){ this._notes = val; }

  get assignmentId(){ return this._assignmentId; }
  set assignmentId(val){ this._assignmentId = val; }

  get tags(){ return this._tags; }
  set tags(val){ this._tags = val; }

  get active(){ return this._active; }
  set active(val){ this._active = val; }

  copy(): Asset {
    return new Asset(
      this.id,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      this.assignmentId,
      this.tags,
      this.active
    );
  }

}