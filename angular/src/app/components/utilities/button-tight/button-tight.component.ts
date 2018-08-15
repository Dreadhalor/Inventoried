import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'button-tight',
  templateUrl: './button-tight.component.html',
  styleUrls: ['./button-tight.component.scss']
})
export class ButtonTightComponent implements OnInit {

  @Input() iconClasses: string;
  @Output() click = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
