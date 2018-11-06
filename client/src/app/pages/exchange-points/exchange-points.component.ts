import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exchange-points',
  template: `
    <app-rate-table [api]="'exchangesPointsRates'"></app-rate-table>
  `
})
export class ExchangePointsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
