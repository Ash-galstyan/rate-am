import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { UiStateService } from '../../../services/ui-state.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.scss']
})
export class RateTableComponent implements OnInit {
  @Input() api: string;
  @Input() averageRatesApi: string;
  @Input() hasAverageTable: boolean = false;
  @Input() isCentralBanksTable = false;

  data: any;
  months: any[];
  centralBankCurrency: string = 'USD';
  averageRatesData: Array<any> = [];
  currencyOptions: Array<any> = [];
  displayedSelects: Array<any> = [];
  averageRates = {};
  centralBankValues: any = {
    currency_description: '',
    currency_values: []
  };
  centralBankFilteredValues: any = {};

  constructor (
    private http: HttpClient,
    private apiService: ApiService,
    private uiStateService: UiStateService) { }

  ngOnInit() {
    this.getData();
    setInterval(() => {
      this.getData();
    },  5* 60 * 1000);
  }



  getData() {
    this.apiService.getData('http://54.86.92.122/api/' + this.api).subscribe(resp => {
      this.data = resp;
      this.data.forEach(o => {
        if (!this.isCentralBanksTable) {
          o.rates = {};
          o.currency.forEach(c => {
            o.rates[c.currency_Description] = c;
            this.currencyOptions.push(c.currency_Description);
            this.currencyOptions = _.uniq(this.currencyOptions);
            if (this.uiStateService.isDesktop()) {
              this.displayedSelects = this.currencyOptions.slice(0,4)
            } else {
              this.displayedSelects = this.currencyOptions.slice(0,1)
            }
          });
        } else {
          this.currencyOptions.push(o.currency_description);
          this.setCentralBankCurrency(o, this.currencyOptions);
          console.log(this.centralBankFilteredValues);
        }
      })
    });
    if (this.averageRatesApi && !this.isCentralBanksTable) {
      this.apiService.getData('http://54.86.92.122/api/' + this.averageRatesApi).subscribe( data => {
        this.averageRatesData = data;
        data.forEach(o => {
          this.averageRates[o.currency_description] = o;
        })
      })
    }
    this.months = [
      {name: 'Jan.'},
      {name: 'Feb.'},
      {name: 'March'},
      {name: 'April'},
      {name: 'May'},
      {name: 'June'},
      {name: 'July'},
      {name: 'Aug.'},
      {name: 'Sept.'},
      {name: 'Oct.'},
      {name: 'Nov.'},
      {name: 'Dec.'}
    ]
  }

  currencyChange(currency) {
    console.log(currency);
    this.data.forEach(o => {
      this.setCentralBankCurrency(o, currency)
    });
  }
  
  setCentralBankCurrency(o, currency) {
    if (currency === o.currency_description) {
      this.centralBankValues = {
        currency_description : o.currency_description,
        currencyValues : o.values
      };
      return this.centralBankFilteredValues = this.centralBankValues
    }
  }
}
