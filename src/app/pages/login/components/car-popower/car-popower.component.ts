import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { UserInfoService } from '../../../../services/user-info.service';
import { IVehicle } from '../../../../@core/model/vehicle.model';
import { ApiService } from '../../../../@core/services/api/api.service';

@Component({
    selector: 'app-car-popower',
    templateUrl: './car-popower.component.html',
    styleUrls: ['./car-popower.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarPopowerComponent implements OnInit {
    public carList$: BehaviorSubject<IVehicle[]> = new BehaviorSubject([]);
    private readonly nextUrl: string = 'tabs';

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        public userInfo: UserInfoService,
        private apiService: ApiService
    ) {}

    public chooseCar(i: number): void {
        this.userInfo.carNumber$.next(this.carList$.getValue()[i].regNum);
        this.userInfo.car$.next(this.carList$.getValue()[i]);
    }

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    public async accept() {
        this.navCtrl.navigateRoot(this.nextUrl).then();
        await this.userInfo.setWorkShift();
        this.dismiss();
    }

    async ngOnInit() {
        const cars = await this.apiService.getVehicles();
        this.carList$.next(cars);
    }
}
