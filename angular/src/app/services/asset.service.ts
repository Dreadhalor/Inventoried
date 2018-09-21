import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { Durable } from "../models/classes/durable";
import { Consumable } from "../models/classes/consumable";
import { Subject } from "rxjs";
import { InfoService } from "./info.service";
import { HttpClient } from "@angular/common/http";
import { IDurable } from "../models/interfaces/IDurable";
import { Globals } from "../globals";
import { IConsumable } from "../models/interfaces/IConsumable";
import { Asset } from "../models/classes/asset";
import { Assignment } from "../models/classes/assignment";


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
    private auth: AuthService,
    private infoService: InfoService,
    private http: HttpClient
  ) {
    auth.login.asObservable().subscribe(
      login => this.login()
    )
    auth.logout.asObservable().subscribe(
      logout => this.logout()
    )
    if (auth.loggedIn) this.login();
  }

  login(){
    this.fetchDurables();
    this.fetchConsumables();
  }
  logout(){
    this.durables = [];
    this.consumables = [];
    this.assetsEdited.next();
  }

  //Durables
  getDurable(id){
    return this.durables.find(match => match.id == id);
  }
  setDurables(idurables: IDurable[]){
    idurables.forEach(idurable => this.addDurableWithoutPost(new Durable(idurable)));
    this.assetsEdited.next();
  }
  fetchDurables(){
    this.http.get(Globals.request_prefix + 'assets/get_durables')
      .subscribe(
        durables => this.setDurables(durables as IDurable[]),
        error => {}
      );
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
    this.http.post(
      Globals.request_prefix + 'assets/save_asset',
      {asset: durable.asInterface()}
    ).subscribe(
      res => {
        this.addDurableWithoutPost(durable);
        this.assetsEdited.next();
      },
      err => {}
    );
  }
  addDurables(durables: Durable[]){
    this.http.post(
      Globals.request_prefix + 'assets/save_assets',
      {assets: durables.map(durable => durable.asInterface())}
    ).subscribe(
      res => {
        durables.forEach(durable => this.addDurableWithoutPost(durable));
        this.assetsEdited.next();
      },
      err => {}
    );
  }
  saveDurableWithoutPost(durable: Durable){
    let index = this.durables.findIndex(match => match.id == durable.id);
    if (index >= 0) this.durables[index] = durable;
  }
  saveDurable(durable: Durable){
    this.http.post(
      Globals.request_prefix + 'assets/save_asset',
      {asset: durable.asInterface()}
    ).subscribe(
      res => {
        this.saveDurableWithoutPost(durable);
        this.assetsEdited.next();
      },
      err => {}
    );
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
    this.http.get(Globals.request_prefix + 'assets/get_consumables')
      .subscribe(
        consumables => this.setConsumables(consumables as IConsumable[]),
        error => {}
      );
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
    this.http.post(
      Globals.request_prefix + 'assets/save_asset',
      {asset: consumable.asInterface()}
    ).subscribe(
      res => {
        this.addConsumableWithoutPost(consumable);
        this.assetsEdited.next();
      },
      err => {}
    );
  }
  saveConsumableWithoutPost(consumable: Consumable){
    let index = this.consumables.findIndex(match => match.id == consumable.id);
    if (index >= 0) this.consumables[index] = consumable;
  }
  saveConsumable(consumable: Consumable){
    this.http.post(
      Globals.request_prefix + 'assets/save_asset',
      {asset: consumable.asInterface()}
    ).subscribe(
      res => {
        this.saveConsumableWithoutPost(consumable);
        this.assetsEdited.next();
      },
      err => {}
    );
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
    this.http.post(
      Globals.request_prefix + 'assets/delete_asset',
      {asset: asset.asInterface()}
    ).subscribe(
      res => {
        this.deleteAssetWithoutPosting(asset);
        this.assetsEdited.next()
      },
      err => {}
    );
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
