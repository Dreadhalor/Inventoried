import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../../../services/info/info.service';
import { Consumable } from '../../../../models/classes/consumable';

@Component({
  selector: 'add-consumable',
  templateUrl: './add-consumable.component.html',
  styleUrls: ['./add-consumable.component.scss']
})
export class AddConsumableComponent implements OnInit {

  label: string = "";
  quantity: number = 0;
  categoryId: string = '0';
  manufacturerId: string = '0';
  notes: string = "";
  tagIds: string[] = [];

  constructor(
    private is: InfoService
  ) { }

  ngOnInit() {
  }

  makeConsumable(){
    return new Consumable({
      id: undefined,
      label: this.label,
      quantity: this.quantity,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentIds: undefined,
      tagIds: this.tagIds
    });
  }

}
