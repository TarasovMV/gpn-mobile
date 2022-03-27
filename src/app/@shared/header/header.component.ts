import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AvatarModalComponent} from '../avatar-modal/avatar-modal.component';
import {ThemeService} from '../../@core/services/platform/theme.service';
import {UserInfoService} from '../../@core/services/user-info.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    @Input() withThemeSwitch = false;

    constructor(
        public theme: ThemeService,
        public userInfo: UserInfoService,
        private modalController: ModalController,
    ) {
    }

    public async openModal(e: Event): Promise<void> {
        this.presentModal().then();
    }

    public toggleSwitch(): void {
        this.theme.changeTheme();
    }

    private async presentModal() {
        const modal = await this.modalController.create({
            component: AvatarModalComponent,
            cssClass: 'avatar-modal',
            showBackdrop: false
        });
        return await modal.present();
    }
}
