import { KeyValuePair } from './../../../models/keyValuePair';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoService } from '../../../services/info/info.service';
import { AssetService } from '../../../services/asset/asset.service';
import { Asset } from '../../../models/asset';

@Component({
  selector: 'add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss']
})
export class AddAssetModalComponent implements OnInit {

  

  serialNumber: string = "";
  categoryId: number = 0;
  manufacturerId: number = 0;
  notes: string = "";
  tags = [];
  active: boolean = true;

  modal: NgbModalRef = null;
  options = {
    centered: true,
    beforeDismiss: () => {
      this.reset();
      return true;
    }
  };
  
  constructor(
    private ms: NgbModal,
    private is: InfoService,
    private assets: AssetService
  ) { }

  @ViewChild('content') content: ElementRef;
  
  ngOnInit() {
    this.reset();
  }

  reset(){
    this.serialNumber = "";
    this.categoryId = 0;
    this.manufacturerId = 0;
    this.notes = "";
    this.active = true;
  }

  open(asset){
    this.show(this.content);
  }

  show(content) {
    this.modal = this.ms.open(content, this.options);
  }

  hello(ugh){
    console.log(ugh);
  }

  onSubmit(){
    let newAsset = new Asset(
      undefined,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tags.map(tag => KeyValuePair.JsonToKVP(tag)),
      this.active
    );
    this.assets.assets.push(newAsset);
    this.reset();
    this.modal.close();
    this.modal = null;
  }

}