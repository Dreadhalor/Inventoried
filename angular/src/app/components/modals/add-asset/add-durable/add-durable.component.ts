import { Component, OnInit } from '@angular/core';
import { Durable } from '../../../../models/classes/durable';
import { InfoService } from '../../../../services/info.service';
import { Globals } from '../../../../globals';

@Component({
  selector: 'add-durable',
  templateUrl: './add-durable.component.html',
  styleUrls: ['./add-durable.component.scss']
})
export class AddDurableComponent implements OnInit {

  serialNumbers: string[] = [];
  categoryId: string;
  manufacturerId: string;
  notes: string = "";
  tagIds: string[] = [];
  active: boolean = true;

  constructor(
    public is: InfoService
  ) { }

  ngOnInit() {
  }

  makeDurables(){
    let durables: Durable[] = [];
    let values = {
      id: undefined,
      categoryId: this.categoryId,
      manufacturerId: this.manufacturerId,
      notes: this.notes,
      assignmentId: undefined,
      tagIds: this.tagIds,
      active: this.active
    }
    this.serialNumbers.forEach(serialNumber => {
      let params = Globals.deepCopy(values);
      params.serialNumber = serialNumber;
      durables.push(new Durable(params));
    })
    return durables;
  }

}