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
  MatTooltipModule,
  MatTableModule,
  MatMenuModule
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
    MatTooltipModule,
    MatTableModule,
    MatMenuModule
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
    MatTooltipModule,
    MatTableModule,
    MatMenuModule
  ]
})
export class MaterialsModule { }
