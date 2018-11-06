import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-organizations',
  template: `
    <app-rate-table [api]="'creditOrganizationsRates'"></app-rate-table>
  `,
  styleUrls: ['./credit-organizations.component.scss']
})

export class CreditOrganizationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
