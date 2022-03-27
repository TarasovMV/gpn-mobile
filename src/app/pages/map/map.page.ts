import {
    AfterViewInit,
    Component,
    ElementRef, Inject, OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, shareReplay, takeUntil} from 'rxjs/operators';
import { TabsInfoService } from '../../@core/services/tabs-info.service';
import { ModalController, NavController } from '@ionic/angular';
import { ResolveTaskComponent } from './components/resolve-task/resolve-task.component';
import { ShortestPathService } from '../../@core/services/graphs/shortest-path.service';
import * as d3 from 'd3';
import {ICoordinate, IGpsService} from '../../@core/model/gps.model';
import {GpsProjectionService} from '../../@core/services/graphs/gps-projection.service';
import {GeoProjectionService} from '../../@core/services/graphs/geo-projection.service';
import {IGraph} from '../../@core/model/graphs.models';
import {GPS} from '../../@core/tokens';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('screen', {static: true}) screenRef: ElementRef;
    @ViewChild('svg') svgElement: ElementRef;

    public readonly cameraPosition$: Subject<ICoordinate> = new Subject<ICoordinate>();
    public readonly displayTime$: Subject<number> = new Subject<number>();
    public readonly displayPercent$: Observable<number> = this.displayTime$.pipe(map(x =>
        Math.min(Math.max(100 - x / this.initTime * 100, 0), 100)
    ));

    private svg: any;
    private initTime: number = undefined;
    private isOpenModal: boolean = false;
    private isTrackPosition: boolean = true;
    private readonly position$: Observable<ICoordinate> = this.gpsService.position$.pipe(
        filter((gps) => !!gps),
        shareReplay(1),
    );
    private readonly destroy$: Subject<boolean> = new Subject<boolean>();

    private get destination(): { taskId: number; pointId: number | string; x: number; y: number } {
        if (!this.tabsService.currentTask$.getValue()) {
            return undefined;
        }
        const id = this.tabsService.currentTask$.getValue().id;
        const node = this.tabsService.currentTask$.getValue().node;
        return {taskId: id, pointId: node.id, x: node.point.x, y: node.point.y};
    }

    constructor(
        public tabsService: TabsInfoService,
        private modalController: ModalController,
        private navCtrl: NavController,
        private graph: ShortestPathService,
        @Inject(GPS) private gpsService: IGpsService,
        private gpsProjection: GpsProjectionService,
        private geoProjection: GeoProjectionService,
    ) {}

    async ngOnInit(): Promise<void> {
        if (environment.fakeGps) {
            // const id = this.tabsService.currentTask$.getValue()?.id;
            // if (!id) {
            //     return;
            // }
            // const route = this.tabsService.getRoutes(id);
            // this.gpsService.init?.(route);
        }
    }

    ngAfterViewInit(): void {
        this.drawSvg();
        const currentTask$ = this.tabsService.currentTask$.pipe(distinctUntilChanged((prev, curr) => prev.id === curr.id));
        combineLatest([
            this.position$,
            currentTask$
        ]).pipe(takeUntil(this.destroy$)).subscribe(([pos, _]) => {
            const destination = this.destination;
            const res = this.gpsProjection.getProjection(pos);
            const user = this.geoProjection.relativeConvert({x: res.x, y: res.y});

            if (user.x > 100 || user.x < 0 || user.y > 100 || user.y < 0) {
                return;
            }

            if (!!destination) {
                const path = this.graph.findShortest(res.linkId, destination.pointId, {x: res.x, y: res.y});
                const route = path?.map((point) => this.geoProjection.relativeConvert(point)) ?? [];
                this.initTime = this.initTime ? this.initTime : this.geoProjection.getPathTime(path);
                this.displayTime$.next(this.geoProjection.getPathTime(path));
                this.drawRoute(route);
                this.drawNavPoints([route[route.length - 1]]);
                // TODO: maybe replace to background service
                if (this.geoProjection.isEnd(res, destination) && !this.isOpenModal) {
                    this.openEndTaskModal(!destination.taskId ? 'endAll' : 'endOne').then();
                }
            }
            this.drawCarPoint(user.x, user.y);

            if (this.isTrackPosition) {
                this.setCameraPosition(user.x, user.y);
            }
        });
    }

    ngOnDestroy(): void {
        this.gpsService.cancel?.();
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async redirectToNFC(): Promise<void> {
        if(this.tabsService.currentTask$.getValue()?.id === null ) {
            await this.navCtrl.navigateRoot('/tabs/tabs-ready');
            return;
        }
        this.navCtrl.navigateRoot('/nfc').then();
    }

    public redirectToTab(): void {
        this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
    }

    public toggleTrack(status: boolean): void {
        this.isTrackPosition = status;
    }

    private setCameraPosition(x: number, y: number): void {
        this.cameraPosition$.next({x ,y});
    }

    private drawSvg(): void {
        this.svg = d3.select(this.svgElement.nativeElement).append('svg');
        this.svg
            .attr('width', '100%')
            .attr('height', '100%');
    }

    private drawGraph(graph: IGraph, color: string): void {
        graph.links.map(x => {
            const coords = x.coords.map(c => this.geoProjection.relativeConvert(c));
            return {
                x1: coords[0].x,
                y1: coords[0].y,
                x2: coords[1].x,
                y2: coords[1].y,
            };
        }).forEach((x, i, arr) => {
            this.svg
                .append('line')
                .style('stroke', `var(${color})`)
                .style('stroke-width', `0.07%`)
                .attr('class', 'nav-line')
                .attr('x1', `${x.x1}%`)
                .attr('y1', `${x.y1}%`)
                .attr('x2', `${x.x2}%`)
                .attr('y2', `${x.y2}%`);
        });

        graph.nodes
            .map(n => this.geoProjection.relativeConvert(n))
            .forEach((c) => {
                this.svg
                    .append('circle')
                    .attr('r', 0.5)
                    .attr('stroke-width', 0.1)
                    .attr('cx', `${c.x}%`)
                    .attr('cy', `${c.y}%`)
                    .attr('class', 'nav-point-inner');
        });
    }

    private drawRoute(coords: { x: number; y: number }[]): void {
        this.svg.selectAll('.nav-line').remove();
        coords
            .map((c, i, arr) => ({
                x1: c.x,
                x2: arr[i + 1]?.x,
                y1: c.y,
                y2: arr[i + 1]?.y,
            }))
            .filter((x) => !!x.x2 && !!x.y2)
            .forEach((l) => {
                this.svg
                    .append('line')
                    .style('stroke', 'var(--border-blue-color)')
                    .style('stroke-dasharray', '2 1')
                    .style('stroke-width', `0.07%`)
                    .attr('class', 'nav-line')
                    .attr('x1', `${l.x1}%`)
                    .attr('y1', `${l.y1}%`)
                    .attr('x2', `${l.x2}%`)
                    .attr('y2', `${l.y2}%`);
            });
    }

    private drawNavPoints(coords: { x: number; y: number }[]): void {
        this.svg.selectAll('.nav-point').remove();
        this.svg.selectAll('.nav-point-inner').remove();
        coords.forEach((c) => {
            this.svg
                .append('circle')
                .attr('r', 1.4)
                .attr('stroke-width', 0.1)
                .attr('cx', `${c.x}%`)
                .attr('cy', `${c.y}%`)
                .attr('class', 'nav-point');
            this.svg
                .append('circle')
                .attr('r', 0.7)
                .attr('cx', `${c.x}%`)
                .attr('cy', `${c.y}%`)
                .attr('class', 'nav-point-inner');
        });
    }

    private drawCarPoint(x: number, y: number) {
        this.svg.select('.car-point').remove();
        this.svg.select('.car-point-back').remove();
        this.svg
            .append('circle')
            .attr('id', 999)
            .attr('r', 1)
            .attr('cx', `${x}%`)
            .attr('cy', `${y}%`)
            .attr('class', 'car-point');
        this.svg
            .append('circle')
            .attr('id', 998)
            .attr('r', 3)
            .attr('cx', `${x}%`)
            .attr('cy', `${y}%`)
            .attr('class', 'car-point-back');
    }

    private async openEndTaskModal(type: string = 'endOne'): Promise<void> {
        this.isOpenModal = true;
        const modal = await this.modalController.create({
            component: ResolveTaskComponent,
            cssClass: 'custom-modal resolve-modal',
            componentProps: {type},
            backdropDismiss: false,
        });
        return await modal.present();
    }
}
