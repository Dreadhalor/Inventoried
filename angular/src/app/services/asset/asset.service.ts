import { Asset } from '../../models/classes/asset';
import { Assignment } from '../../models/classes/assignment';
import { InfoService } from '../info/info.service';
import { Injectable } from '@angular/core';
import { Durable } from '../../models/classes/durable';
import { Consumable } from '../../models/classes/consumable';
import { SeedValues } from '../seedvalues';

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

  constructor(
    private infoService: InfoService
  ) {
    SeedValues.initDurables.forEach(idurable => {
      this.addDurable(new Durable(idurable));
    })
    SeedValues.initConsumables.forEach(iconsumable => {
      this.addConsumable(new Consumable(iconsumable));
    })
  }

  getAsset(id){
    let asset: Asset = this.getDurable(id);
    if (asset) return asset;
    asset = this.getConsumable(id);
    if (asset) return asset;
  }
  getDurable(id){
    return this.durables.find(match => match.id == id);
  }
  getConsumable(id){
    return this.consumables.find(match => match.id == id);
  }

  addDurable(durable: Durable){
    durable.injectService(this.infoService);
    let assignmentIndex = this.pendingAssignments.findIndex(match => match.assetId == durable.id);
    if (assignmentIndex >= 0){
      durable.assign(this.pendingAssignments[assignmentIndex].id);
      this.pendingAssignments.splice(assignmentIndex,1);
    }
    this.durables.push(durable);
  }
  saveDurable(durable: Durable){
    let index = this.durables.findIndex(match => match.id == durable.id);
    if (index >= 0) this.durables[index] = durable;
  }

  addConsumable(consumable: Consumable){
    consumable.injectService(this.infoService);
    this.consumables.push(consumable);
  }
  saveConsumable(consumable: Consumable){
    let index = this.consumables.findIndex(match => match.id == consumable.id);
    if (index >= 0) this.consumables[index] = consumable;
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
