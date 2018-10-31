import { PipeTransform } from '@angular/core';
import { DatePipe as BaseDatePipe } from '@angular/common';

export class DatePipe implements PipeTransform {
  constructor(private format: string) {}
  
  transform(value: any): any {
    return new BaseDatePipe('en-US').transform(value, this.format, 'GMT');
  }
}
