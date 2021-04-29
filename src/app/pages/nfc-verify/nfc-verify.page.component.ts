import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from "@ionic/angular";
import {TasksService} from "../../services/tasks.service";
import {ITasksItem} from "../tabs/pages/tabs-tasks/tabs-tasks.page";
import {VerifyModalComponent} from "./components/verify-modal/verify-modal.component";
import {CarPopowerComponent} from "../login/components/car-popower/car-popower.component";
import {AvatarModalComponent} from "../../@shared/avatar-modal/avatar-modal.component";

@Component({
  selector: 'app-nfc-verify.page',
  templateUrl: './nfc-verify.page.component.html',
  styleUrls: ['./nfc-verify.page.component.scss'],
})
export class NfcVerifyPage implements OnInit {

    public currentTask: ITasksItem = null;

  constructor(
      private navCtrl: NavController,
      private modalCtrl: ModalController,
      private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.currentTask = this.tasksService.currentTask;
  }

  public async openModal() {
      const modal = await this.modalCtrl.create({component: VerifyModalComponent, cssClass: 'nfc-verify-modal'});
      await modal.present();
  }

  public async enableNfc() {
     this.openModal().then();
  }

  public back() {
    this.navCtrl.back();
  }
}
