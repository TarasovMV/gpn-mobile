import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class NfcService {
    public nfcListener: Observable<any>
}
