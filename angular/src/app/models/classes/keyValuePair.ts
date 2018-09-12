import { IKeyValuePair } from '../interfaces/IKeyValuePair';
import { UtilitiesService } from '../../services/utilities.service';

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

  asInterface(){
    return {
      id: this.id,
      value: this.value
    };
  }
  equals(compare: KeyValuePair){
    return this.id == compare.id && this.value == compare.value;
  }
  static fromInterface(ikeyvaluepair: IKeyValuePair){
    return new KeyValuePair(ikeyvaluepair.id, ikeyvaluepair.value);
  }

}