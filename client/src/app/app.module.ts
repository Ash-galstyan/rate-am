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
import { AppRoutingModule } from './/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    BanksComponent,
    ExchangePointsComponent,
    CreditOrganizationsComponent,
    InvestmentOrganizationsComponent,
    CentralBankComponent,
    InternationalRatesComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
