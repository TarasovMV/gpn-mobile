import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export class SavedObservable<T> extends Observable<T> {
    constructor(sub: Observable<T>) {
        super();
        this.operator = sub.operator;
        this.source = sub.source;
    }

    get value(): T {
        return this.extractCurrentValue();
    }

    getValue(): T {
        return this.extractCurrentValue();
    }

    private extractCurrentValue(): T {
        let res;
        this.pipe(take(1)).subscribe((x) => (res = x));
        return res;
    }
}
