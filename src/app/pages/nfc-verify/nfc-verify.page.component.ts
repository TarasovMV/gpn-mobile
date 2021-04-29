import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";
import {TasksService} from "../../services/tasks.service";
import {ITasksItem} from "../tabs/pages/tabs-tasks/tabs-tasks.page";

@Component({
  selector: 'app-nfc-verify.page',
  templateUrl: './nfc-verify.page.component.html',
  styleUrls: ['./nfc-verify.page.component.scss'],
})
export class NfcVerifyPage implements OnInit {

    public currentTask: ITasksItem = null;

  constructor(
      private navCtrl: NavController,
      private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.currentTask = this.tasksService.currentTask;
  }

  public back() {
    this.navCtrl.back();
  }
}
