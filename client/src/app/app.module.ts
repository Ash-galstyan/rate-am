import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { BanksComponent } from './banks/banks.component';
import { ExchangePointsComponent } from './exchange-points/exchange-points.component';
import { CreditOrganizationsComponent } from './credit-organizations/credit-organizations.component';
import { InvestmentOrganizationsComponent } from './investment-organizations/investment-organizations.component';
import { CentralBankComponent } from './central-bank/central-bank.component';
import { InternationalRatesComponent } from './international-rates/international-rates.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {
  MatTabsModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MomentModule } from 'ngx-moment';
import { TableHeaderComponent } from './table-header/table-header.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BanksComponent,
    ExchangePointsComponent,
    CreditOrganizationsComponent,
    InvestmentOrganizationsComponent,
    CentralBankComponent,
    InternationalRatesComponent,
    ErrorPageComponent,
    NavigationMenuComponent,
    TableHeaderComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatTableModule,
    MomentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
