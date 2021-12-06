import {ICoordinate} from './gps.model';

export type NodeID = number | string;

export interface IGraph {
    directed: boolean;
    multigraph: boolean;
    nodes: INode[];
    links: ILink[];
}

export interface INode {
    id: NodeID;
    x: number;
    y: number;
}

export interface ILink {
    id: NodeID;
    weight: number;
    speed: number;
    source: number;
    target: NodeID;
    center: ICoordinate;
    coords: {
        id: NodeID;
        x: number;
        y: number;
    }[];
}
