import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-header',
  styleUrls: ['./table-header.component.scss'],
  template: `
    <mat-card>
      <mat-card-content class="table-header-section">
        <h2>Exchange type</h2>
        <section>
          <mat-radio-group [(ngModel)]="value">
            <mat-radio-button *ngFor="let exchangeType of exchangeTypes" [value]="exchangeType">{{exchangeType}}</mat-radio-button>
          </mat-radio-group>
        </section>
      </mat-card-content>
      <mat-card-content class="table-header-section">
        <section>
          <h2>Rate type</h2>
          <mat-radio-group [(ngModel)]="value">
            <mat-radio-button *ngFor="let rateType of rateTypes" [value]="rateType">{{rateType}}</mat-radio-button>
          </mat-radio-group>
        </section>
      </mat-card-content>
      <mat-card-content class="table-header-section date">
        <section>
          <h2>Rates by previous date</h2>
          <mat-form-field>
            <input matInput [matDatepicker]="picker" placeholder="Choose a date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </section>
      </mat-card-content>
    </mat-card>
  `
})
export class TableHeaderComponent implements OnInit {
  @Input() exchangeTypes: any[];
  @Input() rateTypes: any[];
  value: any;
  
  constructor() {
  }

  ngOnInit() {
    this.value = this.exchangeTypes[0];
  }

}
