import { IDurable } from './../../../../../src/models/interfaces/IDurable';
import { Globals } from './../../globals';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../../models/classes/asset';
import { Assignment } from '../../models/classes/assignment';
import { InfoService } from '../info/info.service';
import { Injectable } from '@angular/core';
import { Durable } from '../../models/classes/durable';
import { Consumable } from '../../models/classes/consumable';
import { SeedValues } from '../seedvalues';
import { Subject } from '../../../../node_modules/rxjs';
import { IConsumable } from '../../models/interfaces/IConsumable';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  _durables: Durable[] = [];
  get durables(){ return this._durables; }
  set durables(val: Durable[]){ this._durables = val; }

  _consumables: Consumable[] = [];
  get consumables(){ return this._consumables; }
  set consumables(val: Consumable[]){ this._consumables = val; }

  public addAssetTabIndex = 0;
  private _browseAssetsTabIndex = 0;
  get browseAssetsTabIndex(){ return this._browseAssetsTabIndex; }
  set browseAssetsTabIndex(val: number){
    this.addAssetTabIndex = val;
    this._browseAssetsTabIndex = val;
  }

  pendingAssignments = [];

  public assetsEdited = new Subject<any>();

  constructor(
    private infoService: InfoService,
    private http: HttpClient
  ) {
    /*SeedValues.initDurables.forEach(idurable => {
      this.addDurable(new Durable(idurable));
    })*/
    this.fetchDurables();
    /*SeedValues.initConsumables.forEach(iconsumable => {
      this.addConsumable(new Consumable(iconsumable));
    })*/
    this.fetchConsumables();
  }

  //Durables
  getDurable(id){
    return this.durables.find(match => match.id == id);
  }
  setDurables(idurables: IDurable[]){
    idurables.forEach(idurable => this.addDurableWithoutPost(new Durable(idurable)));
    console.log(this.durables);
    this.assetsEdited.next();
  }
  fetchDurables(){
    this.http.get(Globals.request_prefix + 'assets/get_durables').
      subscribe((res: object[]) => {
        this.setDurables(Durable.parseSQLIAssets(res));
      },
      err => console.log(err));
  }
  addDurableWithoutPost(durable: Durable){
    durable.injectService(this.infoService);
    let assignmentIndex = this.pendingAssignments.findIndex(match => match.assetId == durable.id);
    if (assignmentIndex >= 0){
      durable.assign(this.pendingAssignments[assignmentIndex].id);
      this.pendingAssignments.splice(assignmentIndex,1);
    }
    this.durables.push(durable);
  }
  addDurable(durable: Durable){
    this.addDurableWithoutPost(durable);
    this.http.post(Globals.request_prefix + 'assets/add_asset', {asset: durable.asInterface()}).
      subscribe(res => {
        this.assetsEdited.next();
      },
      err => console.log(err));
  }
  saveDurable(durable: Durable){
    let index = this.durables.findIndex(match => match.id == durable.id);
    if (index >= 0) this.durables[index] = durable;
    this.http.post(Globals.request_prefix + 'assets/update_asset', {asset: durable.asInterface()}).
      subscribe(
        res => this.assetsEdited.next(),
        err => console.log(err));
  }

  //Consumables
  getConsumable(id){
    return this.consumables.find(match => match.id == id);
  }
  setConsumables(iconsumables: IConsumable[]){
    iconsumables.forEach(iconsumable => this.addConsumableWithoutPost(new Consumable(iconsumable)));
    this.assetsEdited.next();
  }
  fetchConsumables(){
    this.http.get(Globals.request_prefix + 'assets/get_consumables').
      subscribe((res: object[]) => {
        this.setConsumables(Consumable.parseSQLIAssets(res));
      },
      err => console.log(err));
  }
  addConsumableWithoutPost(consumable: Consumable){
    consumable.injectService(this.infoService);
    let assignmentIndex = this.pendingAssignments.findIndex(match => match.assetId == consumable.id);
    if (assignmentIndex >= 0){
      consumable.assign(this.pendingAssignments[assignmentIndex].id);
      this.pendingAssignments.splice(assignmentIndex,1);
    }
    this.consumables.push(consumable);
  }
  addConsumable(consumable: Consumable){
    this.addConsumableWithoutPost(consumable);
    this.http.post(Globals.request_prefix + 'assets/add_asset', {asset: consumable.asInterface()}).
      subscribe(
        res => this.assetsEdited.next(),
        err => console.log(err));
  }
  saveConsumable(consumable: Consumable){
    let index = this.consumables.findIndex(match => match.id == consumable.id);
    if (index >= 0) this.consumables[index] = consumable;
    this.http.post(Globals.request_prefix + 'assets/update_asset', {asset: consumable.asInterface()}).
      subscribe(
        res => this.assetsEdited.next(),
        err => console.log(err));
  }


  //Assets
  getAsset(id){
    let asset: Asset = this.getDurable(id);
    if (asset) return asset;
    asset = this.getConsumable(id);
    if (asset) return asset;
  }
  deleteAssetWithoutPosting(asset: Asset){
    let index = this.durables.findIndex(match => match.id == asset.id);
    if (index >= 0) this.durables.splice(index,1);
    else index = this.consumables.findIndex(match => match.id == asset.id);
    if (index >= 0) this.consumables.splice(index,1);
  }
  deleteAsset(asset: Asset){
    this.deleteAssetWithoutPosting(asset);
    this.http.post(Globals.request_prefix + 'assets/delete_asset', {asset: asset.asInterface()}).
      subscribe(
        res => this.assetsEdited.next(),
        err => console.log(err));
  }
  assign(assignment: Assignment){
    if (assignment){
      let asset = this.getAsset(assignment.assetId);
      if (asset) asset.assign(assignment.id);
      else this.pendingAssignments.push(assignment);
    }
  }
  unassign(assignment: Assignment){
    if (assignment){
      let asset = this.getAsset(assignment.assetId);
      if (asset) asset.unassign(assignment.id);
      let assignmentIndex = this.pendingAssignments.findIndex(match => match.id == assignment.id);
      if (assignmentIndex >= 0) this.pendingAssignments.splice(assignmentIndex,1);
    }
  }
}
