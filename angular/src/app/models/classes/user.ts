import { MultiAssigned } from "../interfaces/MultiAssigned";
import { IUser } from "../interfaces/IUser";

export class User implements MultiAssigned {

  private _id: string = '';
  username: string = '';
  firstName: string;
  middleName: string;
  lastName: string;
  jobTitle: string = '';
  departmentName: string = '';
  managerName: string;
  email: string = '';
  fullName: string = '';
  distinguishedName: string;
  assignmentIds: string[] = [];

  constructor(iUser: IUser){
    if (iUser.id) this._id = iUser.id;
    if (iUser.username) this.username = iUser.username;
    if (iUser.firstName) this.firstName = iUser.firstName;
    if (iUser.middleName) this.middleName = iUser.middleName;
    if (iUser.lastName) this.lastName = iUser.lastName;
    if (iUser.jobTitle) this.jobTitle = iUser.jobTitle;
    if (iUser.departmentName) this.departmentName = iUser.departmentName;
    if (iUser.managerName) this.managerName = iUser.managerName;
    if (iUser.email) this.email = iUser.email;
    if (iUser.fullName) this.fullName = iUser.fullName;
    if (iUser.distinguishedName) this.distinguishedName = iUser.distinguishedName;
    if (iUser.assignmentIds) this.assignmentIds = iUser.assignmentIds;
  }
  
  get id(){ return this._id; }

  get name(){ return this.fullName; }

  assign(assignmentId){
    this.assignmentIds.push(assignmentId);
  }
  unassign(assignmentId){
    let assignmentIndex = this.assignmentIds.findIndex(match => match == assignmentId);
    if (assignmentIndex >= 0) this.assignmentIds.splice(assignmentIndex,1);
  }
}