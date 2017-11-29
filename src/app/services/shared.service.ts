import {Observable,Observer} from 'rxjs/Rx';

export class SharedService {
    observable: Observable<any>;
    observer: Observer<any>;

    constructor() {
        this.observable = Observable.create((observer:Observer<any>) => {
            this.observer = observer;
        }).share();
    }

    broadcast(event:any) {
        this.observer.next(event);
    }

    on(eventName:any, callback:any) {
        //noinspection TypeScriptUnresolvedFunction
        this.observable.filter((event) => {
            return event.name === eventName;
        }).subscribe(callback);
    }
}