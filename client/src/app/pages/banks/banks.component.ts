import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banks',
  template:`
    <app-rate-table [api]="'bankRates'" [averageRatesApi]="'bankAverageRates'"></app-rate-table>
    
  `
})
export class BanksComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
