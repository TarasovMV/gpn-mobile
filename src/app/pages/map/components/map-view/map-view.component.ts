import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ThemeService} from '../../../../@core/services/platform/theme.service';
import Hammer from 'hammerjs';

const degToRad = (degrees) => degrees * (Math.PI / 180);
type MapDetail = 'min' | 'medium' | 'max';
interface IMapConfig {
    width: number;
    height: number;
    initScale: number;
}

@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, AfterViewInit {
    @Output() onGesture: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public set setPosition(value: {x: number; y: number} | undefined) {
        if (!!value) {
            this.setCameraPosition(value.x, value.y);
        }
    }
    @Input() public set setScreenRef(value: ElementRef) {
        if (!value) {
            return;
        }
        this.screenRef = value;
        this.width = value.nativeElement.clientWidth;
        this.height = value.nativeElement.offsetHeight;
        this.config = {
            width: this.width,
            height: (405 / 720) * this.width,
            initScale: 7,
        };
        this.mapStyle = 'transform: scale(' + this.config.initScale + ')';
        this.init();
    }
    public readonly mapDetail$: BehaviorSubject<MapDetail> = new BehaviorSubject<MapDetail>('medium');
    public mapStyle: string;
    public transformStyle: string;
    public scaleStyle: string;
    public rotationStyle: string;
    // public pointStyle: string; // TODO: clear

    private screenRef: ElementRef;
    private readonly listener$: Subject<any> = new Subject<any>();

    private width;
    private height;
    private config: IMapConfig = null;

    private rotationOrigin = 0;
    private rotation;
    private zoomOrigin = 1;
    private zoom;
    private xOrigin = 0;
    private yOrigin = 0;
    private x = 0;
    private y = 0;
    private isPinch = false;
    private isPan = false;

    private xLast = 0;
    private yLast = 0;
    private xNew = 0;
    private yNew = 0;
    private xImage = 0;
    private yImage = 0;

    private xLastR = 0;
    private yLastR = 0;
    private xNewR = 0;
    private yNewR = 0;
    private xImageR = 0;
    private yImageR = 0;

    constructor(
        public theme: ThemeService,
        private cdRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.listener$.subscribe((x) => {
            this.scaleStyle = this.zoomHandler(x.scale);
            this.rotationStyle = this.rotationHandler(x.rotation, x);
            this.cdRef.detectChanges();
        });
    }

    ngAfterViewInit(): void {
    }

    private init(): void {
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

    private addListener(mc): void {
        this.cdRef.detectChanges();
        mc.on('pan', (x) => {
            if (this.isPinch || !this.isPan) {
                return;
            }
            this.positionHandler(x.deltaX, x.deltaY);
            this.transformStyle = `transform: translate(${this.x}px, ${this.y}px)`;
            this.cdRef.detectChanges();
            this.onGesture.emit(true);
        });

        // TODO: clear test code
        // mc.on('tap', (x) => {
        //     return;
        //     this.width = this.screenRef.nativeElement.offsetWidth;
        //     this.height = this.screenRef.nativeElement.offsetHeight;
        //
        //     const angle = degToRad(-this.rotationOrigin);
        //
        //     const cX = this.xImageR;
        //     const cY = this.yImageR;
        //
        //     const prevCenterX = this.width / 2 - cX;
        //     const prevCenterY = this.height / 2 - cY;
        //
        //     const nextCenterX =
        //         prevCenterX * Math.cos(angle) - prevCenterY * Math.sin(angle);
        //     const nextCenterY =
        //         prevCenterX * Math.sin(angle) + prevCenterY * Math.cos(angle);
        //
        //     const dX = nextCenterX - prevCenterX;
        //     const dY = nextCenterY - prevCenterY;
        //
        //     const xScreen = x.center.x - this.x - this.xNewR;
        //     const yScreen = x.center.y - this.y - this.yNewR;
        //
        //     const xP = this.width / 2 - xScreen;
        //     const yP = this.height / 2 - yScreen;
        //
        //     const testX =
        //         this.width / 2 -
        //         (xP * Math.cos(angle) - yP * Math.sin(angle)) +
        //         dX;
        //     const testY =
        //         this.height / 2 -
        //         (xP * Math.sin(angle) + yP * Math.cos(angle)) +
        //         dY;
        //
        //     this.pointStyle = `left: ${testX}px; top: ${testY}px`;
        //     this.cdRef.detectChanges();
        // });

        mc.on('panstart', (x) => {
            if (this.isPinch) {
                return;
            }
            this.isPan = true;
            this.cdRef.detectChanges();
            this.onGesture.emit(true);
        });

        mc.on('panend', (x) => {
            this.isPan = false;
            this.xOrigin = this.x;
            this.yOrigin = this.y;
            this.cdRef.detectChanges();
            this.onGesture.emit(true);
        });

        mc.on('pinch rotate', (x) => {
            this.listener$.next(x);
            this.onGesture.emit(true);
        });

        mc.on('pinchend', () => {
            setTimeout(() => (this.isPinch = false), 100);
            this.rotation = undefined;
            this.zoom = undefined;
            this.cdRef.detectChanges();
            this.onGesture.emit(true);
        });

        mc.on('pinchstart', (x) => {
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

            const nextCenterX =
                prevCenterX * Math.cos(angle) - prevCenterY * Math.sin(angle);
            const nextCenterY =
                prevCenterX * Math.sin(angle) + prevCenterY * Math.cos(angle);

            const dX = nextCenterX - prevCenterX;
            const dY = nextCenterY - prevCenterY;

            const xScreen = x.center.x - this.x - this.xNewR;
            const yScreen = x.center.y - this.y - this.yNewR;

            const xP = this.width / 2 - xScreen;
            const yP = this.height / 2 - yScreen;

            this.xImageR =
                this.width / 2 -
                (xP * Math.cos(angle) - yP * Math.sin(angle)) +
                dX;
            this.yImageR =
                this.height / 2 -
                (xP * Math.sin(angle) + yP * Math.cos(angle)) +
                dY;

            // this.pointStyle = `left: ${this.xImageR}px; top: ${this.yImageR}px`;
            this.xNewR += xScreen - this.xImageR;
            this.yNewR += yScreen - this.yImageR;

            this.xImage += (xScreen - this.xLast) / this.zoomOrigin;
            this.yImage += (yScreen - this.yLast) / this.zoomOrigin;
            this.xNew = xScreen - this.xImage;
            this.yNew = yScreen - this.yImage;
            this.xLast = xScreen;
            this.yLast = yScreen;
            this.cdRef.detectChanges();
            this.onGesture.emit(true);
        });
    }

    private rotationHandler(x, ev): string {
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

    private zoomHandler(x): string {
        if (this.zoom === undefined) {
            this.zoom = x;
            return this.scaleStyle;
        } else {
            const delta = x - this.zoom;
            if (this.zoomOrigin + delta * this.zoomOrigin < .5) {
                this.zoomOrigin = .5;
            } else {
                this.zoomOrigin += delta * this.zoomOrigin;
            }
            this.zoom = x;

            if (this.zoomOrigin > 1.8) {
                this.mapDetail$.next('max');
            } else if (this.zoomOrigin > 0.9) {
                this.mapDetail$.next('medium');
            } else {
                this.mapDetail$.next('min');
            }

            return `
                transform:
                    translate(${this.xNew}px, ${this.yNew}px)
                    scale(${this.zoomOrigin});
                transform-origin: ${this.xImage}px ${this.yImage}px;
            `;
        }
    }

    private positionHandler(dx, dy): void {
        this.x = this.xOrigin + dx;
        this.y = this.yOrigin + dy;
    }

    private setCameraPosition(x: number, y: number): void {
        this.transformStyle = '';
        this.scaleStyle = '';
        this.rotationStyle = '';

        this.x = 0;
        this.y = 0;
        this.xOrigin = 0;
        this.yOrigin = 0;

        const resX = (50 - x) * this.config.initScale;
        const resY = (50 - y) * this.config.initScale;
        this.mapStyle = `transform: translate(${resX}%, ${resY}%) scale(${this.config.initScale})`;
    }
}
