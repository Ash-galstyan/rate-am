import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash'

@Component({
  selector: 'app-rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.scss']
})
export class RateTableComponent implements OnInit {
  @Input() api: string;

  date: any = Date.now();
  selectedOption: string = 'USD';
  SecondSelectedOption: string = 'EUR';
  thirdSelectedOption: string = 'RUR';
  fourthSelectedOption: string = 'GBP';
  data: any;
  currencyOptions: Array<any> = [];

  constructor (
    private http: HttpClient,
    private banksService: ApiService) { }

  ngOnInit() {
    this.banksService.getData('http://54.86.92.122/api/' + this.api).subscribe(resp => {
      this.data = resp;
      this.data.forEach(o => {
        o.rates = {};
        o.currency.forEach(c => {
          o.rates[c.currency_Description] = c;
          this.currencyOptions.push(c.currency_Description);
          this.currencyOptions = _.uniq(this.currencyOptions);
        });
      })
    });
  }
}
