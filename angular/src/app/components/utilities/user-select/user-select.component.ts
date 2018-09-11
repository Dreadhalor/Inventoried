import { AssignmentService } from '../../../services/assignment.service';
import { UserService } from '../../../services/user.service';
import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  panelWidth = '275px';

  filteredDictionary = [];

  _userId;
  @Input() get userId(){ return this._userId; }
  @Output() userIdChange = new EventEmitter<any>();
  set userId(val){
    this._userId = val;
    this.userIdChange.emit(val);
  }

  textfield = '';

  get user(){
    return this.us.getUser(this.userId);
  }

  constructor(
    private us: UserService,
    private assignments: AssignmentService
  ) {
  }

  ngOnInit() {
    this.filter();
  }

  getPopoverContent(){
    if (this.userId) return this.popoverContent;
    return null;
  }

  filter(){
    this.filteredDictionary = [];
    if (this.textfield) this.us.users.forEach(user => {if (user.name.includes(this.textfield)) this.filteredDictionary.push(user)});
    else this.filteredDictionary = this.us.users;
  }

}
