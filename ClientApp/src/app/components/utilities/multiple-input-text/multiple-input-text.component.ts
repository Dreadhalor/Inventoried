import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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

  private _entries : string[];
  @Input() get entries() : any { return this._entries; }
  @Output() entriesChange = new EventEmitter<any>();
  set entries(v : any) {
    this._entries = v;
    this.entriesChange.emit(v);
  }
  

  constructor() { }

  ngOnInit() {
    this.rowCount = this.rowMinimum;
  }

  first(index){ return index == 0; }
  middle(index){ return index > 0 && index < this.rowCount - 1 }
  penultimate(index){ return index == this.rowCount - 2 }
  last(index){ return index == this.rowCount - 1; }

  deletable(){ return this.rowCount > this.rowMinimum; }

  getPlaceholderText(indexPlusOne){
    let text = this.placeholder;
    if (this.rowCount > 1) text += ' ' + indexPlusOne;
    return text;
  }

  minusButtonClicked(){
    this.rowCount--;
  }
  plusButtonClicked(){
    this.rowCount++;
  }

}
