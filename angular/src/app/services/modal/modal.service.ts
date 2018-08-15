import { Injectable } from '@angular/core';
import { ICheckoutData } from '../../models/interfaces/ICheckoutData';
import { Subject } from '../../../../node_modules/rxjs';
import { IModalDeployment } from '../../models/interfaces/IModalDeployment';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  openModal = new Subject<IModalDeployment>();

  constructor(){}

  openEditDurable(data: any){
    let params: IModalDeployment = {
      modalName: 'editDurable',
      data: data
    };
    this.openModal.next(params);
  }
  openEditConsumable(data: any){
    let params: IModalDeployment = {
      modalName: 'editConsumable',
      data: data
    };
    this.openModal.next(params);
  }
  openCheckout(data: ICheckoutData){
    let params: IModalDeployment = {
      modalName: 'checkout',
      data: data
    };
    this.openModal.next(params);
  }
  openEditAssignment(data){
    let params: IModalDeployment = {
      modalName: 'editAssignment',
      data: data
    };
    this.openModal.next(params);
  }
  openViewAssignments(data){
    let params: IModalDeployment = {
      modalName: 'viewAssignments',
      data: data
    };
    this.openModal.next(params);
  }
  openAddAsset(){
    let params: IModalDeployment = {
      modalName: 'addAsset',
      data: null
    };
    this.openModal.next(params);
  }

}
