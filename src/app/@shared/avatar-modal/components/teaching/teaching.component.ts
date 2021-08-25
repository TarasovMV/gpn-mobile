import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {VIDEOFILES} from './mock';

export interface IVideoList {
    src: string;
    name: string;
    preview: string;
    duration: string;
}

@Component({
  selector: 'app-teaching',
  templateUrl: './teaching.component.html',
  styleUrls: ['./teaching.component.scss'],
})

export class TeachingComponent implements OnInit {
    @ViewChild('video', {static: true}) private videoElement: ElementRef;
    public currentVideoId: number = 0;
    public videos$: BehaviorSubject<IVideoList[]> = new BehaviorSubject<IVideoList[]>(VIDEOFILES);
    public isPaused: boolean = true;

    constructor() { }

    ngOnInit() {}

    public showVideo(idx: number) {
        this.currentVideoId = idx;
        this.isPaused = true;
    }
}
