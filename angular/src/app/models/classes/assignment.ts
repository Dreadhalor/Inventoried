import { Globals } from './../../globals';
import { UtilitiesService } from "../../services/utilities.service";
import { IAssignment } from "../interfaces/IAssignment";
import * as moment from 'moment';

export class Assignment {

  constructor(iAssignment: IAssignment){
    if (iAssignment.id) this._id = iAssignment.id;
    this.userId = iAssignment.userId;
    this.assetId = iAssignment.assetId;
    this.checkoutDate = moment(iAssignment.checkoutDate, Globals.dateFormat);
    this.dueDate = (iAssignment.dueDate) ? moment(iAssignment.dueDate, Globals.dateFormat) : null;
  }

  private _id = UtilitiesService.uuid();
  get id(){ return this._id; }

  private _userId;
  get userId(){ return this._userId; }
  set userId(v){ this._userId = v; }

  private _assetId;
  get assetId(){ return this._assetId; }
  set assetId(v){ this._assetId = v; }

  private _checkoutDate: moment.Moment;
  get checkoutDate(){ return this._checkoutDate; }
  set checkoutDate(v){ this._checkoutDate = v; }
  get checkoutDateText(){ return this.checkoutDate; }

  private _dueDate: moment.Moment;
  get dueDate(){ return this._dueDate; }
  set dueDate(v){ this._dueDate = v; }
  get dueDateText(){ return (this.dueDate) ? this.dueDate : 'N/A';}

  getOther(maId: string){
    if (this.userId == maId) return this.assetId;
    if (this.assetId == maId) return this.userId;
    return null;
  }

  asInterface(){
    let result: IAssignment = {
      id: this.id,
      userId: this.userId,
      assetId: this.assetId,
      checkoutDate: this.checkoutDate,
      dueDate: this.dueDate
    }
    return result;
  }
  postFormat(){
    let result = {
      id: this.id,
      userId: this.userId,
      assetId: this.assetId,
      checkoutDate: this.checkoutDate.format(Globals.dateFormat),
      dueDate: (this.dueDate) ? this.dueDate.format(Globals.dateFormat) : ''
    }
    return result;
  }

  copy(){
    return new Assignment({
      id: this.id,
      userId: this.userId,
      assetId: this.assetId,
      checkoutDate: this.checkoutDate,
      dueDate: this.dueDate
    });
  }

}