import { Component, OnInit } from '@angular/core';
import { KeyValuePair } from '../../../../models/keyValuePair';
import { InfoService } from '../../../../services/info/info.service';
import { Consumable } from '../../../../models/consumable';

@Component({
  selector: 'add-consumable',
  templateUrl: './add-consumable.component.html',
  styleUrls: ['./add-consumable.component.scss']
})
export class AddConsumableComponent implements OnInit {

  label: string = "";
  quantity: number = 0;
  categoryId: number = 0;
  manufacturerId: number = 0;
  notes: string = "";
  tagIds: any[] = [];

  constructor(
    private is: InfoService
  ) { }

  ngOnInit() {
  }

  makeConsumable(){
    return new Consumable(
      undefined,
      this.label,
      this.quantity,
      this.categoryId,
      this.manufacturerId,
      this.notes,
      undefined,
      this.tagIds
    );
  }

}
