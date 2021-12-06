import { Injectable } from '@angular/core';
import { GeoProjection } from 'as-geo-projection';
import { IGraph } from '../../@core/model/graphs.models';
import {ICoordinate} from '../../@core/model/gps.model';
import * as jsnx from 'jsnx';
import {GRAPH} from './graph.const';


@Injectable({
    providedIn: 'root',
})
export class ShortestPathService {
    private geo;
    private readonly graph: IGraph = GRAPH;
    constructor() {
        this.geo = new GeoProjection();
    }

    // TODO: delete sourceLink add new node and 2 links
    public findShortest(sourceLink: number | string, targetNode: number | string, user: ICoordinate): ICoordinate[] {
        const G = new jsnx.Graph();

        this.graph.nodes.forEach((node) => {
            G.addNode(node.id);
        });

        this.graph.links.forEach((link) => {
            G.addEdge(link.source, link.target);
            G.getEdgeData(link.source, link.target).weight =
                link.weight;
        });

        const path: any[] = jsnx.shortestPath(G, {
            sourceLink,
            targetNode,
            weight: 'weight',
        });

        this.graph.nodes.forEach((node) => {
            const myNode = path.findIndex(
                (nodeId) => nodeId === node.id
            );
            if (myNode !== -1) {
                path[myNode] = node;
            }
        });

        return this.geoTransform(path);
    }

    private geoTransform(coords: any[]): ICoordinate[] {
        return coords.map((item) => this.geo.getRelativeByWgs({ latitude: item.x, longitude: item.y }));
    }
}
