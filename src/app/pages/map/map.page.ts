import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { filter} from 'rxjs/operators';
import {TabsInfoService} from "../../services/tabs/tabs-info.service";
import {ModalController, NavController} from "@ionic/angular";

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
    @ViewChild('map') mapRef: ElementRef;
    listener: Subject<any> = new Subject<any>();
    array = [];
    transformStyle: string;
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

    constructor(
        public tabsService: TabsInfoService,
        private navCtrl: NavController
    ) {}

    ngOnInit(): void {
        this.listener.pipe(filter((x, i) => i % 1 === 0)).subscribe(x => {
            this.array.push(x);
            if (this.array.length > 10) {
                this.array.shift();
            }
            this.rotationHandler(x.rotation);
            this.zoomHandler(x.scale);
            this.transformStyle = `transform: scale(${this.zoomOrigin}) translate(${this.x}px, ${this.y}px)`;
            this.rotationStyle = `transform: rotate(${this.rotationOrigin}deg)`;
        });
    }

    ngAfterViewInit(): void {
        this.init();
    }

    init(): void {
        // const element = this.mapRef.nativeElement;
        // const mc = new Hammer.Manager(element);
        // const pinch = new Hammer.Pinch();
        // const rotate = new Hammer.Rotate();
        // const pan = new Hammer.Pan();
        //
        // pinch.recognizeWith(rotate);
        // mc.add([pinch, rotate, pan]);
        // // mc.add([pan]);
        //
        // mc.on('pan', (x) => {
        //     if (this.isPinch || !this.isPan) {
        //         return;
        //     }
        //     this.positionHandler(x.deltaX, x.deltaY);
        //     this.transformStyle = `transform: scale(${this.zoomOrigin}) translate(${this.x}px, ${this.y}px)`;
        // });
        //
        // mc.on('panstart', (x) => {
        //     if (this.isPinch) {
        //         return;
        //     }
        //     this.isPan = true;
        // });
        //
        // mc.on('panend', (x) => {
        //     this.isPan = false;
        //     this.xOrigin = this.x;
        //     this.yOrigin = this.y;
        // });
        //
        // mc.on('pinch rotate', (x) => {
        // // mc.on('pan', (ev) => {
        //     this.listener.next(x);
        // });
        //
        // mc.on('pinchend', ()  => {
        //     setTimeout(() => this.isPinch = false, 100);
        //     this.rotation = undefined;
        //     this.zoom = undefined;
        // });
        //
        // mc.on('pinchstart', ()  => {
        //     this.isPinch = true;
        //     this.rotation = undefined;
        //     this.zoom = undefined;
        // });
    }

    rotationHandler(x): void {
        if (this.rotation === undefined) {
            this.rotation = x;
        } else {
            const delta = x - this.rotation;
            this.rotationOrigin += delta;
            this.rotation = x;
        }
    }

    zoomHandler(x): void {
        if (this.zoom === undefined) {
            this.zoom = x;
        } else {
            const delta = x - this.zoom;
            this.zoomOrigin += delta;
            this.zoom = x;
        }
    }

    positionHandler(dx, dy): void {
        // / Math.cos(this.rotationOrigin * Math.PI / 180);
        this.x = (this.xOrigin + dx / this.zoomOrigin);
        this.y = (this.yOrigin + dy / this.zoomOrigin);
    }

    public redirectToTab(): void {
        this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
        this.tabsService.tasksCurrentTab$.next(1);
    }
}
