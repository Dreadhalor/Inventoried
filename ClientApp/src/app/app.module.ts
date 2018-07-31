import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AddAssetModalComponent } from './components/modals/add-asset-modal/add-asset-modal.component';
import { BrowseAssetsComponent } from './components/browse-assets/browse-assets.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { SettingsCardComponent } from './components/settings/settings-card/settings-card.component';

import { InfoService } from './services/info/info.service';

var routes: Routes = [
  { path: 'browse-assets', component: BrowseAssetsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'directory', component: DirectoryComponent },
  { path: '**', redirectTo: 'browse-assets', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    AddAssetModalComponent,
    BrowseAssetsComponent,
    NavbarComponent,
    SettingsComponent,
    DirectoryComponent,
    SettingsCardComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    InfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
