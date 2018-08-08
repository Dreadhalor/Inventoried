import { UtilitiesService } from "src/app/services/utilities/utilities.service";

export class Assignment {

  constructor(
    private _id = UtilitiesService.uuid(),
    private _userId,
    private _assetId,
    private _checkoutDate: string,
    private _dueDate: string
  ){}

  get id(){ return this._id; }
  get userId(){ return this._userId; }
  get assetId(){ return this._assetId; }
  get checkoutDate(){ return this._checkoutDate; }
  get dueDate(){ return this._dueDate; }

}