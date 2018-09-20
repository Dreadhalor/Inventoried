import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { SyntheticsModule } from '@dreadhalor/synthetics';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

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

import { EditConsumableComponent } from './components/modals/edit-consumable/edit-consumable.component';
import { ConsumableSelectComponent } from './components/utilities/consumable-select/consumable-select.component';
import { AssetSelectComponent } from './components/utilities/asset-select/asset-select.component';
import { EditAssignmentComponent } from './components/modals/edit-assignment/edit-assignment.component';
import { ViewAssignmentsComponent } from './components/modals/view-assignments/view-assignments.component';
import { EditAssignmentContentComponent } from './components/modals/edit-assignment/edit-assignment-content/edit-assignment-content.component';
import { ButtonTightComponent } from './components/utilities/button-tight/button-tight.component';
import { LoginComponent } from './components/login/login.component';
import { HistoryComponent } from './components/history/history.component';
import { HistoryPanelComponent } from './components/history/history-panel/history-panel.component';
import { DateRangeComponent } from './components/utilities/date-range/date-range.component';
import { CalendarComponent } from './components/utilities/date-range/calendar/calendar.component';
import { HttpService } from './services/http.service';

let routes: Routes = [
  { path: 'browse-assets', component: BrowseAssetsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'directory', component: DirectoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: 'browse-assets', pathMatch: 'full' }
]

function tokenGetter(){
  let token = localStorage.getItem('authorization');
  if (token) return token;
  return '';
}

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
    EditConsumableComponent,
    ConsumableSelectComponent,
    AssetSelectComponent,
    EditAssignmentComponent,
    ViewAssignmentsComponent,
    EditAssignmentContentComponent,
    ButtonTightComponent,
    LoginComponent,
    HistoryComponent,
    HistoryPanelComponent,
    DateRangeComponent,
    CalendarComponent
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
    VirtualScrollModule,
    SyntheticsModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: [
          'localhost:5000/users/authenticate'
        ],
        authScheme: ''
      }
    })
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpService,
        multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
