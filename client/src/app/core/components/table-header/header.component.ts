import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-header',
  styleUrls: ['./header.component.scss'],
  template: `
    <div class="top-bar" fxLayout="row" fxLayoutAlign="space-between center">
      <div class="logo">
        <a [routerLink]="['/banks']">
          <i class="fas fa-dollar-sign dollar-icon"></i>
        </a>
      </div>
      <div>
        <h4>{{date | date: 'full'}}, Yerevan, Armenia</h4>
        <p></p>
      </div>
    </div>

  `
})
export class HeaderComponent implements OnInit {
  date: any;

  constructor() { }

  ngOnInit() {
    this.getDate()
  }

  getDate() {
    setInterval(() => {
      this.date = new Date();
    }, 1);
  }
}
