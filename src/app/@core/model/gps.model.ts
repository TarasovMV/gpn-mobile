export interface ICoordinate {
    x: number;
    y: number;
}

// TODO: add fields
export interface IGpsInfo extends ICoordinate {
    prop?: any;
}
