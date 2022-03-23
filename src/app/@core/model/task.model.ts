import {ICoordinate} from './gps.model';

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
    comment?: string;
    isFailed?: boolean;
    inCar?: boolean;
    dateTimeStart?: Date;
    dateTimeEnd?: Date;
    availableTimeToExceed?: number;
    nfc?: string;
    checked?: boolean;
    node?: {
        id: string | number;
        point: ICoordinate;
    };
    probes?: {
        name: string;
        count: number;
        checked: boolean;
    }[];
    tares?: {
        name: string;
        count: number;
        checked: boolean;
    }[];
}

export interface IRoute {
    taskId: number;
    point: ICoordinate;
    pointId: string;
}
