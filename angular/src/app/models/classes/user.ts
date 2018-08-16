import { MultiAssigned } from "../interfaces/MultiAssigned";
import { IUser } from "../interfaces/IUser";

export class User implements MultiAssigned {

  private _id: string = '';
  private _email: string = '';
  private _fullName: string = '';
  private _assignmentIds: string[] = [];

  constructor(iUser: IUser){
    if (iUser.id) this._id = iUser.id;
    if (iUser.email) this.email = iUser.email;
    if (iUser.fullName) this.fullName = iUser.fullName;
    if (iUser.assignmentIds) this.assignmentIds = iUser.assignmentIds;
  }
  
  get id(){ return this._id; }
  get email(){ return this._email; }
  set email(v){ this._email = v; }
  get fullName(){ return this._fullName; }
  set fullName(v){ this._fullName = v; }
  get assignmentIds(){ return this._assignmentIds; }
  set assignmentIds(val: any[]){
    this._assignmentIds = val;
  }

  get name(){ return this.email; }

  assign(assignmentId){
    this.assignmentIds.push(assignmentId);
  }
  unassign(assignmentId){
    let assignmentIndex = this.assignmentIds.findIndex(match => match == assignmentId);
    if (assignmentIndex >= 0) this.assignmentIds.splice(assignmentIndex,1);
  }
}