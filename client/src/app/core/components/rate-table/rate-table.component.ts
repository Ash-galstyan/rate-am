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

  data: any;
  averageRatesData: Array<any> = [];
  currencyOptions: Array<any> = [];
  displayedSelects: Array<any> = [];
  averageRates = {};

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
      })
    });
    if (this.averageRatesApi) {
      this.apiService.getData('http://54.86.92.122/api/' + this.averageRatesApi).subscribe( data => {
        this.averageRatesData = data;
        data.forEach(o => {
          this.averageRates[o.currency_description] = o;
        })
      })
    }
  }
}
