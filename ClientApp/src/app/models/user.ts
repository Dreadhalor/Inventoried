export class User {

  constructor(
    private _email: string,
    private _assignmentIds: string[] = []
  ){}
  
  get email(){ return this._email; }
  get id(){ return this._email; }
  get assignmentIds(){ return this._assignmentIds; }
  set assignmentIds(val: any[]){
    this._assignmentIds = val;
  }

  assign(assignmentId){
    this.assignmentIds.push(assignmentId);
  }
  unassign(assignmentId){
    let assignmentIndex = this.assignmentIds.findIndex(match => match == assignmentId);
    if (assignmentIndex >= 0) this.assignmentIds.splice(assignmentIndex,1);
  }
}