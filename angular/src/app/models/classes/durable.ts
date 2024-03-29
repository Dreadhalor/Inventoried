import { Asset } from './asset';
import { IDurable } from '../interfaces/IDurable';
import { Globals } from '../../globals';

export class Durable extends Asset {

  private _serialNumber: string = '';
  private _assignmentId: string = '';
  private _active: boolean = true;
  
  constructor(iDurable: IDurable){
    super({
      id: iDurable.id,
      categoryId: iDurable.categoryId,
      manufacturerId: iDurable.manufacturerId,
      notes: iDurable.notes,
      tagIds: iDurable.tagIds
    });
    if (iDurable.serialNumber) this.serialNumber = iDurable.serialNumber.toUpperCase();
    if (iDurable.assignmentId) this.assignmentId = iDurable.assignmentId;
    if (typeof iDurable.active === 'boolean') this.active = iDurable.active;
  }

  get serialNumber(){ return this._serialNumber; }
  set serialNumber(val: string){ this._serialNumber = val.toUpperCase(); }

  get category(){
    let result = null;
    if (this.categoryId){
      result = this.infoService.getDurablesCategory(this.categoryId);
      if (!result) return '';
    }
    return result;
  }
  get categoryVal(){
    let result = this.category;
    if (result) return result.value;
    return '';
  }

  get assignmentId(){ return this._assignmentId; }
  set assignmentId(val){ this._assignmentId = val; }
  get available(){ return !!(this.assignmentId && this.assignmentId != ''); }
  get availableVal(){ return (this.assignmentId && this.assignmentId != '') ? 'Checked out' : 'Available'; }

  get active(){ return this._active; }
  get activeVal(){ return (this._active) ? 'Yes' : 'No'; }
  set active(val){ this._active = val; }

  get name(){ return `${(this.categoryVal) ? this.categoryVal : 'Durable'} ${this.serialNumber}`;}

  copy(): Durable {
    let result = new Durable({
      id: this.id,
      serialNumber: this.serialNumber,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentId: this.assignmentId,
      tagIds: Globals.deepCopy(this.tagIds),
      active: this.active
    });
    result.injectService(this.infoService);
    return result;
  }

  assign(assignmentId){
    this.assignmentId = assignmentId;
  }
  unassign(assignmentId){
    if (this.assignmentId == assignmentId) this.assignmentId = '';
  }

  asInterface(){
    let result: IDurable = {
      id: this.id,
      serialNumber: this.serialNumber,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentId: this.assignmentId,
      tagIds: this.tagIds,
      active: this.active
    }
    return result;
  }

  repair(){
    super.repair();
    this.serialNumber = (this.serialNumber) ? this.serialNumber : '';
    this.assignmentId = (this.assignmentId) ? this.assignmentId : '';
  }

}