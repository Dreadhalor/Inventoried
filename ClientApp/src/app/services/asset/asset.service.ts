import { InfoService } from '../info/info.service';
import { Injectable } from '@angular/core';
import { Asset } from '../../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public static initAssets: Asset[] = [
    new Asset(undefined, 'sdfewagw', 3, 2, 'This is a thing', undefined, undefined, undefined),
    new Asset(undefined, 'g34h6765', 1, 4, 'Hello, world!', undefined, undefined, undefined),
    new Asset(undefined, 'e5yhgfhg', 5, 1, 'Ughhhhhh', undefined, undefined, undefined),
    new Asset(undefined, '87fgh49y', 2, 5, 'Ooga booga shoeshine', undefined, undefined, undefined),
    new Asset(undefined, 'df6890gh', 4, 3, 'Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean.', undefined, undefined, undefined),
  ]

  _assets: Asset[] = [];
  get assets(){ return this._assets; }
  set assets(val: Asset[]){ this._assets = val; }

  constructor(
    private infoService: InfoService
  ) {
    AssetService.initAssets.forEach(asset => {
      this.addAsset(asset);
    })
  }

  addAsset(asset: Asset){
    asset.injectService(this.infoService);
    this.assets.push(asset);
  }
  saveAsset(asset: Asset){
    console.log(asset);
    let index = this.assets.findIndex(match => match.id == asset.id);
    if (index >= 0) this.assets[index] = asset;
  }
}
