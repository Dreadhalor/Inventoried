import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { KeyValuePair } from '../../../models/keyValuePair';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocompleteTrigger, MatAutocomplete } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'tag-field',
  templateUrl: './tag-field.component.html',
  styleUrls: ['./tag-field.component.scss']
})
export class TagFieldComponent implements OnInit {

  constructor() { }

  @Input() dictionary: KeyValuePair[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('itemInput') itemInput: ElementRef;
  @ViewChild('auto', { read: MatAutocomplete }) auto: MatAutocomplete;
  @ViewChild('itemInput', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  
  @Input() itemIds: any[] = [];
  @Output() itemIdsChange:EventEmitter<any[]> = new EventEmitter<any[]>();
  get items(){
    let result: KeyValuePair[] = [];
    if (this.itemIds){
      for (let i = this.itemIds.length; i >= 0; i--){
        let item = this.dictionary.find(match => match.id == this.itemIds[i]);
        if (item){
          result.unshift(item);
        } else this.itemIds.splice(i,1);
      }
    } else this.itemIds = [];
    return result;
  }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const inputField = event.input;
    const value = event.value.trim();

    let possibleItems: KeyValuePair[] = this.filterDupes(this.dictionary);
    let item = possibleItems.find(match => match.value == value);
    if (item) this.itemIds.push(item.id);

    // If successful, reset the input value
    if (inputField && item) {
      inputField.value = '';
      this.hideAutoComplete();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.itemIds.push(event.option.value);
    this.itemInput.nativeElement.value = '';
  }

  remove(item): void {
    const index = this.itemIds.indexOf(item.id);

    if (index >= 0) {
      this.itemIds.splice(index, 1);
    }
  }

  filterDupes(dictionary: KeyValuePair[]){
    return dictionary.filter(
      pair => !this.itemIds.find(match => match == pair.id)
    );
  }
  filterNonMatches(dictionary: KeyValuePair[], filter: string){
    let lowercase = filter.toLowerCase();
    return dictionary.filter(pair => pair.value.toLowerCase().includes(lowercase));
  }
  showAutoComplete(){
    this.trigger.openPanel();
  }
  hideAutoComplete(){
    this.trigger.closePanel();
  }

}
