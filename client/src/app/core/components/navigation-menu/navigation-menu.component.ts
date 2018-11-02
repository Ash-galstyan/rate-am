import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})

export class NavigationMenuComponent implements OnInit {
  submenuItems: Array<any>;

  constructor() { }

  ngOnInit() {
    this.submenuItems = [
      {
        path: 'banks',
        name: 'Banks'
      },
      {
        path: 'exchange-points',
        name: 'Exchange Points'
      },
      {
        path: 'credit-organizations',
        name: 'Credit Organizations'
      },
      {
        path: 'investment-organizations',
        name: 'Investment Organizations'
      },
      {
        path: 'central-bank',
        name: 'Central Bank'
      },
      {
        path: 'international-rates',
        name: 'International Rates'
      }
    ]
  }

}
