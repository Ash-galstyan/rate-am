import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  name: string;
  branches?: number;
  position?: number;
  currencies?: any[];
  date?: number;
}

export interface Currency {
  prop: string,
  viewValue: string;
  buyValue: number,
  sellValue: number
}


@Component({
  selector: 'app-rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.scss']
})
export class RateTableComponent implements OnInit {
  date: any = Date.now();
  exchangeTypes: any[];
  rateTypes: any[];
  currencies: Currency[];
  ELEMENT_DATA: PeriodicElement[];
  displayedColumns: string[];
  dataSource = this.ELEMENT_DATA;
  selectedOption: string = 'USD';
  banks: any;
  currencyOptions: Array<any>;
  selectedCurrency: Array<any>;


  constructor(private http: HttpClient, private banksService: ApiService) { }

  ngOnInit() {
    this.exchangeTypes = ['Non-cash', 'Cash', 'Card'];
    this.rateTypes = ['Flat', 'Cross'];
    this.currencies = [
      { prop: 'usd', viewValue: 'USD', buyValue: 484, sellValue: 487.5 },
      { prop: 'eur', viewValue: 'EUR', buyValue: 549, sellValue: 559 },
      { prop: 'rur', viewValue: 'RUR', buyValue: 7.30, sellValue: 7.55 },
      { prop: 'gbp', viewValue: 'GBP', buyValue: 614, sellValue: 63 }
    ];
    this.displayedColumns = ['position', 'name', 'date', 'currency'];
    this.banksService.getData('http://54.86.92.122/api/bankRates').subscribe( resp => {
      this.banks = resp
      this.banks.forEach( o => {
        // o.currency['usd'].sellVAlue
        this.currencyOptions = o.currency.filter( resp => resp.currency_Description );
      })
    });
  }

  onOptionChange() {
    let newArr = this.currencyOptions.filter(o => o.currency_Description === this.selectedOption)
    this.selectedCurrency  = newArr[0]
  }
}
