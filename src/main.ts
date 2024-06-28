import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

@NgModule({

  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ],
})
export class AppModule { }

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
