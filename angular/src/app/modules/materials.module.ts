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
  MatMenuModule,
  MatPaginatorModule
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
    MatMenuModule,
  MatPaginatorModule

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
    MatMenuModule,
    MatPaginatorModule
  ]
})
export class MaterialsModule { }
