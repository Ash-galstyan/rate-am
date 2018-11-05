import { Routes } from '@angular/router';
import { BanksComponent } from './pages/banks/banks.component';
import { ExchangePointsComponent } from './pages/exchange-points/exchange-points.component';
import { CreditOrganizationsComponent } from './pages/credit-organizations/credit-organizations.component';
import { InvestmentOrganizationsComponent } from './pages/investment-organizations/investment-organizations.component';
import { CentralBankComponent } from './pages/central-bank/central-bank.component';
import { InternationalRatesComponent } from './pages/international-rates/international-rates.component';

export const routes: Routes = [
  {path: '', redirectTo: '/banks', pathMatch: 'full'},
  {
    path: 'banks',
    component: BanksComponent
  },
  {
    path: 'exchange-points',
    component: ExchangePointsComponent
  },
  {
    path: 'credit-organizations',
    component: CreditOrganizationsComponent
  },
  {
    path: 'investment-organizations',
    component: InvestmentOrganizationsComponent
  },
  {
    path: 'central-bank',
    component: CentralBankComponent
  },
  {
    path: 'international-rates',
    component: InternationalRatesComponent
  }
]
