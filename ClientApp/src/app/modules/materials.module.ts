import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatTabsModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatListModule,
  MatTooltipModule
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
    MatAutocompleteModule,
    MatListModule,
    MatTooltipModule
  ],
  exports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatListModule,
    MatTooltipModule
  ]
})
export class MaterialsModule { }
