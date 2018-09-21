import { Injectable } from "@angular/core";
import { KeyValuePair } from "../models/classes/keyValuePair";
import { Globals } from "../globals";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.fetchSettings();
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
    return this.http.post(
      Globals.request_prefix + suffix,
      params
    );
  }

  //Durables categories
  _durablesCategories: KeyValuePair[] = [];
  get durablesCategories(){ return this._durablesCategories; }
  set durablesCategories(val: KeyValuePair[]){this._durablesCategories = val;}
  setDurablesCategories(val: KeyValuePair[]){
    let current = this.durablesCategories;
    this.durablesCategories = val;
    this.merge(current, val, 'settings/set_durables_categories')
      .subscribe(
        merged => {},
        error => this.durablesCategories = current
      )
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
    let current = this.consumablesCategories;
    this.consumablesCategories = val;
    this.merge(current, val, 'settings/set_consumables_categories')
      .subscribe(
        merged => {},
        error => this.consumablesCategories = current
      )
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
    let current = this.manufacturers;
    this.manufacturers = val;
    this.merge(current, val, 'settings/set_manufacturers')
      .subscribe(
        merged => {},
        error => this.manufacturers = current
      )
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
    let current = this.tags;
    this.tags = val;
    this.merge(current, val, 'settings/set_tags')
      .subscribe(
        merged => {},
        error => this.tags = current
      )
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
        res => this.overwriteSettings(res),
        err => {}
      );
  }
  overwriteSettings(settings){
    this.durablesCategories = settings.durablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this.consumablesCategories = settings.consumablesCategories.map(entry => KeyValuePair.fromInterface(entry));
    this.manufacturers = settings.manufacturers.map(entry => KeyValuePair.fromInterface(entry));
    this.tags = settings.tags.map(entry => KeyValuePair.fromInterface(entry));
  }
}
