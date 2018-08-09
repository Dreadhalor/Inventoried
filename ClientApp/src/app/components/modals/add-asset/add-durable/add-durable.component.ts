import { Component, OnInit } from '@angular/core';
import { Durable } from 'src/app/models/durable';
import { InfoService } from 'src/app/services/info/info.service';

@Component({
  selector: 'add-durable',
  templateUrl: './add-durable.component.html',
  styleUrls: ['./add-durable.component.scss']
})
export class AddDurableComponent implements OnInit {

  serialNumber: string = "";
  categoryId: string;
  manufacturerId: string;
  notes: string = "";
  tagIds: string[] = [];
  active: boolean = true;

  constructor(
    private is: InfoService
  ) { }

  ngOnInit() {
  }

  makeDurable(){
    return new Durable({
      id: undefined,
      serialNumber: this.serialNumber,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentId: undefined,
      tagIds: this.tagIds,
      active: this.active
    });
  }

}