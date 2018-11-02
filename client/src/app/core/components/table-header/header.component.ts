import { Component } from '@angular/core';

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
      </div>
    </div>

  `
})
export class HeaderComponent {
  date: number = Date.now();

  constructor() {
  }

}
