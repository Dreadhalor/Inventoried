import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app/app.component';

import { AddAssetComponent } from './components/modals/add-asset/add-asset.component';
import { BrowseAssetsComponent } from './components/browse-assets/browse-assets.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { SettingsCardComponent } from './components/settings/settings-card/settings-card.component';
import { EditDurableComponent } from './components/modals/edit-durable/edit-durable.component';

import { MaterialsModule } from './modules/materials.module';

import { InfoService } from './services/info/info.service';
import { BrowseDurablesComponent } from './components/browse-assets/browse-durables/browse-durables.component';
import { BrowseConsumablesComponent } from './components/browse-assets/browse-consumables/browse-consumables.component';
import { AddDurableComponent } from './components/modals/add-asset/add-durable/add-durable.component';
import { AddConsumableComponent } from './components/modals/add-asset/add-consumable/add-consumable.component';
import { TagFieldComponent } from './components/utilities/tag-field/tag-field.component';
import { CheckoutComponent } from './components/modals/checkout/checkout.component';
import { DurableSelectComponent } from './components/utilities/durable-select/durable-select.component';
import { RangeDatepickerComponent } from './components/utilities/range-datepicker/range-datepicker.component';
import { InputTextComponent } from './components/utilities/input-text/input-text.component';
import { UserSelectComponent } from './components/utilities/user-select/user-select.component';
import { MultipleInputTextComponent } from './components/utilities/multiple-input-text/multiple-input-text.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { CustomSelectComponent } from './components/utilities/custom-select/custom-select.component';
import { EditConsumableComponent } from './components/modals/edit-consumable/edit-consumable.component';
import { ConsumableSelectComponent } from './components/utilities/consumable-select/consumable-select.component';
import { AssetSelectComponent } from './components/utilities/asset-select/asset-select.component';
import { EditAssignmentComponent } from './components/modals/edit-assignment/edit-assignment.component';
import { ViewAssignmentsComponent } from './components/modals/view-assignments/view-assignments.component';
import { EditAssignmentContentComponent } from './components/modals/edit-assignment/edit-assignment-content/edit-assignment-content.component';
import { ButtonTightComponent } from './components/utilities/button-tight/button-tight.component';

import { ModalService } from './services/modal/modal.service';
import { AssignmentService } from './services/assignment/assignment.service';
import { ModalDeploymentService } from './services/modal-deployment/modal-deployment.service';

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
    EditAssignmentComponent,
    ViewAssignmentsComponent
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
    ConsumableSelectComponent,
    AssetSelectComponent,
    EditAssignmentComponent,
    ViewAssignmentsComponent,
    EditAssignmentContentComponent,
    ButtonTightComponent
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
    ModalDeploymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
