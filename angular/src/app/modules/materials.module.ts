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
  MatTableModule
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
    MatTableModule
  ]
})
export class MaterialsModule { }
