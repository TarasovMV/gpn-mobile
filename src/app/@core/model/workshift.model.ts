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
    userId: number;
    stateId: number;
    isMobile: true;
    position: string;
}

export interface IWorkShiftVehicle {
    userId: number;
    vehicleId: number;
}

export interface ISetWorkShift {
    userId: number;
    vehicleId: number;
    driverStateId: number;
    position?: string;
}

export interface IWorkShiftEnd {
    duration: number;
    numberOfProbes: number;
    numberOfProdObjects: number;
}
