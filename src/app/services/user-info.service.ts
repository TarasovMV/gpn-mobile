import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export interface IUser {
    firstName: string;
    lastName: string;
    patronymic: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
    public readonly currentUser: IUser = {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
    };
    public statusIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    public carNumber$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // Выбранный таб в модальном окне
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    constructor() { }
}
