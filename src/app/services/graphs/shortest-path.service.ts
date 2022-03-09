import { Injectable } from '@angular/core';
import { GeoProjection } from 'as-geo-projection';
import { IGraph } from '../../@core/model/graphs.models';
import {ICoordinate} from '../../@core/model/gps.model';
import * as jsnx from 'jsnx';
import {GRAPH} from './graph.const';
import {find} from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ShortestPathService {
    private geo;
    private readonly graph: IGraph = GRAPH;
    constructor() {
        this.geo = new GeoProjection();
    }

    public findShortest(sourceLink: number | string, targetNode: number | string, user: ICoordinate): ICoordinate[] {
        const userLinkId: string = 'user';
        const G = new jsnx.Graph();

        // create nodes
        this.graph.nodes.forEach((node) => {
            G.addNode(node.id);
        });
        G.addNode(userLinkId); // add user node

        // create links
        this.graph.links.forEach((link) => {
            if (link.id === sourceLink) {
                return;
            }
            G.addEdge(link.source, link.target);
            G.getEdgeData(link.source, link.target).weight = link.weight;
        });
        const userLink = this.graph.links.find(x => x.id === sourceLink);
        const dist = (coord1, coord2): number =>
            Math.sqrt((coord1.x - coord2.x) * (coord1.x - coord2.x) + (coord1.y - coord2.y) * (coord1.y - coord2.y));
        const source = this.graph.nodes.find(x => x.id === userLink.source);
        const target = this.graph.nodes.find(x => x.id === userLink.target);
        G.addEdge(userLinkId, userLink.source);
        G.getEdgeData(userLinkId, userLink.source).weight =
            userLink.weight * dist(source, user) / (dist(source, user) + dist(target, user));
        G.addEdge(userLinkId, userLink.target);
        G.getEdgeData(userLinkId, userLink.target).weight =
            userLink.weight * dist(target, user) / (dist(source, user) + dist(target, user));

        const path: any[] = jsnx.shortestPath(G, {
            source: userLinkId,
            target: targetNode,
            weight: 'weight',
        });
        return path.map(x => x === userLinkId ? user : this.graph.nodes.find(n => n.id === x));
    }

    private geoTransform(coords: any[]): ICoordinate[] {
        return coords.map((item) => this.geo.getRelativeByWgs({ latitude: item.x, longitude: item.y }));
    }
}
