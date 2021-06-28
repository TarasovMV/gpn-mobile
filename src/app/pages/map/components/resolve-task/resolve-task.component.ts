import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {ICoord} from '../../../tabs/pages/tabs-tasks/tabs-tasks.page';

@Component({
  selector: 'app-resolve-task',
  templateUrl: './resolve-task.component.html',
  styleUrls: ['./resolve-task.component.scss'],
})
export class ResolveTaskComponent implements OnInit {
    @Input() type: 'endAll' | 'endOne' | 'new';
    @Input() coord: ICoord;
    constructor(
        public modalController: ModalController,
        public tabsService: TabsInfoService,
        private navCtrl: NavController
    ) { }

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async accept(): Promise<void> {
        if (this.type === 'new') {
            this.navCtrl.navigateRoot('tabs/tabs-tasks').then();

            const newTasks = this.tabsService.newItems$.value;
            newTasks.unshift(    {
                num: 'В ЕЛК',
                manufacture: 'В ЕЛК',
                tare: 11,
                test: 11,
                startPoint: {x: 323 / 720 * 1000, y: 277 / 405 * 1000},
                routes: [
                    {x: 323 / 720 * 1000, y: 278 / 405 * 1000},
                    {x: 323 / 720 * 1000, y: 278 / 405 * 1000},
                    {x: 449 / 720 * 1000, y: 278 / 405 * 1000},
                    {x: 449 / 720 * 1000, y: 286 / 405 * 1000},
                    {x: 449 / 720 * 1000, y: 286 / 405 * 1000},
                    {x: 451 / 720 * 1000, y: 286 / 405 * 1000},
                ],
                specialProps: ['elk', 'last']
            });
            newTasks.unshift({
                num: '№115626',
                manufacture: 'Л-35-11-100',
                tare: 8,
                test: 8,
                startPoint: this.coord,
                routes: [{x: this.coord.x, y: 276 / 405 * 1000}],
                specialProps: ['new'],
                testList: [
                    {
                        name: ' Бензин кат. риформ. Л-35/11-1000',
                        val: 2
                    }
                ]
            });
            this.tabsService.newItems$.next(newTasks);
            await this.dismiss();
        }
        else if (this.type === 'endOne') {
            await this.dismiss();
            this.navCtrl.navigateRoot('/nfc').then();
            this.tabsService.currentTab$.next(0);
        }
        else if (this.type === 'endAll') {
            this.tabsService.currentTab$.next(0);
            this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
            await this.dismiss();
        }
    }

    ngOnInit() {}
}
