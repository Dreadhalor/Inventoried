import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
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
import { EditDurableComponent } from './components/modals/edit-durable/edit-durable';

import { MaterialsModule } from './modules/materials.module';

import { InfoService } from './services/info/info.service';
import { BrowseDurablesComponent } from './components/browse-assets/browse-durables/browse-durables.component';
import { BrowseConsumablesComponent } from './components/browse-assets/browse-consumables/browse-consumables.component';
import { AddDurableComponent } from './components/modals/add-asset/add-durable/add-durable.component';
import { AddConsumableComponent } from './components/modals/add-asset/add-consumable/add-consumable.component';
import { TagFieldComponent } from './components/utilities/tag-field/tag-field.component';

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
    EditDurableComponent
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
    TagFieldComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialsModule //Angular Material modules,
  ],
  providers: [
    InfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
