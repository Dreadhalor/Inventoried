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
    //private http: HttpClient
  ) {
    /*http.get(
      Globals.request_prefix + Globals.settings_route
    ).subscribe((res: any) => {
      if (res.success){
        this.durablesCategories = res.result.durablesCategories;
      }
      this.loaded = true;
    })*/

  }

  //Durable good categories
  _durablesCategories: KeyValuePair[] = InfoService.initCategories.map((val, index) => new KeyValuePair(index + 1, val));
  get durablesCategories(){ return this._durablesCategories; }
  set durablesCategories(val: KeyValuePair[]){ this._durablesCategories = val; }

  setDurablesCategories(categories: KeyValuePair[]){
    this.durablesCategories = categories;
  }
  getDurablesCategory(id){
    for (let i = 0; i < this.durablesCategories.length; i++){
      if (this.durablesCategories[i].id == id) return this.durablesCategories[i];
    }
    return null;
  }

  //Manufacturers
  _manufacturers: KeyValuePair[] = InfoService.initManufacturers.map((val, index) => new KeyValuePair(index + 1, val));
  get manufacturers(){ return this._manufacturers; }
  set manufacturers(val: KeyValuePair[]){ this._manufacturers = val; }

  setManufacturers(manufacturers: KeyValuePair[]){
    this.manufacturers = manufacturers;
  }
  getManufacturer(id){
    for (let i = 0; i < this.manufacturers.length; i++){
      if (this.manufacturers[i].id == id) return this.manufacturers[i];
    }
    return null;
  }
  
  //Consumables categories
  _consumablesCategories: KeyValuePair[] = []
  get consumablesCategories(){ return this._consumablesCategories; }
  set consumablesCategories(val: KeyValuePair[]){ this._consumablesCategories = val; }
  
  setConsumablesCategories(categories: KeyValuePair[]){
    this.consumablesCategories = categories;
  }
  getConsumablesCategory(id){
    for (let i = 0; i < this.consumablesCategories.length; i++){
      if (this.consumablesCategories[i].id == id) return this.consumablesCategories[i];
    }
    return null;
  }

  //Tags
  _tags: KeyValuePair[] = InfoService.initTags.map((val, index) => new KeyValuePair(index + 1, val));
  get tags(){ return this._tags; }
  set tags(val: KeyValuePair[]){ this._tags = val; }
  
  tagsAsJson(){
    return this._tags.map(pair => pair.toACM());
  }
  
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
