import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banks',
  template:`
    <app-rate-table></app-rate-table>
  `,
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
