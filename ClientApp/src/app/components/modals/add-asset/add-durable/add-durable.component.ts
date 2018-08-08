import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Durable } from '../../../../models/durable';
import { InfoService } from '../../../../services/info/info.service';
import { NgSelectComponent } from '../../../../../../node_modules/@ng-select/ng-select';

@Component({
  selector: 'add-durable',
  templateUrl: './add-durable.component.html',
  styleUrls: ['./add-durable.component.scss']
})
export class AddDurableComponent implements OnInit {

  serialNumber: string = "";
  categoryId: number;
  manufacturerId: number;
  notes: string = "";
  tagIds: any[] = [];
  active: boolean = true;

  constructor(
    private is: InfoService
  ) { }

  ngOnInit() {
  }

  makeDurable(){
    return new Durable(
      undefined,
      this.serialNumber,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tagIds,
      this.active
    );
  }

}