import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { GlobalService } from './global.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute , Router} from '@angular/router';
//import 'rxjs/add/observable/throw'

declare var $:any;

@Injectable()
export class ShareService {
    constructor(
      private http: Http,
      private router: Router,
      private globalService: GlobalService
    ) {}

    getShare (code:string) {
        var url:string = this.globalService.apiUrl + 'api/share/share?share_code=' + code + '&' + (new Date()).valueOf();
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(url, this.jwt(url))
            .map(
                (response:Response) => {
                    let data = response.json();

                  if (data.ret != 0) {
                    console.log("getShare failed, data: ");
                    console.log(data);
                    if (data.ret == 100007 && this.globalService.useCasLogin()) { // the token in cookie (globalService.currentUserToken) is not valid.
                      //var check_cas_route = "/check-cas/" + encodeURIComponent(location.pathname);
                      //console.log("check_cas_route " + check_cas_route);
                      //this.router.navigateByUrl(check_cas_route);

                    }
                  }

                    return data;
                }
            );
    }
    postViewRecord (record:any) {
        var url:string = this.globalService.apiUrl + 'api/document/post-view-record?' + (new Date()).valueOf();
        //noinspection TypeScriptUnresolvedFunction
        var __this=this;
        $.ajax({
            url:url,
            data:record,
            type: 'POST',
            beforeSend: function(request:any) {
                return request.setRequestHeader("Authorization", 'Bearer ' + __this.globalService.currentUserToken);
            }
        });
        //let currentToken = this.globalService.currentUserToken;
        //let headers = new Headers({ 'Authorization': 'Bearer '+currentToken });
        //let options = new RequestOptions({ headers: headers });
        //this.http.post(url, record, options);
    }

    private cmisDocumentMap: any = [];
    getCmisDocumentById (cmisId:string , forceRefresh?: boolean): Observable<any> {
        if(this.cmisDocumentMap[cmisId] && !forceRefresh){
            let replaySubject:ReplaySubject<number> = new ReplaySubject();
            var data:any = this.cmisDocumentMap[cmisId];
            replaySubject.next(data);
            return replaySubject;
        }
        var url:string = this.globalService.apiUrl + 'api/document/cmis-document?object_id=' + cmisId + '&' + (new Date()).valueOf();
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(url, this.jwt(url))
            .map(
                (response:Response) => {
                    let data = response.json();

                  if (data.ret != 0) {
                    console.log("getCmisDocumentById failed, data: ");
                    console.log(data);
                    if (data.ret == 100007 && this.globalService.useCasLogin()) { // the token in cookie (globalService.currentUserToken) is not valid.
                      //var check_cas_route = "/check-cas/" + encodeURIComponent(location.pathname);
                      //console.log("check_cas_route " + check_cas_route);
                      //this.router.navigateByUrl(check_cas_route);

                    }
                  }

                    this.cmisDocumentMap[cmisId] = data;
                    return data;
                }
            );
    }

    public sharedWithMeList: any = null;
    getSharedWithMe (forceRefresh?: boolean): Observable<any> {
      console.log('--sharedWithMeList--');
      console.log(this.sharedWithMeList);
        if(this.sharedWithMeList !== null && !forceRefresh){
            let replaySubject:ReplaySubject<number> = new ReplaySubject();
            replaySubject.next(this.sharedWithMeList);
            return replaySubject;
        }
        var url:string = this.globalService.apiUrl + 'api/share/shared-with-me' + '?' + (new Date()).valueOf();
      console.log('calling api/share/shared-with-me');
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(url, this.jwt(url))
            .map(
                (response:Response) => {
                    console.log('getSharedWithMe Response');
                    let data:any = response.json();

                  if (data.ret != 0) {
                    console.log("getSharedWithMe failed, data: ");
                    console.log(data);
                    if (data.ret == 100007 && this.globalService.useCasLogin()) { // the token in cookie (globalService.currentUserToken) is not valid.
                      //var check_cas_route = "/check-cas/" + encodeURIComponent(location.pathname);
                      //console.log("check_cas_route " + check_cas_route);
                      //this.router.navigateByUrl(check_cas_route);

                    }
                  }

                    this.sharedWithMeList = data;
                    return data;
                }
            );
    }

    private jwt(url:string) {
        // create authorization header with jwt token
        let currentToken = this.globalService.currentUserToken;
        if (currentToken) {
            if(url.indexOf('?')){
                url += '&access-token=' + currentToken;
            }else{
                url += '?access-token=' + currentToken;
            }
            return new RequestOptions({ url: url});
        }
    }


    removeSharedWithMeFile (id: string):Observable<any> {
      let url: string = this.globalService.apiUrl + 'api/share/delete-shared-with-me-file?access-token=' + this.globalService.currentUserToken;
      return this.http.post(url, {
        id: id
      }).map((res: Response) => {
        let data:any = res.json();
        if (data.ret === 0 || data.ret === 400002) {
          return;
        }
        throw({});
      })
    }
}
