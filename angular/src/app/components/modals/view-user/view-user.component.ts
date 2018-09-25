import { User } from './../../../models/classes/user';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  user: User;

  constructor(
    private us: UserService,
    private ms: ModalService,
    @Inject(MAT_DIALOG_DATA) private id: string
  ) {
    this.user = us.getUser(id);
  }

  ngOnInit() {
  }

  openManager(managerName){
    let manager = this.us.getUserByName(managerName);
    if (manager) this.ms.openViewUser(manager.id);
  }

}
