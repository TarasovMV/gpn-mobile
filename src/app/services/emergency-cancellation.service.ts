import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DialogModalComponent } from '../@shared/modals/dialog-modal/dialog-modal.component';
import { EmergencyCancellationModalComponent } from '../@shared/modals/emergancy-cancelation-modal/emergency-cancellation-modal.component';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class EmergencyCancellationService {
    constructor(
        public modalController: ModalController,
        public router: Router
    ) {}

    public async openEmergencyCancellationModal(): Promise<void> {
        const currentRoute = this.router.url;
        if (currentRoute.includes('/map')) {
            return;
        }
        const modal = await this.modalController.create({
            component: EmergencyCancellationModalComponent,
            cssClass: 'custom-modal resolve-modal',
            componentProps: {
                message: ' Вы закончили выполнение заданий?',
            },
        });
        return await modal.present();
    }
}
