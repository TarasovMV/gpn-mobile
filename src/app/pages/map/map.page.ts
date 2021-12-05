import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {filter, map, shareReplay, take} from 'rxjs/operators';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { ModalController, NavController } from '@ionic/angular';
import { ResolveTaskComponent } from './components/resolve-task/resolve-task.component';
import { ShortestPathService } from '../../services/graphs/shortest-path.service';
import {GpsService} from '../../@core/services/platform/gps.service';
import * as d3 from 'd3';
import {ICoordinate} from '../../@core/model/gps.model';
import {GpsProjectionService} from '../../services/graphs/gps-projection.service';
import {GeoProjectionService} from '../../services/graphs/geo-projection.service';


@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
    @ViewChild('screen') screenRef: ElementRef;
    @ViewChild('svg') svgElement: ElementRef;

    public currentTime: number = 0;
    public allTime: number = 5 * 1000;

    currentPosition: ICoordinate;

    private svg: any;
    private isOpenModal: boolean = false;
    private isTrackPosition: boolean = true;
    private readonly position$: Observable<ICoordinate> = this.gpsService.position$.pipe(
        filter((gps) => !!gps),
        shareReplay(1),
    );

    private get destination(): { taskId: number; linkId: number | string; x: number; y: number } {
        const id = this.tabsService.currentTask$.getValue().id;
        const route = this.tabsService.getRoutes(id);
        const point = route[route?.length - 1];
        const projectionPoint = this.geoProjection.wgsConvert({ latitude: point.y, longitude: point.x });
        return {taskId: id, linkId: 'link', x: projectionPoint.x, y: projectionPoint.y};
    }

    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController,
        private navCtrl: NavController,
        private zone: NgZone,
        private graph: ShortestPathService,
        private gpsService: GpsService,
        private gpsProjection: GpsProjectionService,
        private geoProjection: GeoProjectionService,
    ) {}

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.drawSvg();

        this.position$.subscribe((pos) => {
            const destination = this.destination;
            const res = this.gpsProjection.getProjection(pos);
            const user = this.geoProjection.relativeConvert({x: res.x, y: res.y});

            if (!!destination) {
                const route = this.graph
                    .findShortest(res.linkId, destination.linkId, {x: res.x, y: res.y})
                    ?.map((point) => this.geoProjection.relativeConvert(point)) ?? [];
                this.drawRoute(route);
                this.drawNavPoints([route[route.length - 1]]);
                // TODO: maybe replace to background service
                if (this.geoProjection.isEnd(res, destination) && !this.isOpenModal) {
                    this.openEndTaskModal(destination.taskId === null ? 'endAll' : 'endOne').then();
                }
            }
            this.drawCarPoint(user.x, user.y);

            if (this.isTrackPosition) {
                this.setCameraPosition(user.x, user.y);
            }
        });

        // TODO: to clear
        // this.currentRoute = curTaskRoutes
        //     .map((item) => this.geoProjection.getRelativeByWgs({ latitude: item.y, longitude: item.x }))
        //     .map((item) => ({ x: item.x, y: 100 - item.y }));
        //
        // this.drawRoute([{ ...this.currentRoute[0] }, ...this.currentRoute]);
        // this.drawNavPoints([this.currentRoute[this.currentRoute.length - 1]]);
        // this.currentRoute.forEach((item, i) => {
        //     this.allTime = (this.currentRoute.length - 1) * 1000;
        //     setTimeout(() => {
        //         this.setCameraPosition(item.x, item.y);
        //         this.drawCarPoint(item.x, item.y);
        //         this.currentTime = i * 1000;
        //     }, i * 1000);
        //
        //     if (i === this.currentRoute.length - 1) {
        //         setTimeout(() => {
        //             this.openEndTaskModal(taskId === null ? 'endAll' : 'endOne').then();
        //         }, i * 1000);
        //     }
        // });
    }

    public redirectToTab(): void {
        this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
    }

    public goToPosition(): void {
        this.isTrackPosition = true;
        this.position$
            .pipe(take(1), map(this.geoProjection.relativeConvert))
            .subscribe((pos) => this.setCameraPosition(pos.x, pos.y));
    }

    // TODO: execute on gestures from MapViewComponent
    public stopTrackPosition(): void {
        this.isTrackPosition = false;
    }

    private setCameraPosition(x: number, y: number): void {
        // TODO: send data to view
    }

    private drawSvg(): void {
        this.svg = d3.select(this.svgElement.nativeElement).append('svg');
        this.svg
            .attr('width', '100%')
            .attr('height', '100%');
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
                    .style('stroke-width', `0.3%`)
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
            componentProps: { type },
            backdropDismiss: false,
        });
        return await modal.present();
    }
}
