export interface IWorkShift {
    id: number;
    isActive: boolean;
    userId: number;
    vehicleId: number;
    driverStateId: number;
    dateStart: Date;
    dateStartPlanned: Date;
    dateFinishPlanned: Date;
    dateFinishFact: Date;
}

export interface IWorkShiftStatus {
    workShiftId: number;
    driverStateId: number;
}

export interface IWorkShiftVehicle {
    workShiftId: number;
    vehicleId: number;
}

export interface ISetWorkShift {
    userId: number;
    vehicleId: number;
    driverStateId: number;
}

export interface IWorkShiftEnd {
    duration: number;
    numberOfProbes: number;
    numberOfProdObjects: number;
}
