import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(bytes: any, precision: number = 1): any {
    var number:number, units:Array<any>;
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
      return '-';
    }
    if (bytes === 0) {
      return '0 KB';
    }
    units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
  }

}
