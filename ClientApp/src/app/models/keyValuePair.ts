import { IAutocompleteModel } from './IAutocompleteModel';
import { IKeyValuePair } from './IKeyValuePair';
import { UtilitiesService } from '../services/utilities/utilities.service';

export class KeyValuePair implements IKeyValuePair {
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
  toJson(){
    let result: IAutocompleteModel = {
      value: this.id,
      display: this.value
    };
    return result;
  }

  static JsonToKVP(model: IAutocompleteModel){
    return new KeyValuePair(model.value, model.display);
  }

}