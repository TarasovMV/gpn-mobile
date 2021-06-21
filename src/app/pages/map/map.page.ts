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
import {Subject} from 'rxjs';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';
import {NavController} from '@ionic/angular';
import Hammer from 'hammerjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPage implements OnInit, AfterViewInit {
    @ViewChild('screen') screenRef: ElementRef;

    width;
    height;

    listener: Subject<any> = new Subject<any>();
    array = [];
    transformStyle: string;
    scaleStyle: string;
    rotationStyle: string;
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
    lastAngle = 70;

    pointStyle: string;

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
            console.log(`w: ${this.x}, h: ${this.y}`);
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

    public redirectToTab(): void {
        this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
        this.tabsService.tasksCurrentTab$.next(1);
    }
}

const degToRad = (degrees) => degrees * (Math.PI / 180);

