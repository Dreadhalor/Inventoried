import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from 'src/app/components/app/app.component';

import { AddAssetComponent } from 'src/app/components/modals/add-asset/add-asset.component';
import { BrowseAssetsComponent } from 'src/app/components/browse-assets/browse-assets.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { DirectoryComponent } from 'src/app/components/directory/directory.component';
import { SettingsCardComponent } from 'src/app/components/settings/settings-card/settings-card.component';
import { EditDurableComponent } from 'src/app/components/modals/edit-durable/edit-durable.component';

import { MaterialsModule } from 'src/app/modules/materials.module';

import { InfoService } from 'src/app/services/info/info.service';
import { BrowseDurablesComponent } from 'src/app/components/browse-assets/browse-durables/browse-durables.component';
import { AssignmentService } from 'src/app/services/assignment/assignment.service';
import { BrowseConsumablesComponent } from 'src/app/components/browse-assets/browse-consumables/browse-consumables.component';
import { AddDurableComponent } from 'src/app/components/modals/add-asset/add-durable/add-durable.component';
import { AddConsumableComponent } from 'src/app/components/modals/add-asset/add-consumable/add-consumable.component';
import { TagFieldComponent } from 'src/app/components/utilities/tag-field/tag-field.component';
import { CheckoutComponent } from 'src/app/components/modals/checkout/checkout.component';
import { DurableSelectComponent } from 'src/app/components/utilities/durable-select/durable-select.component';
import { RangeDatepickerComponent } from 'src/app/components/utilities/range-datepicker/range-datepicker.component';
import { InputTextComponent } from 'src/app/components/utilities/input-text/input-text.component';
import { UserSelectComponent } from 'src/app/components/utilities/user-select/user-select.component';
import { MultipleInputTextComponent } from 'src/app/components/utilities/multiple-input-text/multiple-input-text.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { CustomSelectComponent } from 'src/app/components/utilities/custom-select/custom-select.component';
import { EditConsumableComponent } from 'src/app/components/modals/edit-consumable/edit-consumable.component';
import { ConsumableSelectComponent } from 'src/app/components/utilities/consumable-select/consumable-select.component';


var routes: Routes = [
  { path: 'browse-assets', component: BrowseAssetsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'directory', component: DirectoryComponent },
  { path: '**', redirectTo: 'browse-assets', pathMatch: 'full' }
]

@NgModule({
  entryComponents: [
    AppComponent,
    AddAssetComponent,
    EditDurableComponent,
    CheckoutComponent,
    EditConsumableComponent,
  ],
  declarations: [
    AppComponent,
    AddAssetComponent,
    BrowseAssetsComponent,
    NavbarComponent,
    SettingsComponent,
    DirectoryComponent,
    SettingsCardComponent,
    EditDurableComponent,
    BrowseDurablesComponent,
    BrowseConsumablesComponent,
    AddDurableComponent,
    AddConsumableComponent,
    TagFieldComponent,
    CheckoutComponent,
    DurableSelectComponent,
    RangeDatepickerComponent,
    InputTextComponent,
    UserSelectComponent,
    MultipleInputTextComponent,
    CustomSelectComponent,
    EditConsumableComponent,
    ConsumableSelectComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialsModule, //Angular Material modules,
    NgSelectModule
  ],
  providers: [
    InfoService,
    AssignmentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
