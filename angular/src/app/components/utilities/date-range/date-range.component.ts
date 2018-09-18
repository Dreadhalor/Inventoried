import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {

  leftMonth: moment.Moment = moment();
  rightMonth: moment.Moment = moment();

  startDate = null;
  endDate = null;
  mouseoverDate = null;

  constructor() { }

  ngOnInit() {
  }

  setEndAhead(months){
    this.endDate = this.startDate.clone().add(months, 'months');
  }

  rangeLength(){
    if (this.startDate){
      if (this.endDate) return this.endDate.diff(this.startDate, 'days');
      else if (this.mouseoverDate) return this.mouseoverDate.diff(this.startDate, 'days');
    }
    return null;
  }
  rangeLengthText(){
    let range = this.rangeLength();
    if (range){
      if (range > 1) return `${range} days`;
      return `${range} day`;
    };
    return '';
  }

  getStartDateText(){
    if (this.startDate){
      return this.startDate.format('MMM Do YYYY');
    }
    return '-';
  }
  getEndDateText(){
    if (this.endDate){
      return this.endDate.format('MMM Do YYYY');
    }
    return '-';
  }

}
