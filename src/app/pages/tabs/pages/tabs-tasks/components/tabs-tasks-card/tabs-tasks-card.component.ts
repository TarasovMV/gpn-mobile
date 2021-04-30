import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ITasksItem} from '../../tabs-tasks.page';
import * as d3 from 'd3';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-tabs-tasks-card',
  templateUrl: './tabs-tasks-card.component.html',
  styleUrls: ['./tabs-tasks-card.component.scss'],
})
export class TabsTasksCardComponent implements OnInit, AfterViewInit {
    @Input() data: ITasksItem;
    @Input() isActive: boolean;
    @ViewChild('chart') chart: ElementRef;

    public svg: any;
    public percent$: BehaviorSubject<number> = new BehaviorSubject<number>(20);
    constructor() { }

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.drawSvg();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.drawSvg();
    }

    private drawSvg(): void {
        const size: number = Math.min(this.chart.nativeElement.clientWidth, this.chart.nativeElement.clientHeight);
        const innerR = 0.5 * size;
        const outerR = 0.5 * 0.94 * size;

        if (this.svg) {
            this.svg.remove();
        }

        this.svg = d3.select(this.chart.nativeElement).append('svg').attr('width', `${size}px`).attr('height', `${size}px`);

        const arcBg = (start: number, end: number) => d3.arc()
            .innerRadius(innerR)
            .outerRadius(outerR)
            .startAngle(-start * 2 * Math.PI)
            .endAngle(-end * 2 * Math.PI);


        const g: any = this.svg.append('g').style('transform', `translate(${size/2}px, ${size/2}px)`);

        g.append('path').attr('d', arcBg(0, 1))
            .style('fill', 'rgba(96, 101, 128, 0.25)');

        g.append('path').attr('d', arcBg(0, this.percent$.value / 100))
            .attr('class', 'arc');
    }
}
