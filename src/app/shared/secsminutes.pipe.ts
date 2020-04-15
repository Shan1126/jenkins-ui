import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secsminutes'
  })
  export class Secsminutes implements PipeTransform {
      transform(value: any): string {
         const minutes: number = Math.floor(parseInt(value) / 60);
         return minutes.toString().padStart(2, '0') + ':' + 
         Math.floor((value - minutes * 60)).toString().padStart(2, '0');
      }
  }