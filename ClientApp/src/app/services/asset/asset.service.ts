import { Assignment } from 'src/app/models/assignment';
import { InfoService } from 'src/app/services/info/info.service';
import { Injectable } from '@angular/core';
import { Durable } from 'src/app/models/durable';
import { Consumable } from 'src/app/models/consumable';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public static initDurables: Durable[] = [
    new Durable('1', 'sdfewagw', 3, 2, 'This is a thing', undefined, [1,3,4], undefined),
    new Durable('2', 'g34h6765', 1, 4, 'Hello, world!', undefined, [2,3], undefined),
    new Durable('3', 'e5yhgfhg', 5, 1, 'Ughhhhhh', undefined, [5,3], undefined),
    new Durable('4', '87fgh49y', 2, 5, 'Ooga booga shoeshine', undefined, [2], undefined),
    new Durable('5', 'df6890gh', 4, 3, 'Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean.', undefined, [2,1,4], undefined),
  ]

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
    AssetService.initDurables.forEach(durable => {
      this.addDurable(durable);
    })
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
      let asset = this.getDurable(assignment.assetId);
      if (asset) asset.assign(assignment.id);
      else this.pendingAssignments.push(assignment);
    }
  }
  unassign(assignment: Assignment){
    if (assignment){
      let asset = this.getDurable(assignment.assetId);
      if (asset) asset.unassign(assignment.id);
      let assignmentIndex = this.pendingAssignments.findIndex(match => match.id == assignment.id);
      if (assignmentIndex >= 0) this.pendingAssignments.splice(assignmentIndex,1);
    }
  }
}
