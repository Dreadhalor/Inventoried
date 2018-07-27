import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: ['./add-asset-modal.component.scss']
})
export class AddAssetModalComponent implements OnInit {

  serial_number: string;
  category: string;
  status: string;

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
    this.reset();
    this.modal.close();
    this.modal = null;
  }

}