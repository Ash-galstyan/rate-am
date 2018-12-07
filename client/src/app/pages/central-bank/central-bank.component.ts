import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-central-bank',
  templateUrl: './central-bank.component.html',
  styleUrls: ['./central-bank.component.scss']
})
export class CentralBankComponent implements OnInit {
  
  title: string = 'Central Bank';
  address: 'Yerevan, Kentron V. Sargsyan 6, 0010';
  phoneNumber: '(374 10) 583841';
  faxNumber: '(374 10) 583841';
  email: 'mcba@cba.am';
  url: 'http://www.cba.am';
  lat: number = 40.175977;
  lng: number = 44.510516;

  constructor() { }

  ngOnInit() {
  }

}
