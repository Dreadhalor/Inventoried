import { Injectable } from "@angular/core";
import { KeyValuePair } from "../models/classes/keyValuePair";
import { Globals } from "../globals";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";


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
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.fetchSettings();
    /*this.durablesCategories = InfoService.initDurablesCategories.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.consumablesCategories = InfoService.initConsumablesCategories.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.manufacturers = InfoService.initManufacturers.map((val, index) => new KeyValuePair((index + 1).toString(), val));
    this.tags = InfoService.initTags.map((val, index) => new KeyValuePair((index + 1).toString(), val));*/
  }

  //Shared
  getMergeParams(currentVals, updateVals){
    let toSave = updateVals.filter(match => !currentVals.find(found => found.equals(match)))
    .map(category => category.asInterface());
    let toDelete = currentVals.filter(match => !updateVals.find(found => found.id == match.id));
    let params = {
      to_save: toSave,
      to_delete: toDelete.map(category => category.id)
    };
    return params;
  }
  merge(currentVals, updateVals, suffix){
    let params = this.getMergeParams(currentVals, updateVals);
    this.http.post(
        Globals.request_prefix + suffix,
        params,
        {headers: this.auth.getHeaders()}
      )
      .subscribe(
        res => {},
        err => console.log(err)
      );
  }

  //Durables categories
  _durablesCategories: KeyValuePair[] = [];
  get durablesCategories(){ return this._durablesCategories; }
  set durablesCategories(val: KeyValuePair[]){this._durablesCategories = val;}
  setDurablesCategories(val: KeyValuePair[]){
    this.merge(this.durablesCategories, val, 'settings/set_durables_categories')
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
  set consumablesCategories(val: KeyValuePair[]){this._consumablesCategories = val;}
  setConsumablesCategories(val: KeyValuePair[]){
    this.merge(this.consumablesCategories, val, 'settings/set_consumables_categories')
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
  set manufacturers(val: KeyValuePair[]){this._manufacturers = val;}
  setManufacturers(val: KeyValuePair[]){
    this.merge(this._manufacturers, val, 'settings/set_manufacturers')
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
  set tags(val: KeyValuePair[]){this._tags = val;}
  setTags(val: KeyValuePair[]){
    this.merge(this._tags, val, 'settings/set_tags')
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
    this.durablesCategories = settings.durablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this.consumablesCategories = settings.consumablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this.manufacturers = settings.manufacturers.map(entry => KeyValuePair.fromInterface(entry));
    this.tags = settings.tags.map(entry => KeyValuePair.fromInterface(entry));
  }
}
