import { Pipe, PipeTransform } from '@angular/core';
import { IStatusInfo } from '../../../avatar-modal/avatar-modal.component';
import {UserInfoService} from '../../../../@core/services/user-info.service';


const LUNCH_TIME_EPS = 4 * 60 * 60 * 1000;
const LUNCH_ID = 4;

@Pipe({
    name: 'statusFilter',
})
export class StatusFilterPipe implements PipeTransform {
    constructor(private readonly userInfo: UserInfoService) {}

    transform(value: IStatusInfo[], idList: number[]): IStatusInfo[] {
        const shift = this.userInfo.workShift;
        if (new Date().getTime() - new Date(shift?.dateStart).getTime() < LUNCH_TIME_EPS) {
            value = value?.filter(x => x?.id === LUNCH_ID);
        }
        return value.filter((item) => !idList.includes(item.id));
    }
}
