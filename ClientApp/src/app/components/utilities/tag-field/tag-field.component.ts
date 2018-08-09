import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { KeyValuePair } from 'src/app/models/keyValuePair';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocompleteTrigger, MatAutocomplete } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'tag-field',
  templateUrl: './tag-field.component.html',
  styleUrls: ['./tag-field.component.scss']
})
export class TagFieldComponent implements OnInit {

  constructor() { }

  @Input() dictionary: any[] = [];
  @Input() rowTitles: string[] = null;
  @Input() bindValue;
  @Input() bindLabel;
  @Input() placeholder = 'Tags';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('itemInput') itemInput: ElementRef;
  @ViewChild('auto', { read: MatAutocomplete }) auto: MatAutocomplete;
  @ViewChild('itemInput', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  
  _itemIds: any[] = [];
  @Input()
  get itemIds(): any[] {return this._itemIds}
  set itemIds(val){
    this._itemIds = val;
    this.itemIdsChange.emit(val);
  }
  @Output() itemIdsChange:EventEmitter<any[]> = new EventEmitter<any[]>();

  get items(){
    let result = [];
    if (this.itemIds){
      for (let i = this.itemIds.length; i >= 0; i--){
        let item;
        if (this.rowTitles){
          let found = false;
          for (let j = 0; j < this.rowTitles.length; j++){
            item = this.dictionary[j].find(match => match[this.bindValue] == this.itemIds[i]);
            if (item){
              result.unshift(item);
              found = true;
            }
          } if (!found) this.itemIds.splice(i,1);
        } else {
          item = this.dictionary.find(match => match[this.bindValue] == this.itemIds[i]);
          if (item){
            result.unshift(item);
          } else this.itemIds.splice(i,1);
        }
      }
    } else this.itemIds = [];
    return result;
  }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const inputField = event.input;
    const value = event[this.bindLabel].trim();

    let possibleItems: any[] = this.filterDupes(this.dictionary);
    let item = possibleItems.find(match => match[this.bindLabel] == value);
    if (item) this.itemIds.push(item[this.bindValue]);

    // If successful, reset the input value
    if (inputField && item) {
      inputField[this.bindLabel] = '';
      this.hideAutoComplete();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.itemIds.push(event.option.value);
    this.itemInput.nativeElement.value = '';
  }

  remove(item): void {
    const index = this.itemIds.indexOf(item[this.bindValue]);

    if (index >= 0) {
      this.itemIds.splice(index, 1);
    }
  }

  filterDupes(dictionary: any[]){
    return dictionary.filter(
      item => !this.itemIds.find(match => match == item[this.bindValue])
    );
  }
  filterNonMatches(dictionary: any[], filter: string){
    let lowercase = filter.toLowerCase();
    return dictionary.filter(item => item[this.bindLabel].toLowerCase().includes(lowercase));
  }
  showAutoComplete(){
    this.trigger.openPanel();
  }
  hideAutoComplete(){
    this.trigger.closePanel();
  }

}
