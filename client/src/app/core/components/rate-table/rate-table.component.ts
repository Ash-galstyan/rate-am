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

  data: any;
  currencyOptions: Array<any> = [];
  displayedSelects: Array<any> = [];

  constructor (
    private http: HttpClient,
    private banksService: ApiService,
    private uiStateService: UiStateService) { }

  ngOnInit() {
    this.getData();
    setInterval(() => {
      this.getData();
    },  5* 60 * 1000);
  }

  getData() {
    this.banksService.getData('http://54.86.92.122/api/' + this.api).subscribe(resp => {
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
  }
}
