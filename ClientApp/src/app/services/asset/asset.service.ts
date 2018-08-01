import { Injectable } from '@angular/core';
import { Asset } from '../../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  _assets: Asset[] = [];
  get assets(){ return this._assets; }
  set assets(val: Asset[]){ this._assets = val; }

  constructor() { }
}
