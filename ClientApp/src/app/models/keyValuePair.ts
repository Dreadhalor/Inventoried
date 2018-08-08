import { IKeyValuePair } from './IKeyValuePair';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';

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

}