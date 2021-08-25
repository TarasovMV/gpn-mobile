import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ModalController, NavController} from '@ionic/angular';
import {UserInfoService} from '../../../../services/user-info.service';

@Component({
  selector: 'app-car-popower',
  templateUrl: './car-popower.component.html',
  styleUrls: ['./car-popower.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarPopowerComponent implements OnInit {
    public carList$: BehaviorSubject<string[]>
        = new BehaviorSubject(['А330АА50', 'А332АА50', 'Е331АА50', 'М333BП50', 'К333АА50', 'С334АА50', 'П333АА50', 'А333АА50']);
    private readonly nextUrl: string = 'tabs';

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        public userInfo: UserInfoService
    ) { }

    public chooseCar(i: number): void {
        this.userInfo.carNumber$.next(this.carList$.value[i]);
    }

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    public accept() {
        this.navCtrl.navigateRoot(this.nextUrl).then();
        this.dismiss();
    }

    ngOnInit() {}
}
