import { AssignmentService } from '../../services/assignment/assignment.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Globals } from '../../globals';
import { Durable } from '../../models/classes/durable';
import { MatDialog } from '@angular/material';
import { AssetService } from '../../services/asset/asset.service';
import { EditDurableComponent } from '../modals/edit-durable/edit-durable.component';

@Component({
  selector: 'directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  constructor(
    private us: UserService,
    private assets: AssetService,
    private assignments: AssignmentService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openEditDurable(durable: Durable){
    let options = Globals.dialogConfig;
    Object.assign(options,{data: durable});
    const dialogRef = this.dialog.open(EditDurableComponent, options);
  }

}
