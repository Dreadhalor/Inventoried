import { KeyValuePair } from '../../models/keyValuePair';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  loaded = false;

  static initCategories = [
    "Monitor",
    "Laptop",
    "Projector",
    "Desktop",
    "Tablet"
  ]

  static initManufacturers = [
    "Lenovo",
    "HP",
    "Apple",
    "Samsung",
    "Duracell"
  ]

  static initTags = [
    "Bluetooth",
    "Poor condition",
    "New",
    "Bulky",
    "Black"
  ]

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

  //Durable good categories
  _asset_categories: KeyValuePair[] = InfoService.initCategories.map(val => new KeyValuePair(undefined, val));
  get asset_categories(){ return this._asset_categories; }
  set asset_categories(val: KeyValuePair[]){ this._asset_categories = val; }

  setAssetCategories(categories: KeyValuePair[]){
    this.asset_categories = categories;
  }
  getAssetCategory(id){
    for (let i = 0; i < this.asset_categories.length; i++){
      if (this.asset_categories[i].id == id) return this.asset_categories[i];
    }
    return null;
  }

  //Manufacturers
  _asset_manufacturers: KeyValuePair[] = InfoService.initManufacturers.map(val => new KeyValuePair(undefined, val));
  get asset_manufacturers(){ return this._asset_manufacturers; }
  set asset_manufacturers(val: KeyValuePair[]){ this._asset_manufacturers = val; }

  setAssetManufacturers(manufacturers: KeyValuePair[]){
    this.asset_manufacturers = manufacturers;
  }
  getAssetManufacturer(id){
    for (let i = 0; i < this.asset_manufacturers.length; i++){
      if (this.asset_manufacturers[i].id == id) return this.asset_manufacturers[i];
    }
    return null;
  }
  
  //Consumables categories
  _consumableCategories: KeyValuePair[] = []
  get consumableCategories(){ return this._consumableCategories; }
  set consumableCategories(val: KeyValuePair[]){ this._consumableCategories = val; }
  
  setConsumableCategories(categories: KeyValuePair[]){
    this.consumableCategories = categories;
  }
  getConsumableCategories(id){
    for (let i = 0; i < this.consumableCategories.length; i++){
      if (this.consumableCategories[i].id == id) return this.consumableCategories[i];
    }
    return null;
  }

  //Tags
  _tags: KeyValuePair[] = InfoService.initTags.map(val => new KeyValuePair(undefined, val));
  get tags(){ return this._tags; }
  set tags(val: KeyValuePair[]){ this._tags = val; }
  get tagsAsJson(){ return this._tags.map(pair => pair.toJson()); }
  
  setTags(tags: KeyValuePair[]){
    this.tags = tags;
  }
  getTags(id){
    for (let i = 0; i < this.tags.length; i++){
      if (this.tags[i].id == id) return this.tags[i];
    }
    return null;
  }
}
