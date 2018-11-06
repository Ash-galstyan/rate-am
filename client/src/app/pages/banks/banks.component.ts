import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banks',
  template:`
    <app-rate-table [api]="'http://54.86.92.122/api/bankRates'"></app-rate-table>
  `,
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
