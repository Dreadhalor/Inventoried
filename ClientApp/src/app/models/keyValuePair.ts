import { UtilitiesService } from './../services/utilities/utilities.service';
export class KeyValuePair {
  constructor(
    private _id = UtilitiesService.uuid(),
    private _value
  ){}

  get id(){ return this._id; }
  get value(){ return this._value; }
  set value(val){ this._value = val; }

  copy(){
    return new KeyValuePair(this.id,this.value);
  }

}