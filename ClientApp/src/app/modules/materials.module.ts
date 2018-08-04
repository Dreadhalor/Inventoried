import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatTabsModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  exports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule
  ]
})
export class MaterialsModule { }
