import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatNativeDateModule,
  MatFormFieldModule,
  MatSelectModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';

import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HeaderComponent } from './components/table-header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataSearchComponent } from './data-search/data-search.component';
import { RateTableComponent } from './components/rate-table/rate-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule,
    FlexLayoutModule
  ],
  declarations: [
    ErrorPageComponent,
    HeaderComponent,
    NavigationMenuComponent,
    DataSearchComponent,
    RateTableComponent
  ],
  exports: [
    CommonModule,
    ErrorPageComponent,
    HeaderComponent,
    NavigationMenuComponent,
    RateTableComponent
  ]
})

export class CoreModule {}
