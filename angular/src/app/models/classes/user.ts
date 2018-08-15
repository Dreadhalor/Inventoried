import { MultiAssigned } from "../interfaces/MultiAssigned";

export class User implements MultiAssigned {

  constructor(
    private _id: string,
    private _email: string,
    private _fullName: string = '',
    private _assignmentIds: string[] = []
  ){}
  
  get id(){ return this._id; }
  get email(){ return this._email; }
  get fullName(){ return this._fullName; }
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