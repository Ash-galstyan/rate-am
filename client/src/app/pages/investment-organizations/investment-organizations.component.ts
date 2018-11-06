import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-organizations',
  template: `
    <app-rate-table [api]="'investmentOrganizationsRates'"></app-rate-table>
  `
})
export class InvestmentOrganizationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
