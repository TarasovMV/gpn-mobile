import {ICoordinate} from './gps.model';

export interface IGraph {
    directed: boolean;
    multigraph: boolean;
    nodes: INode[];
    links: ILink[];
}

export interface INode {
    Coords: ICoordinate;
    id: number;
}

export interface ILink {
    weight: number;
    speed: number;
    source: number;
    target: number;
}
