import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IModalDeployment } from "../models/interfaces/IModalDeployment";
import { ICheckoutData } from "../models/interfaces/ICheckoutData";

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
  openViewUser(data){
    let params: IModalDeployment = {
      modalName: 'viewUser',
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
