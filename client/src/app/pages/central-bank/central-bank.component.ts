import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-central-bank',
  templateUrl: './central-bank.component.html',
  styleUrls: ['./central-bank.component.scss']
})
export class CentralBankComponent implements OnInit {
  
  title: string = 'Central Bank';
  address: string = 'Yerevan, Kentron V. Sargsyan 6, 0010';
  phoneNumber: string = '(374 10) 583841';
  faxNumber: string = '(374 10) 583841';
  email: string = 'mcba@cba.am';
  url: string = 'http://www.cba.am';
  lat: number = 40.175977;
  lng: number = 44.510516;

  constructor() { }

  ngOnInit() {
  }

}
