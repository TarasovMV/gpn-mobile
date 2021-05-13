import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AvatarModalComponent} from '../avatar-modal/avatar-modal.component';
import {BehaviorSubject} from 'rxjs';
import {ThemeServiceService} from '../../services/theme-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @Input() withThemeSwitch = false;

    constructor(
      public modalController: ModalController,
      public theme: ThemeServiceService
    ) { }

    ngOnInit() {}

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
