import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './shared/material.module';
import { AppComponent } from './app.component';
import { BannerFormComponent } from './banner-form/banner-form.component';
import { BannerListComponent } from './banner-list/banner-list.component';
import { HttpClientModule } from '@angular/common/http';
import { EventBlockerDirective } from './shared/directives/event-blocker.directive';

import { DialogDeleteComponent } from './shared/alert/dialog-delete.component';

import { bannerReducer } from './store/banner.reducers';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    BannerFormComponent,
    BannerListComponent,
    EventBlockerDirective,
    DialogDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    StoreModule.forFeature('banners', bannerReducer),
    // EffectsModule.forRoot([]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
