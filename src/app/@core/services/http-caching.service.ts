import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, combineLatest, of, Subscription} from 'rxjs';
import {catchError, debounceTime, filter, map, skip} from 'rxjs/operators';
import { Network } from '@capacitor/network';


export const HTTP_CACHE_HEADER: string = 'post-caching';

@Injectable({
    providedIn: 'root'
})
export class HttpCachingService {
    private networkStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private requests$: BehaviorSubject<HttpRequest<any>[]> = new BehaviorSubject<HttpRequest<any>[]>([]);
    private get requests(): HttpRequest<any>[] {
        return this.requests$.getValue();
    }
    private id: number = 0;

    constructor(private http: HttpClient) {
        this.scheduler();
    }

    public addRequest<T>(req: HttpRequest<T>): void {
        console.log('add request', req.url);
        if (this.requests.findIndex(x => x.headers.get(HTTP_CACHE_HEADER) === req.headers.get(HTTP_CACHE_HEADER)) !== -1) {
            return;
        }
        console.log('add request after check', req.url);
        this.requests$.next([...this.requests, req]);
    }

    public getNextId(): number {
        return ++this.id;
    }

    private deleteRequest<T>(req: HttpRequest<T>): void {
        console.log('delete', req.url);
        const index = this.requests.indexOf(req);
        const requests = [...this.requests];
        requests.splice(index, 1);
        this.requests$.next(requests);
    }

    private async scheduler(): Promise<void> {
        let current: Subscription = null;
        Network.addListener('networkStatusChange', status => {
            this.networkStatus$.next(status.connected);
            console.log('net',status);
        });
        const netStatus = await Network.getStatus();
        this.networkStatus$.next(netStatus.connected);
        combineLatest([this.requests$, this.networkStatus$]).pipe(
            filter(([r, s]) => !!r.length && !!s),
            map(([r, _]) => r.sort(this.requestsSort)[0]),
            debounceTime(500),
        ).subscribe((req: HttpRequest<any>) => {
            if (!!current) {
                current.unsubscribe();
                current = null;
            }
            current = this.http.request(req)
                .pipe(skip(1), catchError(e => of(null)))
                .subscribe(() => {
                    this.deleteRequest(req);
                });
        });
    }

    private requestsSort(a, b): number {
        const getId = (req: HttpRequest<any>): number => +req.headers.get(HTTP_CACHE_HEADER);
        return getId(a) - getId(b);
    }
}
