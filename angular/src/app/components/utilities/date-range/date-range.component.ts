import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {
  
  private _startDate : moment.Moment;
  @Input() get startDate() : moment.Moment {
    return this._startDate;
  }
  @Output() startDateChange = new EventEmitter<moment.Moment>();
  set startDate(v : moment.Moment) {
    this._startDate = v;
    this.startDateChange.emit(v);
  }

  private _endDate : moment.Moment;
  @Input() get endDate() : moment.Moment {
    return this._endDate;
  }
  @Output() endDateChange = new EventEmitter<moment.Moment>();
  set endDate(v : moment.Moment) {
    this._endDate = v;
    this.endDateChange.emit(v);
  }

  private _isIndeterminate : boolean;
  @Input() get isIndeterminate() : boolean {
    return this._isIndeterminate;
  }
  @Output() isIndeterminateChange = new EventEmitter<boolean>();
  set isIndeterminate(v : boolean) {
    this._isIndeterminate = v;
    this.isIndeterminateChange.emit(v);
  }

  private _valid : boolean;
  @Input() get valid() : boolean {
    return this._valid;
  }
  @Output() validChange = new EventEmitter<boolean>();
  set valid(v : boolean) {
    this._valid = v;
    this.validChange.emit(v);
  }

  display: string;

  leftMonth: moment.Moment = moment();
  rightMonth: moment.Moment = moment();

  popoverStartDate = null;
  popoverEndDate = null;
  popoverIsIndeterminate = false;
  mouseoverDate = null;

  constructor() { }

  ngOnInit() {
  }

  setStartDateToday(){
    this.popoverStartDate = moment();
  }
  setEndAhead(months){
    this.setIndeterminate(false);
    this.popoverEndDate = this.popoverStartDate.clone().add(months, 'months');
  }
  setIndeterminate(indeterminate){
    this.popoverIsIndeterminate = indeterminate;
    if (indeterminate) this.popoverEndDate = null;
  }

  titleText(){
    if (this.display){
      return this.display;
    } return '- select date range -';
  }

  rangeLength(){
    if (!this.popoverIsIndeterminate && this.popoverStartDate){
      if (this.popoverEndDate) return this.popoverEndDate.diff(this.popoverStartDate, 'days');
      else if (this.mouseoverDate) return this.mouseoverDate.diff(this.popoverStartDate, 'days');
    }
    return null;
  }
  rangeLengthText(){
    let range = this.rangeLength();
    if (range > 0){
      if (range > 1) return `${range} days`;
      return `${range} day`;
    }
    return '';
  }

  getStartDateText(){
    if (this.popoverStartDate){
      return this.popoverStartDate.format('MMM Do YYYY');
    }
    return '-';
  }
  getEndDateText(){
    if (this.popoverEndDate){
      return this.popoverEndDate.format('MMM Do YYYY');
    } else if (this.popoverIsIndeterminate) return 'N/A';
    return '-';
  }

  resetValues(){
    this.popoverStartDate = this.startDate;
    this.popoverEndDate = this.endDate;
    this.mouseoverDate = null;
    this.popoverIsIndeterminate = this.isIndeterminate;
    this.leftMonth = moment();
    this.rightMonth = moment();
  }

  popoverShown(){
    this.resetValues();
  }

  selectionIsValid(){
    return this.popoverStartDate && (this.popoverEndDate || this.popoverIsIndeterminate);
  }

  outputDates(){
    this.startDate = this.popoverStartDate;
    this.endDate = this.popoverEndDate;
    this.isIndeterminate = this.popoverIsIndeterminate;
    this.valid = this.selectionIsValid();
    this.display = `${this.getStartDateText()} -> ${this.getEndDateText()}`;
  }

}