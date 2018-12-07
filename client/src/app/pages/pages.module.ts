import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table'

import { ExchangePointsComponent } from './exchange-points/exchange-points.component';
import { CreditOrganizationsComponent } from './credit-organizations/credit-organizations.component';
import { InvestmentOrganizationsComponent } from './investment-organizations/investment-organizations.component';
import { CentralBankComponent } from './central-bank/central-bank.component';
import { InternationalRatesComponent } from './international-rates/international-rates.component';
import { BanksComponent } from './banks/banks.component';
import { CoreModule } from '../core/core.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBHAuZ0l64uUnEtbuG1uedU7lpkaE6QHqA'
    })
  ],
  declarations: [
    BanksComponent,
    ExchangePointsComponent,
    CreditOrganizationsComponent,
    InvestmentOrganizationsComponent,
    CentralBankComponent,
    InternationalRatesComponent
  ]
})
export class PagesModule { }
