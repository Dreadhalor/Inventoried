import { KeyValuePair } from '../../models/keyValuePair';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfoService } from './../../services/info/info.service';
import { Globals } from '../../globals';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @ViewChild('category') category: ElementRef;
  @ViewChild('check') check: ElementRef;
  category_placeholders: KeyValuePair[] = [];
  editing_categories = false;
  adding_category = false;
  category_to_add = '';

  @ViewChild('status') status: ElementRef;
  adding_status = false;
  status_to_add = '';

  

  constructor(
    private _is: InfoService
  ) { }
  get is(){return this._is;}

  ngOnInit() {
  }

  newCategoryKeydown(event){
    if (event.key === "Enter") {
      this.category.nativeElement.blur();
      this.check.nativeElement.click();
      setTimeout(() => {this.addingCategoryButtonClicked()},50);
    }
  }
  editCategoryButtonClicked(){
    this.editing_categories = true;
    this.category_placeholders = Globals.deepCopy(this.is.asset_categories);
  }
  cancelEditCategoryButtonClicked(){
    this.resetCategoryEditing();
  }
  saveEditCategoryButtonClicked(){
    this.is.setAssetCategories(this.category_placeholders);
    this.resetCategoryEditing();
  }
  addingCategoryButtonClicked(){
    this.adding_category = true;
    setTimeout(() => {this.category.nativeElement.focus()},0);
  }
  cancelAddingCategoryButtonClicked(){
    this.adding_category = false;
  }
  addCategoryConfirmButtonClicked(){
    console.log("add category confirm button clicked");
    /*let category = new KeyValuePair(undefined,this.category_to_add);
    let added = this.is.addAisetCategory(category);
    added.then((aiset_categories) => {
      if (aiset_categories){
        this.category_placeholders = Globals.deepCopy(aiset_categories);
        this.resetAddCategory();
        this.addingCategoryButtonClicked();
      }
    })*/
  }
  deleteCategoryButtonClicked(uuid){
    /*this.is.deleteAisetCategory(uuid).then((categories) => {
      if (categories) this.category_placeholders = Globals.deepCopy(categories);
    });*/
  }
  resetCategoryEditing(){
    this.editing_categories = false;
    this.category_placeholders = [];
    this.resetAddCategory();
  }
  resetAddCategory(){
    this.adding_category = false;
    this.category_to_add = '';
  }

  addingStatusButtonClicked(){
    this.adding_status = true;
    setTimeout(() => {this.status.nativeElement.focus()},0);
  }
  cancelAddingStatusButtonClicked(){
    this.adding_status = false;
  }
  addStatusConfirmButtonClicked(){
    console.log("add status fired");
    /*let status = new SettingsEntry(undefined,this.status_to_add);
    this.is.addAssetStatus(status);*/
  }

}
