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

  _userId;
  @Input() get userId(){ return this._userId; }
  @Output() userIdChange = new EventEmitter<any>();
  set userId(val){
    this._userId = val;
    this.userIdChange.emit(val);
  }

  get user(){
    return this.us.getUser(this.userId);
  }

  constructor(
    private us: UserService,
    private assignments: AssignmentService
  ) { }

  ngOnInit() {
  }

  getPopoverContent(){
    if (this.userId) return this.popoverContent;
    return null;
  }

}
