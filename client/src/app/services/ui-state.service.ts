import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  constructor() { }

  public isDesktop() {
    return window.innerWidth >= 1280;
  }

  public isTablet() {
    return !this.isDesktop() && !this.isMobile();
  }

  public isMobile() {
    return window.innerWidth <= 960;
  }
}
