import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'multiple-input-text',
  templateUrl: './multiple-input-text.component.html',
  styleUrls: ['./multiple-input-text.component.scss']
})
export class MultipleInputTextComponent implements OnInit {

  @Input() rowMinimum: number;
  rowCount: number;
  
  get rows(){ return new Array(this.rowCount); }

  @Input() placeholder = '';
  @Input() uppercase = false;

  constructor() { }

  ngOnInit() {
    this.rowCount = this.rowMinimum;
  }

  first(index){ return index == 0; }
  middle(index){ return index > 0 && index < this.rowCount - 1 }
  penultimate(index){ return index == this.rowCount - 2 }
  last(index){ return index == this.rowCount - 1; }

  deletable(){ return this.rowCount > this.rowMinimum; }

  minusButtonClicked(){
    this.rowCount--;
  }
  plusButtonClicked(){
    this.rowCount++;
  }

}
