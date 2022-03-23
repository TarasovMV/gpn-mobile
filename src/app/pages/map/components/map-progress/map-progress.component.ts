import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { TabsInfoService } from '../../../../services/tabs/tabs-info.service';
import { SimpleModalComponent } from '../../../../@shared/modals/simple-modal/simple-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-map-progress',
    templateUrl: './map-progress.component.html',
    styleUrls: ['./map-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapProgressComponent implements OnInit {
    @Input() name: string;
    @Input() percent = 0;
    @Input() time: number;
    @Input() msg: string = '';

    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController
    ) {}

    ngOnInit(): void {}

    private async presentModal() {
        if (!this.msg) {
            return;
        }
        const modal = await this.modalController.create({
            componentProps: {
                message: this.msg,
            },
            component: SimpleModalComponent,
            cssClass: 'custom-modal text-modal',
        });
        return await modal.present();
    }
}
