import { IAutoCompleteModel } from './IAutoCompleteModel';
import { IKeyValuePair } from './IKeyValuePair';
import { UtilitiesService } from '../services/utilities/utilities.service';

export class KeyValuePair implements IKeyValuePair {
  constructor(
    private _id: any = UtilitiesService.uuid(),
    private _value
  ){}

  get id(){ return this._id; }
  
  get value(){ return this._value; }
  set value(val){ this._value = val; }

  copy(): KeyValuePair {
    return new KeyValuePair(this.id,this.value);
  }

  toACM(){
    let result: IAutoCompleteModel = {
      value: this.id,
      display: this.value
    };
    return result;
  }

  static ACMToKVP(model: IAutoCompleteModel){
    return new KeyValuePair(model.value, model.display);
  }

}