import { KeyValuePair } from '../../models/classes/keyValuePair';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  static initDurablesCategories = [
    "Monitor",
    "Laptop",
    "Projector",
    "Desktop",
    "Tablet"
  ]

  static initConsumablesCategories = [
    "Cable",
    "Mouse",
    "Keyboard",
    "Surge Protector",
    "Extension Cord"
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
    "Fragile",
    "New",
    "Heavy",
    "Wired"
  ]

  constructor(
    private http: HttpClient
  ) {
    this.fetchSettings();
    /*this.durablesCategories = InfoService.initDurablesCategories.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.consumablesCategories = InfoService.initConsumablesCategories.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.manufacturers = InfoService.initManufacturers.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.tags = InfoService.initTags.map((val, index) => new KeyValuePair((index + 1).toString(), val));*/
  }

  //Durables categories
  _durablesCategories: KeyValuePair[] = [];
  get durablesCategories(){ return this._durablesCategories; }
  set durablesCategories(val: KeyValuePair[]){
    this._durablesCategories = val;
    let settings = {
      durablesCategories: val.map(category => category.asInterface())
    };
    this.http.post(Globals.request_prefix + 'settings/set_settings', {settings: settings}).
      subscribe(
        res => console.log(res),
        err => console.log(err));
  }
  setDurablesCategories(val: KeyValuePair[]){
    this.durablesCategories = val;
  }
  getDurablesCategory(id){
    for (let i = 0; i < this.durablesCategories.length; i++){
      if (this.durablesCategories[i].id == id) return this.durablesCategories[i];
    }
    return null;
  }

  //Consumables categories
  _consumablesCategories: KeyValuePair[] = [];
  get consumablesCategories(){ return this._consumablesCategories; }
  set consumablesCategories(val: KeyValuePair[]){
    this._consumablesCategories = val;
    let settings = {
      consumablesCategories: val.map(category => category.asInterface())
    };
    this.http.post(Globals.request_prefix + 'settings/set_settings', {settings: settings}).
      subscribe(
        res => console.log(res),
        err => console.log(err));
  }
  setConsumablesCategories(val: KeyValuePair[]){
    this.consumablesCategories = val;
  }
  getConsumablesCategory(id){
    for (let i = 0; i < this.consumablesCategories.length; i++){
      if (this.consumablesCategories[i].id == id) return this.consumablesCategories[i];
    }
    return null;
  }

  //Manufacturers
  _manufacturers: KeyValuePair[] = [];
  get manufacturers(){ return this._manufacturers; }
  set manufacturers(val: KeyValuePair[]){
    this._manufacturers = val;
    let settings = {
      manufacturers: val.map(manufacturer => manufacturer.asInterface())
    };
    this.http.post(Globals.request_prefix + 'settings/set_settings', {settings: settings}).
      subscribe(
        res => console.log(res),
        err => console.log(err));
  }
  setManufacturers(val: KeyValuePair[]){
    this.manufacturers = val;
  }
  getManufacturer(id){
    for (let i = 0; i < this.manufacturers.length; i++){
      if (this.manufacturers[i].id == id) return this.manufacturers[i];
    }
    return null;
  }

  //Tags
  _tags: KeyValuePair[] = [];
  get tags(){ return this._tags; }
  set tags(val: KeyValuePair[]){
    this._tags = val;
    let settings = {
      tags: val.map(tag => tag.asInterface())
    };
    this.http.post(Globals.request_prefix + 'settings/set_settings', {settings: settings}).
      subscribe(
        res => console.log(res),
        err => console.log(err));
  }
  setTags(val: KeyValuePair[]){
    this.tags = val;
  }
  getTag(id){
    for (let i = 0; i < this.tags.length; i++){
      if (this.tags[i].id == id) return this.tags[i];
    }
    return null;
  }

  //All settings
  fetchSettings(){
    this.http.get(Globals.request_prefix + 'settings/get_settings').
      subscribe(
        (res) => {
          this.overwriteSettings(res);
        },
        err => console.log(err));
  }
  overwriteSettings(settings){
    this._durablesCategories = settings.durablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this._consumablesCategories = settings.consumablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this._manufacturers = settings.manufacturers.map(entry => KeyValuePair.fromInterface(entry));
    this._tags = settings.tags.map(entry => KeyValuePair.fromInterface(entry));
  }
}
