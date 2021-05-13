import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitNumberSign'
})
export class SplitNumberSignPipe implements PipeTransform {
    transform(value: string, args?: any): string {
        return value.toString().replace('№', '№ ');
    }
}
