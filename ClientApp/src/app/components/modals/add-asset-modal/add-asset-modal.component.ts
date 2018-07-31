import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  assignable: boolean = true;

  modal: NgbModalRef = null;
  options = {
    centered: true,
    beforeDismiss: () => {
      this.reset();
      return true;
    }
  };

  constructor(
    private ms: NgbModal
  ) { }

  @ViewChild('content') content: ElementRef;
  
  ngOnInit() {
    this.reset();
  }

  reset(){
  }

  open(asset){
    this.show(this.content);
  }

  show(content) {
    this.modal = this.ms.open(content, this.options);
  }

  onSubmit(){
    this.printValues();
    this.reset();
    this.modal.close();
    this.modal = null;
  }

  printValues(){
    console.log(`Serial number: ${this.serialNumber}
    Category: ${this.categoryId}
    Manufacturer: ${this.manufacturerId}
    Notes: ${this.notes}
    Assignable: ${this.assignable}`);
  }

}