import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  branches?: number;
  position?: number;
  currencies?: any;
  symbol?: string;
  date?: number;
}

export interface Currency {
  prop: string,
  viewValue: string;
  value: {
    buyValue: number,
    sellValue: number
  };
}

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  date: any = Date.now();
  exchangeTypes: any[];
  rateTypes: any[];
  currencies: Currency[];
  ELEMENT_DATA: PeriodicElement[];
  displayedColumns: string[];
  dataSource = this.ELEMENT_DATA;
  currencyChange: any;

  constructor() { }

  ngOnInit() {
    this.exchangeTypes = ['Non-cash', 'Cash', 'Card'];
    this.rateTypes = ['Flat', 'Cross'];
    this.currencies = [
      { prop: 'usd', viewValue: 'USD', value: { buyValue: 484, sellValue: 487.5 } },
      { prop: 'eur', viewValue: 'EUR', value: { buyValue: 549, sellValue: 559 } },
      { prop: 'rur', viewValue: 'RUR', value: { buyValue: 7.30, sellValue: 7.55 } },
      { prop: 'gbp', viewValue: 'GBP', value: { buyValue: 614, sellValue: 634 } }
    ];
    this.displayedColumns = ['position', 'name', 'branches', 'date', 'currency'];
    this.dataSource = [
      { position: 1, name: 'Unibank', branches: 42, symbol: 'H', date: this.date, currencies: this.currencies },
      { position: 2, name: 'VTB Bank (Armenia)', branches: 69, symbol: 'He', date: this.date, currencies: this.currencies },
      { position: 3, name: 'Evocabank', branches: 12, symbol: 'Li', date: this.date, currencies: this.currencies },
      { position: 4, name: 'Inecobank', branches: 23, symbol: 'Be', date: this.date, currencies: this.currencies },
      { position: 5, name: 'IDBank', branches: 14, symbol: 'B', date: this.date, currencies: this.currencies },
      { position: 6, name: 'Byblos Bank Armenia', branches: 5, symbol: 'C', date: this.date, currencies: this.currencies },
      { position: 7, name: 'ArmSwissBank', branches: 1, symbol: 'N', date: this.date, currencies: this.currencies },
      { position: 8, name: 'ArmBusinessBank', branches: 55, symbol: 'O', date: this.date, currencies: this.currencies },
      { position: 9, name: 'Converse Bank', branches: 33, symbol: 'F', date: this.date, currencies: this.currencies },
      { position: 10, name: 'Ameriabank', branches: 11, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'Artsakhbank', branches: 25, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'HSBC Bank Armenia', branches: 9, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'ARARATBANK', branches: 48, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'ACBA-Credit Agricole Bank', branches: 59, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'Mellat Bank', branches: 1, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'ARMECONOMBANK', branches: 51, symbol: 'Ne', date: this.date, currencies: this.currencies },
      { position: 10, name: 'Ardshinbank', branches: 52, symbol: 'Ne', date: this.date, currencies: this.currencies },
    ];
  }

}
