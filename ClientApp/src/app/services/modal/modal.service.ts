import { MatDialog } from '@angular/material';
import { SubjectService } from './../subject/subject.service';
import { Injectable } from '@angular/core';
import { EditConsumableComponent } from '../../components/modals/edit-consumable/edit-consumable.component';
import { Globals } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private dialog: MatDialog
  ) {
    /*sb.modals = this;
    console.log('ghfghf');
    sb.viewAsset.asObservable().subscribe((v) => {
      console.log('reaaa');
      let options = Globals.dialogConfig;
      let data = {id: v};
      Object.assign(options, {data: data});
      this.dialog.open(EditConsumableComponent, data);
    })*/
  }
}
