import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  @ViewChild('select', {read: NgSelectComponent}) select: NgSelectComponent;

  @Input() items: any[];
  @Input() placeholder: string;
  @Input() appearance: string;
  @Input() bindLabel: string;
  @Input() bindValue: string;

  inputElement;

  
  private _value : any;
  @Input() get value() : any { return this._value; }
  @Output() valueChange = new EventEmitter<any>();
  set value(v : any) {
    this._value = v;
    this.valueChange.emit(v);
  }
  

  constructor() { }

  ngOnInit() {
  }

  //This is almost definitely gonna break
  blur(select: NgSelectComponent){
    if (!this.inputElement) this.inputElement = select.elementRef.nativeElement.firstChild.firstChild.children[2].firstChild;
    this.inputElement.blur();
  }

}
