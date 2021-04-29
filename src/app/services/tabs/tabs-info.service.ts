import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TabsInfoService {
    public tasksCurrentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    constructor() { }
}
