import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Durable } from 'src/app/models/durable';
import { InfoService } from 'src/app/services/info/info.service';

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