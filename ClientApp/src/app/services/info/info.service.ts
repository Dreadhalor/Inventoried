import { UtilitiesService } from './../utilities/utilities.service';
import { KeyValuePair } from './../../models/keyValuePair';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  loaded = false;

  _asset_categories: KeyValuePair[] = []
  get asset_categories(){ return this._asset_categories; }
  set asset_categories(val: KeyValuePair[]){ this._asset_categories = val; }

  _asset_manufacturers: KeyValuePair[] = []
  get asset_manufacturers(){ return this._asset_manufacturers; }
  set asset_manufacturers(val: KeyValuePair[]){ this._asset_manufacturers = val; }

  constructor(
    private http: HttpClient
  ) {
    /*http.get(
      Globals.request_prefix + Globals.settings_route
    ).subscribe((res: any) => {
      if (res.success){
        this.asset_categories = res.result.asset_categories;
      }
      this.loaded = true;
    })*/
  }

  setAssetCategories(categories: KeyValuePair[]){
    this.asset_categories = categories;
  }
  getAssetCategory(id){
    for (let i = 0; i < this.asset_categories.length; i++){
      if (this.asset_categories[i].id == id) return this.asset_categories[i];
    }
    return null;
  }

  setAssetManufacturers(manufacturers: KeyValuePair[]){
    this.asset_manufacturers = manufacturers;
  }
  getAssetManufacturer(id){
    for (let i = 0; i < this.asset_manufacturers.length; i++){
      if (this.asset_manufacturers[i].id == id) return this.asset_manufacturers[i];
    }
    return null;
  }
}
