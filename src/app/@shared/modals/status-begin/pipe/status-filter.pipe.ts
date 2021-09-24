import { Pipe, PipeTransform } from '@angular/core';
import { IStatusInfo } from '../../../avatar-modal/avatar-modal.component';

@Pipe({
    name: 'statusFilter',
})
export class StatusFilterPipe implements PipeTransform {
    transform(value: IStatusInfo[], id: number): IStatusInfo[] {
        return value.filter((item) => item.id !== id);
    }
}
