import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AddAssetModalComponent } from './components/modals/add-asset-modal/add-asset-modal.component';
import { BrowseAssetsComponent } from './components/browse-assets/browse-assets.component';

var routes: Routes = [
  { path: '', redirectTo: 'browse-assets', pathMatch: 'full' },
  { path: 'browse-assets', component: BrowseAssetsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AddAssetModalComponent,
    BrowseAssetsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
