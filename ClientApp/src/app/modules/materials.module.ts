import { NgModule } from '../../../node_modules/@angular/core';
import {
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatTabsModule
} from '@angular/material';


@NgModule({
  imports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule
  ]
})
export class MaterialsModule { }