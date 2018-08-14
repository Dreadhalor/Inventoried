import { Injectable } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { ModalService } from '../modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  public viewAsset = new Subject<string>();

  public modals;

  constructor(
    private ms: ModalService
  ) {}
}
