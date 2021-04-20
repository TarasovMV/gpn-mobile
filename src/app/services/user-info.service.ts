import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
    public statusIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    public carNumber$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor() { }
}
