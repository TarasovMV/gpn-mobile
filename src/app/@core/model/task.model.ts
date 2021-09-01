export interface ITask {
    id: number;
    number: string;
    plantName: string;
    order: number;
    isAccepted: true;
    isFinalized: true;
    isFailed: true;
    dateTimeStart: Date;
    dateTimeEnd: Date;
    availableTimeToExceed: number;
    checked?: boolean;
    probes: {
        name: string;
        count: number;
    }[];
    tares: {
        name: string;
        count: number;
    }[];
}
