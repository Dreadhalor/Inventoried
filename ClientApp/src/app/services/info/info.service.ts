import { KeyValuePair } from './../../models/keyValuePair';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../globals';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  loaded = false;

  _asset_categories: KeyValuePair[] = [];
  get asset_categories(){
    let test = new Subject<Object>().next(this._asset_categories);
  }
  set asset_categories(val: KeyValuePair[]){
    this._asset_categories = val;
  }

  constructor(
    private http: HttpClient
  ) {
    http.get(
      Globals.request_prefix + Globals.settings_route
    ).subscribe((res: any) => {
      if (res.success){
        this.asset_categories = res.result.asset_categories;
      }
      this.loaded = true;
    })
  }

  addAssetCategory = (category: KeyValuePair) => {
    /*let body = {
      uuid: category.uuid,
      value: category.value
    };
    return new Promise((resolve) => {
      this.http.post(
        Globals.request_prefix + 'settings/add_asset_category',
        body
      ).subscribe((res: any) => {
        if (res.success){
          this.asset_categories = res.result.asset_categories;
          resolve(this.asset_categories);
        }
        resolve(null);
      })
    });*/
    console.log("add asset category called");
  }
  deleteAssetCategory(uuid){
    /*let body = {
      uuid: uuid
    };
    return new Promise((resolve) => {
      this.http.post(
        Globals.request_prefix + 'settings/delete_asset_category',
        body
      ).subscribe((res: any) => {
        if (res.success){
          this.asset_categories = res.result.asset_categories;
          resolve(this.asset_categories);
        }
        resolve(null);
      })
    });*/
    console.log('delete asset category called');
  }
  setAssetCategories(categories_arg: KeyValuePair[]){
    /*let categories = Globals.deepCopy(categories_arg);
    let body = {
      categories: []
    };
    categories.forEach(category => body.categories.push(category));
    this.http.post(
      Globals.request_prefix + 'settings/set_asset_categories',
      body
    ).subscribe((res: any) => {
      if (res.success){
        this.asset_categories = res.result.asset_categories;
        return true;
      }
      return false;
    })*/
    console.log('set asset categories called');
  }
  getAssetCategory(id){
    for (let i = 0; i < this.asset_categories.length; i++){
      if (this.asset_categories[i].id == id) return this.asset_categories[i];
    }
    return null;
  }
}
