var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var SizePipe = (function () {
    function SizePipe() {
    }
    SizePipe.prototype.transform = function (bytes, precision) {
        if (precision === void 0) { precision = 1; }
        var number, units;
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
            return '-';
        }
        if (bytes === 0) {
            return '0 KB';
        }
        units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
    SizePipe = __decorate([
        Pipe({
            name: 'size'
        })
    ], SizePipe);
    return SizePipe;
}());
export { SizePipe };
