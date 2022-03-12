import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { Network } from '@capacitor/network';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, switchMap} from 'rxjs/operators';
import {HTTP_CACHE_HEADER, HttpCachingService} from '../services/http-caching.service';

@Injectable({
    providedIn: 'root'
})
export class HttpCachingInterceptor implements HttpInterceptor {
    constructor(private httpCaching: HttpCachingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has(HTTP_CACHE_HEADER)) {
            return next.handle(req);
        }
        return fromPromise(Network.getStatus()).pipe(
            switchMap(x => {
                if (x.connected) {
                    const cachingId = req.headers.get(HTTP_CACHE_HEADER);
                    req.headers.delete(HTTP_CACHE_HEADER);
                    req = req.clone({headers: req.headers.delete(HTTP_CACHE_HEADER)});
                    return next.handle(req).pipe(catchError((e) => {
                        if (e.status === 0) {
                            console.log('url', req.url);
                            req = req.clone({headers: req.headers.append(HTTP_CACHE_HEADER, cachingId)});
                            setTimeout(() => this.httpCaching.addRequest(req));
                            return of(null);
                        }
                        throwError(e);
                    }));
                }
                this.httpCaching.addRequest(req);
                return of(null);
            })
        );
    }
}
