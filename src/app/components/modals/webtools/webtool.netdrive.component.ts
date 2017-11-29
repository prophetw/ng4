import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {
  DomSanitizer, SafeResourceUrl, SafeUrl
} from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';

declare var phantomOnlineGlobalConfig: any;

@Component({
	moduleId: module.id,
	selector: 'webtool-netdrive',
	templateUrl: './webtool.netdrive.html',
	styleUrls: ['./webtool.netdrive.css']
})
export class WebtoolNetdrive implements OnInit {
	public netDrives:Object;
	public listSrc:any = this.sanitizer.bypassSecurityTrustResourceUrl("");
	@Output() selectDrive = new EventEmitter<any>();
	constructor(private http: Http, private sanitizer: DomSanitizer,) {

	}

	ngOnInit() {

		this._getNetDriveMenu();
	}

	opendrive(event:any, drive:any) {
		let drivePackage = [event, drive];
		this.selectDrive.emit(drivePackage);
	}

	_getNetDriveMenu() {
		//
		let _target = window.location.protocol + "//" + window.location.host + "/netdrive/success.html";
		let url = phantomOnlineGlobalConfig.cloudApiUrl +'site-info/list-all-storage?app_id=FoxitWebReader&backurl=' + _target;
		this.listSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
		this.http.get(url)
		.map(
		  (response:Response) => {
		      let data = response.json();
		      return data;
		  }
		)
		.subscribe(
		data => {
			console.log(data);
			if (data.all_storage) {
				this.netDrives = data.all_storage;
			}
		},
		error => {
		  console.log('error', error);
		});
	}
}
