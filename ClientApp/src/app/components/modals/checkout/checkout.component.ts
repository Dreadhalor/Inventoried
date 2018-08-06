import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  pickedFromDate: NgbDateStruct;
  pickedToDate: NgbDateStruct;

  constructor(
    private assets: AssetService
  ) {}

  ngOnInit() {
  }

}
