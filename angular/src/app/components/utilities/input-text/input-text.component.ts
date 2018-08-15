import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {

  private _value: string = '';
  @Input() get value(){ return this._value; }
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  set value(val){
    this._value = val;
    this.valueChange.emit(val);
  }

  @Input() placeholder = '';
  @Input() label = '';
  @Input() hint = '';
  
  constructor() { }

  ngOnInit() {
  }

}
