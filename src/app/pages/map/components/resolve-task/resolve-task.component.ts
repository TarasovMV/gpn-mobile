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
                startPoint: {x: 312 / 720 * 1000, y: 276 / 405 * 1000},
                routes: [
                    {x: 449 / 720 * 1000, y: 276 / 405 * 1000},
                    {x: 449 / 720 * 1000, y: 285 / 405 * 1000},
                ],
                specialProps: ['elk', 'last']
            });
            newTasks.unshift({
                num: '№115626',
                manufacture: 'АТ-7',
                tare: 8,
                test: 8,
                startPoint: this.coord,
                routes: [{x: this.coord.x, y: 276 / 405 * 1000}],
                specialProps: ['new']
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
            const selected = this.tabsService.selectedItems$.value;
            this.tabsService.deliveredItems$.next(selected);
            this.tabsService.selectedItems$.next([]);
            this.tabsService.currentTab$.next(1);
            this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
            await this.dismiss();
        }
    }

    ngOnInit() {}
}
