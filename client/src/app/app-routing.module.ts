import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanksComponent } from './banks/banks.component';
import { CentralBankComponent } from './central-bank/central-bank.component';
import { CreditOrganizationsComponent } from './credit-organizations/credit-organizations.component';
import { ExchangePointsComponent } from './exchange-points/exchange-points.component';
import { InternationalRatesComponent } from './international-rates/international-rates.component';
import { InvestmentOrganizationsComponent } from './investment-organizations/investment-organizations.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const appRoutes: Routes = [
  {path: 'banks', component: BanksComponent},
  {path: 'central-bank', component: CentralBankComponent},
  {
    path: 'credit-organizations',
    component: CreditOrganizationsComponent,
    data: {title: 'Heroes List'}
  },
  {
    path: 'exchange-points',
    component: ExchangePointsComponent,
    data: {title: 'Heroes List'}
  },
  {
    path: 'international-rates',
    component: InternationalRatesComponent,
    data: {title: 'Heroes List'}
  },
  {
    path: 'investment-organizations',
    component: InvestmentOrganizationsComponent,
    data: {title: 'Heroes List'}
  },
  {
    path: '',
    redirectTo: '/bank',
    pathMatch: 'full'
  },
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
