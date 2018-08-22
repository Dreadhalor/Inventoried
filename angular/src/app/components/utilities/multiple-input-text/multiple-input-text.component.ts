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

  state(index){
    if (this.focused[index]){
      if (this.entries[index]) return state.activatedFilled;
      return state.activatedEmpty;
    }
    if (this.hovered[index]){
      if (this.entries[index]) return state.hoverFilled;
      return state.hoverEmpty;
    }
    return state.inactive;
  }
  
  border(index){
    switch(this.state(index)){
      case state.activatedEmpty:
      case state.activatedFilled:
        return this.focusColor;
      default: return 'black';
    }
  }
  opacity(index){
    switch(this.state(index)){
      case state.activatedEmpty:
      case state.activatedFilled:
      case state.hoverEmpty:
      case state.hoverFilled: return '1';
      default: return '0';
    }
  }
  transition(index){
    let border = 'border-color 0.4s';
    let opacity = 'opacity ';
    switch(this.state(index)){
      case state.activatedEmpty:
      case state.activatedFilled:
      case state.hoverEmpty:
      case state.hoverFilled:
        opacity += '0.4s';
        break;
      default:
        opacity += '0s';
        break;
    }
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
    switch(this.state(index)){
      case state.activatedEmpty:
      case state.activatedFilled:
        return this.focusColor;
      default: return 'rgba(0,0,0,0.6)';
    }
  }

  clearButton(index){
    switch(this.state(index)){
      case state.activatedFilled:
      case state.hoverFilled: return true;
      default: return false;
    }
  }

}

export enum state {
  inactive = 0,
  activatedEmpty = 1,
  activatedFilled = 2,
  hoverEmpty = 3,
  hoverFilled = 4
}