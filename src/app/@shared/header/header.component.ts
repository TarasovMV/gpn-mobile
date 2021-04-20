import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AvatarModalComponent} from "../avatar-modal/avatar-modal.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
      public modalController: ModalController
  ) { }

  ngOnInit() {}

  public async openModal(e: Event): Promise<void> {
      this.presentModal().then();
  }

  private async presentModal() {
      const modal = await this.modalController.create({
          component: AvatarModalComponent,
          cssClass: 'avatar-modal'
      });
      return await modal.present();
  }
}
