import { KeyValuePair } from 'src/app/models/keyValuePair';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss']
})
export class SettingsCardComponent implements OnInit {

  @ViewChild('entry') entry: ElementRef;
  @ViewChild('check') check: ElementRef;
  editing_entries = false;
  adding_entry = false;
  entry_to_add = '';

  _entries: KeyValuePair[];
  get entries(){
    return this._entries;
  }
  @Input() set entries(val){
    this._entries = val;
    this.resetChanges();
  };
  placeholders: KeyValuePair[] = [];

  @Input() title;
  @Output() edits = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  getEntry(id){
    for (let i = 0; i < this.entries.length; i++){
      if (this.entries[i].id == id) return this.entries[i];
    }
    return null;
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
    this.resetChanges();
  }
  cancelEditEntryButtonClicked(){
    this.resetEntryEditing();
  }
  saveEditEntryButtonClicked(){
    if (this.entry_to_add) this.addEntry(this.entry_to_add);
    this.entry_to_add = '';
    this.edits.emit(this.placeholders);
    this.resetEntryEditing();
  }
  addingEntryButtonClicked(){
    this.adding_entry = true;
    setTimeout(() => {this.entry.nativeElement.focus()},0);
  }
  cancelAddingEntryButtonClicked(){
    this.resetAddEntry();
  }
  addEntryConfirmButtonClicked(){
    this.addEntry(this.entry_to_add);
    this.resetAddEntry();
    this.addingEntryButtonClicked();
  }
  deleteEntryButtonClicked(id){
    this.deleteEntry(id);
  }
  resetEntryEditing(){
    this.editing_entries = false;
    this.resetAddEntry();
  }
  resetAddEntry(){
    this.adding_entry = false;
    this.entry_to_add = '';
  }

  getPlaceholder(id){
    let placeholder = this.getEntry(id);
    return (placeholder) ? placeholder.value : '';
  }
  isModifiedOrNew(id){
    let placeholder = this.getEntry(id);
    if (placeholder){
      let val = this.placeholders.find(match => match.id == id);
      if (val){
        if (placeholder.value == val.value) return false;
      }
    }
    return true;
  }
  addEntry(entry: string){
    let newEntry = new KeyValuePair(undefined, entry);
    this.placeholders.push(newEntry);
  }
  deleteEntry(id){
    let index = this.placeholders.findIndex(match => match.id == id);
    if (index >= 0) this.placeholders.splice(index,1);
  }

  resetChanges(){
    this.placeholders = this.entries.map(entry => entry.copy());
  }

}