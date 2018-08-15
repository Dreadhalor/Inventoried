import { Injectable } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { Globals } from '../../globals';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { EditDurableComponent } from '../../components/modals/edit-durable/edit-durable.component';
import { IModalDeployment } from '../../models/interfaces/IModalDeployment';
import { EditConsumableComponent } from '../../components/modals/edit-consumable/edit-consumable.component';
import { CheckoutComponent } from '../../components/modals/checkout/checkout.component';
import { ViewAssignmentsComponent } from '../../components/modals/view-assignments/view-assignments.component';
import { EditAssignmentComponent } from '../../components/modals/edit-assignment/edit-assignment.component';
import { AddAssetComponent } from '../../components/modals/add-asset/add-asset.component';

@Injectable({
  providedIn: 'root'
})
export class ModalDeploymentService {

  constructor(
    private ms: ModalService,
    private dialog: MatDialog
  ) {
    ms.openModal.asObservable().subscribe(
      (params: IModalDeployment) => {
        let modalName = params.modalName;
        switch (modalName){
          case 'addAsset':
            this.open(AddAssetComponent, null);
            break;
          case 'editDurable':
            this.open(EditDurableComponent,params.data);
            break;
          case 'editConsumable':
            this.open(EditConsumableComponent,params.data);
            break;
          case 'checkout':
            this.open(CheckoutComponent,params.data);
            break;
          case 'viewAssignments':
            this.open(ViewAssignmentsComponent,params.data);
            break;
          case 'editAssignment':
            this.open(EditAssignmentComponent,params.data);
            break;
        }
      }
    );
  }

  open(component, data){
    let options = Globals.dialogConfig;
    if (data) Object.assign(options, {data: data});
    this.dialog.open(component,options);
  }
  
}
