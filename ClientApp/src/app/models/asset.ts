import { UtilitiesService } from "../services/utilities/utilities.service";

export class Asset {
  
  constructor(
    private _id = UtilitiesService.uuid(),
    private _serialNumber = '',
    private _categoryId = 0,
    private _manufacturerId = 0,
    private _notes: string = '',
    private _assignmentId = 0,
    private _tags = [],
    private _active: boolean = true
  ){}

  get id(){ return this._id; }

  get serialNumber(){ return this._serialNumber; }
  set serialNumber(val){ this._serialNumber = val; }

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

}