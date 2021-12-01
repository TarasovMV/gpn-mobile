import {ICoord} from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';

export interface IGraph {
    directed: boolean;
    multigraph: boolean;
    nodes: INode[];
    links: ILink[];
}

export interface INode {
    Coords: ICoord;
    id: number;
}

export interface ILink {
    weight: number;
    speed: number;
    source: number;
    target: number;
}
