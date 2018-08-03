import { Component, OnInit } from '@angular/core';
import { IAutoCompleteModel } from '../../../../models/IAutoCompleteModel';
import { Durable } from '../../../../models/durable';
import { KeyValuePair } from '../../../../models/keyValuePair';
import { InfoService } from '../../../../services/info/info.service';

@Component({
  selector: 'add-durable',
  templateUrl: './add-durable.component.html',
  styleUrls: ['./add-durable.component.scss']
})
export class AddDurableComponent implements OnInit {

  serialNumber: string = "";
  categoryId: number = 0;
  manufacturerId: number = 0;
  notes: string = "";
  tags: IAutoCompleteModel[] = [];
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
      this.tags.map(tag => KeyValuePair.ACMToKVP(tag)),
      this.active
    );
  }

}
