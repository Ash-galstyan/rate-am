import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BanksService } from '../banks.service';

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
  currencyChange: string;
  banks: any;
  
  constructor(private http: HttpClient, private banksService: BanksService) { }
  
  ngOnInit() {
    this.exchangeTypes = ['Non-cash', 'Cash', 'Card'];
    this.rateTypes = ['Flat', 'Cross'];
    this.currencies = [
      { prop: 'usd', viewValue: 'USD', buyValue: 484, sellValue: 487.5 },
      { prop: 'eur', viewValue: 'EUR', buyValue: 549, sellValue: 559 },
      { prop: 'rur', viewValue: 'RUR', buyValue: 7.30, sellValue: 7.55 },
      { prop: 'gbp', viewValue: 'GBP', buyValue: 614, sellValue: 63 }
    ];
    this.displayedColumns = ['position', 'name', 'branches', 'date', 'currency'];
    this.banks = this.banksService.getBanks();
    this.dataSource = [
      { position: 1, name: 'Unibank', branches: 42, date: this.date, currencies: this.currencies},
      { position: 2, name: 'VTB Bank (Armenia)', branches: 69, date: this.date, currencies: this.currencies },
      { position: 3, name: 'Evocabank', branches: 12, date: this.date, currencies: this.currencies },
      { position: 4, name: 'Inecobank', branches: 23, date: this.date, currencies: this.currencies },
      { position: 5, name: 'IDBank', branches: 14, date: this.date, currencies: this.currencies },
      { position: 6, name: 'Byblos Bank Armenia', branches: 5, date: this.date, currencies: this.currencies },
      { position: 7, name: 'ArmSwissBank', branches: 1, date: this.date, currencies: this.currencies },
      { position: 8, name: 'ArmBusinessBank', branches: 55, date: this.date, currencies: this.currencies },
      { position: 9, name: 'Converse Bank', branches: 33, date: this.date, currencies: this.currencies },
      { position: 10, name: 'Ameriabank', branches: 11, date: this.date, currencies: this.currencies },
      { position: 10, name: 'Artsakhbank', branches: 25, date: this.date, currencies: this.currencies },
      { position: 10, name: 'HSBC Bank Armenia', branches: 9, date: this.date, currencies: this.currencies },
      { position: 10, name: 'ARARATBANK', branches: 48, date: this.date, currencies: this.currencies },
      { position: 10, name: 'ACBA-Credit Agricole Bank', branches: 59, date: this.date, currencies: this.currencies },
      { position: 10, name: 'Mellat Bank', branches: 1, date: this.date, currencies: this.currencies },
      { position: 10, name: 'ARMECONOMBANK', branches: 51, date: this.date, currencies: this.currencies },
      { position: 10, name: 'Ardshinbank', branches: 52, date: this.date, currencies: this.currencies },
    ];
  }
}
