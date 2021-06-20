import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';
import {NavController} from '@ionic/angular';
import Hammer from 'hammerjs';
import * as d3 from 'd3';

interface IMapConfig {
    width: number;
    height: number;
    initScale: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPage implements OnInit, AfterViewInit {
    @ViewChild('screen') screenRef: ElementRef;
    @ViewChild('svg') svgElement: ElementRef;

    width;
    height;

    public config: IMapConfig = {
        width: 411,
        height: 231.2,
        initScale: 10,
    };

    listener: Subject<any> = new Subject<any>();
    array = [];
    rotationOrigin = 0;
    rotation;
    zoomOrigin = 1;
    zoom;
    xOrigin = 0;
    yOrigin = 0;
    x = 0;
    y = 0;
    isPinch = false;
    isPan = false;

    xLast = 0;
    yLast = 0;
    xNew = 0;
    yNew = 0;
    xImage = 0;
    yImage = 0;

    xLastR = 0;
    yLastR = 0;
    xNewR = 0;
    yNewR = 0;
    xImageR = 0;
    yImageR = 0;

    point = {
        x: 0,
        y: 0,
    };

    carPoint: any;

    transformStyle: string;
    scaleStyle: string;
    mapStyle: string = 'transform: scale(' + this.config.initScale + ')';
    rotationStyle: string;
    pointStyle: string;

    private svg: any;

    private currentRoute: any[] = [
        {x: 195.5, y: 116},
        {x: 211, y: 116},
        {x: 211, y: 95}
    ];
    private position$: BehaviorSubject<any> = new BehaviorSubject<any>({x: 195.5, y: 135});

    constructor(
        public tabsService: TabsInfoService,
        private navCtrl: NavController,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.listener.subscribe(x => {
            this.scaleStyle = this.zoomHandler(x.scale);
            this.rotationStyle = this.rotationHandler(x.rotation, x);
            this.cdRef.detectChanges();
        });
    }

    ngAfterViewInit(): void {
        this.width = this.screenRef.nativeElement.clientWidth;
        this.height = this.screenRef.nativeElement.offsetHeight;
        this.init();
        this.drawSvg();
    }

    init(): void {
        const element = this.screenRef.nativeElement;
        const mc = new Hammer.Manager(element);
        const tap = new Hammer.Tap();
        const pinch = new Hammer.Pinch();
        const rotate = new Hammer.Rotate();
        const pan = new Hammer.Pan();

        pinch.recognizeWith(rotate);
        mc.add([pinch, rotate, pan, tap]);
        this.addListener(mc);
    }

    addListener(mc): void {
        this.cdRef.detectChanges();
        mc.on('pan', (x) => {
            if (this.isPinch || !this.isPan) {
                return;
            }
            this.positionHandler(x.deltaX, x.deltaY);
            this.transformStyle = `transform: translate(${this.x}px, ${this.y}px)`;
            this.cdRef.detectChanges();
        });

        mc.on('tap', (x) => {
            return;
            this.width = this.screenRef.nativeElement.offsetWidth;
            this.height = this.screenRef.nativeElement.offsetHeight;

            const angle = degToRad(-this.rotationOrigin);

            const cX = this.xImageR;
            const cY = this.yImageR;

            const prevCenterX = this.width / 2 - cX;
            const prevCenterY = this.height / 2 - cY;

            const nextCenterX = prevCenterX * Math.cos(angle) - prevCenterY * Math.sin(angle);
            const nextCenterY = prevCenterX * Math.sin(angle) + prevCenterY * Math.cos(angle);

            const dX = nextCenterX - prevCenterX;
            const dY = nextCenterY - prevCenterY;

            const xScreen = x.center.x - this.x - this.xNewR;
            const yScreen = x.center.y - this.y - this.yNewR;

            const xP = this.width / 2 - xScreen;
            const yP = this.height / 2 - yScreen;

            const testX = this.width / 2 - ((xP) * Math.cos(angle) - (yP) * Math.sin(angle)) + dX;
            const testY = this.height / 2 - ((xP) * Math.sin(angle) + (yP) * Math.cos(angle)) + dY;

            this.pointStyle = `left: ${testX}px; top: ${testY}px`;
            this.cdRef.detectChanges();
        });

        mc.on('panstart', (x) => {
            if (this.isPinch) {
                return;
            }
            this.isPan = true;
            this.cdRef.detectChanges();
        });

        mc.on('panend', (x) => {
            this.isPan = false;
            this.xOrigin = this.x;
            this.yOrigin = this.y;
            this.cdRef.detectChanges();
        });

        mc.on('pinch rotate', (x) => {
            this.listener.next(x);
        });

        mc.on('pinchend', ()  => {
            setTimeout(() => this.isPinch = false, 100);
            this.rotation = undefined;
            this.zoom = undefined;
            this.cdRef.detectChanges();
        });

        mc.on('pinchstart', (x)  => {
            this.isPinch = true;
            this.rotation = undefined;
            this.zoom = undefined;

            this.width = this.screenRef.nativeElement.offsetWidth;
            this.height = this.screenRef.nativeElement.offsetHeight;

            const angle = degToRad(-this.rotationOrigin);

            const cX = this.xImageR;
            const cY = this.yImageR;

            const prevCenterX = this.width / 2 - cX;
            const prevCenterY = this.height / 2 - cY;

            const nextCenterX = prevCenterX * Math.cos(angle) - prevCenterY * Math.sin(angle);
            const nextCenterY = prevCenterX * Math.sin(angle) + prevCenterY * Math.cos(angle);

            const dX = nextCenterX - prevCenterX;
            const dY = nextCenterY - prevCenterY;

            const xScreen = x.center.x - this.x - this.xNewR;
            const yScreen = x.center.y - this.y - this.yNewR;

            const xP = this.width / 2 - xScreen;
            const yP = this.height / 2 - yScreen;

            this.xImageR = this.width / 2 - ((xP) * Math.cos(angle) - (yP) * Math.sin(angle)) + dX;
            this.yImageR = this.height / 2 - ((xP) * Math.sin(angle) + (yP) * Math.cos(angle)) + dY;

            this.pointStyle = `left: ${this.xImageR}px; top: ${this.yImageR}px`;
            this.xNewR += (xScreen - this.xImageR);
            this.yNewR += (yScreen - this.yImageR);

            this.xImage += (xScreen - this.xLast) / this.zoomOrigin;
            this.yImage += (yScreen - this.yLast) / this.zoomOrigin;
            this.xNew = xScreen - this.xImage;
            this.yNew = yScreen - this.yImage;
            this.xLast = xScreen;
            this.yLast = yScreen;
            this.cdRef.detectChanges();
        });
    }

    rotationHandler(x, ev): string {
        if (this.rotation === undefined) {
            this.rotation = x;

            this.width = this.screenRef.nativeElement.offsetWidth;
            this.height = this.screenRef.nativeElement.offsetHeight;

            return this.rotationStyle;
        } else {
            const delta = x - this.rotation;
            this.rotationOrigin += delta;
            this.rotation = x;

            return `
                transform:
                    translate(${this.xNewR}px, ${this.yNewR}px)
                    rotate(${this.rotationOrigin}deg);
                transform-origin: ${this.xImageR}px ${this.yImageR}px;
            `;
        }
    }

    zoomHandler(x): string {
        if (this.zoom === undefined) {
            this.zoom = x;
            return this.scaleStyle;
        } else {
            const delta = x - this.zoom;
            this.zoomOrigin += delta * this.zoomOrigin;
            this.zoom = x;

            return `
                transform:
                    translate(${this.xNew}px, ${this.yNew}px)
                    scale(${this.zoomOrigin});
                transform-origin: ${this.xImage}px ${this.yImage}px;
            `;
        }
    }

    positionHandler(dx, dy): void {
        this.x = this.xOrigin + dx;
        this.y = this.yOrigin + dy;
    }

    // TODO: for easy get points on map (delete click event on prod)
    public trackPosition(ev: any): void {
        const spotX = ev.offsetX;
        const spotY = ev.offsetY;
        this.point = {
            x: spotX - 1,
            y: spotY - 1
        };

        console.log(this.point);
    }

    public redirectToTab(): void {
        this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
        this.tabsService.tasksCurrentTab$.next(1);
    }

    public goToPosition(): void {
        const pos = this.position$.getValue();
        this.setCameraPosition(pos.x, pos.y);
    }

    private setCameraPosition(x: number, y: number): void {
        this.transformStyle = '';
        this.scaleStyle = '';
        this.rotationStyle = '';

        this.x = 0;
        this.y = 0;
        this.xOrigin = 0;
        this.yOrigin = 0;

        const resX = (this.config.width / 2 - x) * this.config.initScale;
        const resY = (this.config.height / 2 - y) * this.config.initScale;
        this.mapStyle = `transform: translate(${resX}px, ${resY}px) scale(${this.config.initScale})`;
    }

    private drawSvg(): void {
        this.svg = d3.select(this.svgElement.nativeElement).append('svg');
        this.svg
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`);

        this.position$.subscribe(c => this.drawCarPoint(c.x, c.y));
        this.fakeDriving().then();
    }

    private async fakeDriving(): Promise<void> {
        const allTime = 15 * 1000;
        const dT = 30;
        const distance = this.getDistance([this.position$.getValue(), ...this.currentRoute]);
        const dS = distance / (allTime / dT);
        const routes = [...this.currentRoute];

        for (const route of routes) {
            const pos = [this.position$.getValue(), route];
            const powX = pos[1].x > pos[0].x ? 1 : -1;
            const powY = pos[1].y > pos[0].y ? 1 : -1;
            const tg = (pos[1].x - pos[0].x) / (pos[1].y - pos[0].y);
            const angle = Math.atan(tg);
            const dx = Math.sin(angle) * dS;
            const dy = Math.cos(angle) * dS;

            console.log({
                route,
                powX,
                powY,
                dx,
                dy
            });

            let stopCount = 1000;
            let flag = true;

            const promiseFn = (): Promise<any> => new Promise((resolve) => {
                stopCount--;
                if (stopCount < 0) {
                    console.error('loop');
                    flag = false;
                }
                const position = {
                    x: this.position$.getValue().x + powX * dx,
                    y: this.position$.getValue().y + powY * dy,
                };
                if (powY * (position.y - route.y) > 0 || powX * (position.x - route.x) > 0) {
                    this.position$.next(route);
                    flag = false;
                }
                this.position$.next(position);
                setTimeout(() => resolve(), 30);
            });

            while(flag) {
                await promiseFn();
            }
            this.currentRoute.splice(this.currentRoute.indexOf(route), 1);
        }
    }

    private drawRoute(coords: {x: number; y: number}[]): void {
        this.svg.selectAll('.nav-line').remove();
        coords.map((c, i, arr) => ({
            x1: c.x,
            x2: arr[i + 1]?.x,
            y1: c.y,
            y2: arr[i + 1]?.y
        })).filter(x => !!x.x2 && !!x.y2).forEach(l => {
            this.svg.append('line')
                .style('stroke', 'white')
                .style('stroke-width', .2)
                .style('stroke-dasharray', 1)
                .attr('class', 'nav-line')
                .attr('x1', l.x1)
                .attr('y1', l.y1)
                .attr('x2', l.x2)
                .attr('y2', l.y2);
        });
    }

    private drawNavPoints(coords: {x: number; y: number}[]): void {
        this.svg.selectAll('.nav-point').remove();
        coords.forEach(c => {
            this.svg
                .append('circle')
                .attr('r', 2)
                .attr('cx', c.x)
                .attr('cy', c.y)
                .attr('class', 'nav-point');
        });
    }

    private drawCarPoint(x: number, y: number) {
        this.drawRoute([{x, y}, ...this.currentRoute]);
        this.drawNavPoints([this.currentRoute[this.currentRoute.length - 1]]);
        this.svg.select('.car-point').remove();
        this.svg.append('circle')
            .attr('id', 999)
            .attr('r', 1)
            .attr('cx', x)
            .attr('cy', y)
            .attr('class', 'car-point');
        this.setCameraPosition(x, y);
    }

    private getDistance(coords: {x: number; y: number}[]): number {
        return coords.map((c, i, arr) => ({
            x1: c.x,
            x2: arr[i + 1]?.x,
            y1: c.y,
            y2: arr[i + 1]?.y
        })).filter(x => !!x.x2 && !!x.y2).map(l => Math.sqrt(Math.pow((l.x1 - l.x2), 2) + Math.pow((l.y1 - l.y2), 2)))
            .reduce((acc, next) => acc + next);
    }
}

const degToRad = (degrees) => degrees * (Math.PI / 180);
