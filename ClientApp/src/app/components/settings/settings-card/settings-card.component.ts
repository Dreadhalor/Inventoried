import { KeyValuePair } from '../../../models/keyValuePair';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Globals } from '../../../globals';

@Component({
  selector: 'settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss']
})
export class SettingsCardComponent implements OnInit {

  @ViewChild('entry') entry: ElementRef;
  @ViewChild('check') check: ElementRef;
  placeholders: any[] = [];
  editing_entries = false;
  adding_entry = false;
  entry_to_add = '';

  _entries;
  get entries(){
    return this._entries;
  }
  @Input() set entries(val){
    this._entries = val;
    this.resetPlaceholders();
  };

  @Input() title;

  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() edits = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  getEntry(uuid){
    for (let i = 0; i < this.entries.length; i++){
      if (this.entries[i].uuid == uuid) return this.entries[i];
    }
    return null;
  }

  resetPlaceholders(){
    this.placeholders = Globals.deepCopy(this.entries);
  }

  newEntryKeydown(event){
    if (event.key === "Enter") {
      this.entry.nativeElement.blur();
      this.check.nativeElement.click();
      setTimeout(() => {this.addingEntryButtonClicked()},50);
    }
  }
  editEntryButtonClicked(){
    this.editing_entries = true;
  }
  cancelEditEntryButtonClicked(){
    this.resetEntryEditing();
  }
  saveEditEntryButtonClicked(){
    this.edits.emit(this.placeholders);
    this.resetEntryEditing();
  }
  addingEntryButtonClicked(){
    this.adding_entry = true;
    setTimeout(() => {this.entry.nativeElement.focus()},0);
  }
  cancelAddingEntryButtonClicked(){
    this.adding_entry = false;
  }
  addEntryConfirmButtonClicked(){
    /*let entry = new KeyValuePair(){
      id: undefined,
      value: this.entry_to_add
    });
    this.add.emit(entry);*/
    this.resetAddEntry();
    this.addingEntryButtonClicked();
  }
  deleteEntryButtonClicked(uuid){
    this.delete.emit(uuid);
  }
  resetEntryEditing(){
    this.editing_entries = false;
    this.resetAddEntry();
  }
  resetAddEntry(){
    this.adding_entry = false;
    this.entry_to_add = '';
  }

  isReadonly(entry){
    return entry.uuid == '0' || entry.uuid == '1';
  }

}
