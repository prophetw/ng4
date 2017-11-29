/**
 * Created by linc on 2017/9/19.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalService } from '../services/global.service';
import 'rxjs/add/operator/map';

@Injectable()
export class SubscriptionService {

  constructor(private http: Http, private globalService: GlobalService) { }

  licenseCodeRedeem (licenseCode: string, source: string, tabName: string) {
    //return this.http.post(this.globalService.apiUrl + 'api-appstore/redeem_phantom_subscription', {
    //  'access-token': this.globalService.currentUserToken,
    //  license_code: licenseCode
    //}).map((res: Response) => {
    //  return res.json();
    //})
    let gaParam:string = '';
    let gaValue:string = '';
    if (tabName) {
      gaParam += '&trackingId=';
      if (source === 'online') {
        gaValue += 'Foxit Online Redeem '
      } else {
        gaValue += 'Phantom Online Redeem '
      }
      gaValue += tabName;
      gaParam += encodeURIComponent(gaValue);
    }
    return this.http.get(this.globalService.apiUrl + 'api/appstore/redeem-phantom-subscription?access-token='
      + this.globalService.currentUserToken
      + '&license_code=' + encodeURIComponent(licenseCode)
      + gaParam
    ).map((res: Response) => {
      return res.json();
    })
  }
  //
  //activationSubscription () {
  //  return this.modalService.show(ActivationSubscriptionComponent, {
  //    backdrop: 'static',
  //    animated: false
  //  });
  //}

}
