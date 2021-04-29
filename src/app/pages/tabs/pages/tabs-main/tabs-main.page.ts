import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {MAIN_PAGE_DATA} from './mock';
import * as d3 from 'd3';
import {NavController} from '@ionic/angular';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

export interface IDiagram {
    total: number;
    sections: IDiagramSections[];
}
export interface IDiagramSections {
    name: string;
    value: number;
    color: string;
}

@Component({
    selector: 'app-tabs-main',
    templateUrl: './tabs-main.page.html',
    styleUrls: ['./tabs-main.page.scss'],
})

export class TabsMainPage implements OnInit, IPageTab, AfterViewInit {
    @ViewChild('chart') chart: ElementRef;
    public route: PageTabType = 'main';
    public svg: any;
    readonly diagramData$: BehaviorSubject<IDiagram> = new BehaviorSubject<IDiagram>(MAIN_PAGE_DATA);

    constructor(
        private navCtrl: NavController,
        private tabsService: TabsInfoService
    ) {}

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.drawSvg(this.diagramData$.value);
    }

    ngOnInit() {
        this.tabsService.diagramData$.subscribe(val => {
            this.diagramData$.next(val);
        });
    }

    ngAfterViewInit() {
        this.drawSvg(this.diagramData$.value);
    }

    public redirectToTab(tabName: string): void {
        switch (tabName) {
            case 'В работе':
                this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
                this.tabsService.tasksCurrentTab$.next(1);
                return;
            case 'Новые':
                this.navCtrl.navigateRoot('/tabs/tabs-tasks').then();
                this.tabsService.tasksCurrentTab$.next(0);
                return;
            case 'Выполнены':
                this.navCtrl.navigateRoot('tabs/tabs-ready').then();
                return;
            default:
                return;
        }
    }

    private drawSvg(data: IDiagram): void {
        const size: number = Math.min(this.chart.nativeElement.clientWidth, this.chart.nativeElement.clientHeight);
        const innerR = 0.43 * size;
        const outerR = 0.43 * 0.92 * size;

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

        let startPos = 0;
        let endPos = 0;
        data.sections.forEach((section, i) => {
            if (i > 0) {
                startPos += data.sections[i-1]?.value / data.total;
            }
            endPos = startPos + section.value / data.total;
            g.append('path').attr('d', arcBg(startPos, endPos))
                .style('fill', section.color);
        });
    }
}
