import { AssignmentService } from '../../../services/assignment.service';
import { UserService } from '../../../services/user.service';
import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { User } from '../../../models/classes/user';

@Component({
  selector: 'user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  @ViewChild('popoverContent') popoverContent: ElementRef;

  panelWidth = '275px';

  filteredDictionary = [];

  _userId = null;
  @Input() get userId(){ return this._userId; }
  @Output() userIdChange = new EventEmitter<any>();
  set userId(val){
    this._userId = val;
    this.userIdChange.emit(val);
  }

  _textfield = '';
  get textfield(){ return this._textfield; }
  get textfieldFormatted(){ return this.textfield.toLowerCase(); }
  set textfield(v: any){
    if (v instanceof User) v = v.name;
    this._textfield = v;
    if (this.us.getUserByName(v)) this.userId = v;
    else this.userId = null;
  }

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
    if (this.textfield) this.filteredDictionary = this.us.users.filter(user => user.name.toLowerCase().includes(this.textfieldFormatted));
    else this.filteredDictionary = this.us.users;
  }

}
