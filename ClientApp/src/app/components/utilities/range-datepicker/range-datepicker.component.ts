import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
  ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
  ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'range-datepicker',
  templateUrl: './range-datepicker.component.html',
  styleUrls: ['./range-datepicker.component.scss']
})
export class RangeDatepickerComponent implements OnInit {

  constructor(
    calendar: NgbCalendar
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  hoveredDate: NgbDateStruct;

  private _toDate: NgbDateStruct;
  
  @Input() get toDate(): NgbDateStruct { return this._toDate; };
  set toDate(val: NgbDateStruct){
    this._toDate = val;
    this.toDateChange.emit(val);
  }
  @Output() toDateChange: EventEmitter<NgbDateStruct> = new EventEmitter<NgbDateStruct>();

  private _fromDate: NgbDateStruct;
  @Input() get fromDate(): NgbDateStruct { return this._fromDate; };
  set fromDate(val: NgbDateStruct){
    this._fromDate = val;
    this.fromDateChange.emit(val);
  }
  @Output() fromDateChange: EventEmitter<NgbDateStruct> = new EventEmitter<NgbDateStruct>();

  ngOnInit() {
  }
  
  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

}
