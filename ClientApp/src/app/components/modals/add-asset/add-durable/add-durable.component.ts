import { Component, OnInit } from '@angular/core';
import { Durable } from 'src/app/models/durable';
import { InfoService } from 'src/app/services/info/info.service';
import { Globals } from 'src/app/globals';

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
    private is: InfoService
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