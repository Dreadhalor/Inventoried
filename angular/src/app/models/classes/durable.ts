import { Asset } from './asset';
import { IDurable } from '../interfaces/IDurable';
import { Globals } from '../../globals';

export class Durable extends Asset {

  private _serialNumber: string = '';
  private _assignmentId: string = '0';
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
      if (!result) return '0';
      //this.categoryId = '0';
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
  get available(){ return !!(this.assignmentId && this.assignmentId != '0'); }
  get availableVal(){ return (this.assignmentId && this.assignmentId != '0') ? 'Checked out' : 'Available'; }

  get active(){ return this._active; }
  get activeVal(){ return (this._active) ? 'Yes' : 'No'; }
  set active(val){ this._active = val; }

  get name(){ return `${this.categoryVal} ${this.serialNumber}`;}

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
    if (this.assignmentId == assignmentId) this.assignmentId = '0';
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

  static parseSQLIAssets(idurables: any[]): IDurable[]{
    let fields = ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'];
    return idurables.map(entry => {
      let result: any =  {};
      fields.forEach(field => result[field] = entry[field]);
      result.tagIds = entry.tagIds.split(',');
      return result;
    })
  }

  repair(){
    super.repair();
    this.serialNumber = (this.serialNumber) ? this.serialNumber : '';
    this.assignmentId = (this.assignmentId) ? this.assignmentId : '0';
    this.tagIds = (this.tagIds) ? this.tagIds : [];
  }

}