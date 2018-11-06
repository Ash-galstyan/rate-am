import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-organizations',
  template: `
    <app-rate-table [api]="'investmentOrganizationsRates'"></app-rate-table>
  `,
  styleUrls: ['./investment-organizations.component.scss']
})
export class InvestmentOrganizationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
