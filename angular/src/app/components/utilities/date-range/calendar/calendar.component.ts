import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'syn-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() isIndeterminate: boolean;

  _startDate = null;
  @Input() get startDate(){return this._startDate;}
  @Output() startDateChange = new EventEmitter<moment.Moment>();
  set startDate(v){
    this._startDate = v;
    this.startDateChange.emit(v);
  }
  _endDate = null;
  @Input() get endDate(){return this._endDate;}
  @Output() endDateChange = new EventEmitter<moment.Moment>();
  set endDate(v){
    this._endDate = v;
    this.endDateChange.emit(v);
  }
  _mouseoverDate = null;
  @Input() get mouseoverDate(){return this._mouseoverDate;}
  @Output() mouseoverDateChange = new EventEmitter<moment.Moment>();
  set mouseoverDate(v){
    this._mouseoverDate = v;
    this.mouseoverDateChange.emit(v);
  }

  weekLength = new Array(7);
  get weeks(){return new Array(this.daysDisplayed/7);}

  month: moment.Moment = moment();
  firstDay;
  lastDay;
  beforeFirstBuffer;
  afterLastBuffer;
  daysInMonth;
  daysDisplayed;

  prevMonth;
  prevMonthDays;

  nextMonth;
  nextMonthDays;

  constructor() { }

  ngOnInit() {
    this.setMonthData();
  }

  advanceMonth(){
    this.month.add(1,'month');
    this.setMonthData();
  }
  backtrackMonth(){
    this.month.subtract(1,'month');
    this.setMonthData();
  }
  setMonthData(){
    this.firstDay = this.month.clone().startOf('month');
    this.lastDay = this.month.clone().endOf('month');
    this.beforeFirstBuffer = this.firstDay.day();
    this.afterLastBuffer = 6 - this.lastDay.day();
    this.daysInMonth = this.month.daysInMonth();
    this.daysDisplayed = this.month.daysInMonth() + this.beforeFirstBuffer + this.afterLastBuffer;

    this.prevMonth = this.month.clone().subtract(1,'month');
    this.prevMonthDays = this.prevMonth.clone().daysInMonth();

    this.nextMonth = this.month.clone().add(1,'month');
    this.nextMonthDays = this.nextMonth.clone().daysInMonth();
  }

  getDate(week, day){
    let result = week*7 + day - this.beforeFirstBuffer;
    return this.firstDay.clone().add(result,'days');
  }
  dateClicked(week, day){
    let date = this.getDate(week, day);
    if (!this.isIndeterminate){
      if (this.endDate){
        this.startDate = date;
        this.endDate = null;
      }
      else if (this.startDate){
        if (date.isBefore(this.startDate)) this.startDate = date;
        else this.endDate = date;
      }
      else this.startDate = date;
    } else this.startDate = date;
  }
  hovering(week, day){
    this.mouseoverDate = this.getDate(week, day);
  }

  dayLabel(week, day){
    let result = week*7 + day - this.beforeFirstBuffer + 1;
    if (result <= 0){
      return this.prevMonthDays + result;
    } else if (result > this.daysInMonth){
      return result - this.daysInMonth;
    }
    return result;
  }
  dayClass(week, day){
    return `date-panel ${this.monthClass(week, day).trim()} ${this.dateBorderClass(week, day).trim()} ${this.dateBackgroundClass(week, day).trim()}`;
  }
  monthClass(week, day){
    let result = week*7 + day - this.beforeFirstBuffer + 1;
    if (result <= 0){
      return 'previousDay'
    } else if (result > this.daysInMonth){
      return 'nextDay'
    }
    return 'currentDay';
  }
  inRange(date){
    if (!this.isIndeterminate){
      let definedRange = this.startDate && this.endDate;
      let startToEnd = date.isBetween(this.startDate, this.endDate, 'day', '[]');
      let startToHover = this.startDate && this.mouseoverDate && date.isBetween(this.startDate, this.mouseoverDate, 'day', '[]');
      if (definedRange) return startToEnd;
      else return startToHover;
    } return false;
  }
  dateBorderClass(week, day){
    let date = this.getDate(week, day);
    if (this.startDate && date.isSame(this.startDate, 'day')){
      if (this.isIndeterminate) return 'default-border';
      return 'start-border';
    } 
    else if (this.endDate && date.isSame(this.endDate, 'day')) return 'end-border';
    else if (this.inRange(date)) return 'in-range-border';
    else return 'default-border';
  }
  dateBackgroundClass(week, day){
    let date = this.getDate(week, day);
    if ((this.startDate && date.isSame(this.startDate, 'day')) || (this.endDate && date.isSame(this.endDate, 'day'))) return 'selected-bg'
    else if (this.mouseoverDate && date.isSame(this.mouseoverDate)) return 'mouseover-bg';
    else if (this.inRange(date)) return 'in-range-bg';
    else return 'default-bg';
  }
}