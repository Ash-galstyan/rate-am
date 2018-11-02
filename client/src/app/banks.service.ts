import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  
  constructor(private http: HttpClient) { }
  getBanks() {
    return this.http.get('/api/rates').subscribe((banks:any[]) => {
      return banks;
    });
  }
}
