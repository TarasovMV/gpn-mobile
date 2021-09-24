import { ICoord } from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';

export interface ITaskData {
    tasks: ITask[];
    markedPoints: IRoute[];
    route: IRoute[];
}

export interface ITask {
    id: number;
    number?: string;
    plantName?: string;
    order?: number;
    lockerId?: number;
    isAccepted?: boolean;
    isFinalized?: boolean;
    isFailed?: boolean;
    inCar?: boolean;
    dateTimeStart?: Date;
    dateTimeEnd?: Date;
    availableTimeToExceed?: number;
    nfc?: string;
    checked?: boolean;
    probes?: {
        name: string;
        count: number;
    }[];
    tares?: {
        name: string;
        count: number;
    }[];
}

export interface IRoute {
    taskId: number;
    point: ICoord;
}
