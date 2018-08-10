import { IAsset } from '../interfaces/IAsset';
import { UtilitiesService } from "../../services/utilities/utilities.service";
import { InfoService } from '../../services/info/info.service';
import { KeyValuePair } from './keyValuePair';

export abstract class Asset implements IAsset  {
  
  constructor(
    iAsset: IAsset
  ){
    if (iAsset.id) this._id = iAsset.id;
    if (iAsset.categoryId) this.categoryId = iAsset.categoryId;
    if (iAsset.manufacturerId) this.manufacturerId = iAsset.manufacturerId;
    if (iAsset.notes) this.notes = iAsset.notes;
    if (iAsset.tagIds) this.tagIds = iAsset.tagIds;
  }

  public infoService: InfoService
  injectService(service: InfoService){ this.infoService = service; }

  private _id: string = UtilitiesService.uuid();
  public get id(): string{
    return this._id;
  }
  
  private _categoryId : string = '0';
  public get categoryId() : string {
    return this._categoryId;
  }
  public set categoryId(v : string) {
    this._categoryId = v;
  }
  
  
  private _manufacturerId : string = '0';
  public get manufacturerId() : string {
    return this._manufacturerId;
  }
  public set manufacturerId(v : string) {
    this._manufacturerId = v;
  }
  get manufacturer(){
    let result = null;
    if (this.manufacturerId){
      result = this.infoService.getManufacturer(this.manufacturerId);
      if (!result) this.manufacturerId = '0';
    }
    return result;
  }
  get manufacturerVal(){
    let result = this.manufacturer;
    if (result) return result.value;
    return '';
  }
  
  
  private _notes : string = '';
  public get notes() : string {
    return this._notes;
  }
  public set notes(v : string) {
    this._notes = v;
  }
  
  private _tagIds : string[] = [];
  public get tagIds() : string[] {
    return this._tagIds;
  }
  public set tagIds(v : string[]) {
    this._tagIds = v;
  }
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

  abstract get name(): string;
  abstract assign(assignmentId: string): void;
  abstract unassign(assignmentId: string): void;

  repair(){
    this._id = (this.id) ? this.id : UtilitiesService.uuid();
    this.categoryId = (this.categoryId) ? this.categoryId : '0';
    this.manufacturerId = (this.manufacturerId) ? this.manufacturerId : '0';
    this.notes = (this.notes) ? this.notes : '';
    this.tagIds = (this.tagIds) ? this.tagIds : [];
  }
}