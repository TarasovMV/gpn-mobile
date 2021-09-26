import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { UserInfoService } from '../../../../services/user-info.service';
import { IVehicle } from '../../../../@core/model/vehicle.model';
import { ApiService } from '../../../../@core/services/api/api.service';
import { StatusBeginComponent } from '../../../../@shared/modals/status-begin/status-begin.component';

@Component({
    selector: 'app-car-popower',
    templateUrl: './car-popower.component.html',
    styleUrls: ['./car-popower.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarPopowerComponent implements OnInit {
    private readonly nextUrl: string = 'tabs';

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        public userInfo: UserInfoService,
        private apiService: ApiService
    ) {}

    public chooseCar(i: number): void {
        this.userInfo.car$.next(this.userInfo.carList$.getValue()[i]);
    }

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
        this.navCtrl.navigateRoot('/login').then();
    }

    public async accept() {
        await this.dismiss();
        await this.navCtrl.navigateRoot(this.nextUrl);
        if (this.userInfo.workShift$.getValue() === null) {
            await this.presentModalChooseStatus();
        } else {
            const workShiftId = this.userInfo.workShift$.getValue();
            const vehicleId = this.userInfo.car$.getValue().id;
            await this.apiService.changeVehicle({ workShiftId, vehicleId });
        }
    }

   ngOnInit() {}

    private async presentModalChooseStatus() {
        const modal = await this.modalController.create({
            component: StatusBeginComponent,
            backdropDismiss: false,
            cssClass: 'custom-modal choose-status',
        });
        return await modal.present();
    }
}
