import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'multiple-input-text',
  templateUrl: './multiple-input-text.component.html',
  styleUrls: ['./multiple-input-text.component.scss']
})
export class MultipleInputTextComponent implements OnInit {

  rowCount = 1;
  @Input() rowMinimum = 1;
  get rows(){ return new Array(this.rowCount); }

  constructor() { }

  ngOnInit() {
  }

  deletable(){ return this.rowCount > this.rowMinimum; }

  minusButtonClicked(){
    this.rowCount--;
  }
  plusButtonClicked(){
    this.rowCount++;
  }

}
