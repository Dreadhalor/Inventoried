import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'multiple-input-text',
  templateUrl: './multiple-input-text.component.html',
  styleUrls: ['./multiple-input-text.component.scss']
})
export class MultipleInputTextComponent implements OnInit {

  @Input() rowMinimum: number;

  @Input() placeholder = '';
  @Input() uppercase = false;

  private _entries : string[] = [];
  @Input() get entries() : any { return this._entries; }
  @Output() entriesChange = new EventEmitter<any>();
  set entries(v : any) {
    this._entries = v;
    this.entriesChange.emit(v);
  }

  private focused: boolean[] = [];
  private hovered: boolean[] = [];
  private focusColor = '#3f51b5';

  getRows(){ return new Array(this.entries.length); }

  constructor() { }

  ngOnInit() {
    for (let i = this.entries.length; i < this.rowMinimum; i++) this.entries.push('');
  }

  first(index){ return index == 0; }
  middle(index){ return index > 0 && index < this.entries.length - 1 }
  penultimate(index){ return index == this.entries.length - 2 }
  last(index){ return index == this.entries.length - 1; }

  deletable(){ return this.entries.length > this.rowMinimum; }

  getPlaceholderText(indexPlusOne){
    let text = this.placeholder;
    if (this.entries.length > 1) text += ' ' + indexPlusOne;
    return text;
  }

  minusButtonClicked(index){
    this.entries.splice(index,1);
  }
  plusButtonClicked(){
    this.entries.splice(this.entries.length,0,'');
  }
  clearClicked(index,event){
    event.stopPropagation();
    this.entries[index] = '';
  }

  focus(index, focus){
    this.focused[index] = focus;
  }
  hover(index, hover){
    this.hovered[index] = hover;
  }

  activeBorder(index){return this.focused[index];}
  border(index){
    return this.activeBorder(index) ? this.focusColor : 'black';
  }
  activeOpacity(index){return this.activeBorder(index) || this.hovered[index];}
  opacity(index){
    return (this.activeOpacity(index)) ? '1' : '0';
  }
  transition(index){
    let border = 'border-color 0.4s';
    let opacity = this.activeOpacity(index) ? 'opacity 0.4s' : 'opacity 0s';
    let result = `${opacity}, ${border}`;
    return result; 
  }
  scale = 0.75;
  floating(index){
    return this.focused[index] || this.entries[index];
  }
  floatingTransform(index){
    if (this.floating(index))
      return `scale(${this.scale}) translateY(-20px)`;
    return '';
  }
  floatingColor(index){
    if (this.floating(index))
      return this.focusColor;
    return 'rgba(0,0,0,0.6)';
  }

}
