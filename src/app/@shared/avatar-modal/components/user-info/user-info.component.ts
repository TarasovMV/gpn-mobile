import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserInfoService } from '../../../../services/user-info.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Output() onChangeUser = new EventEmitter<boolean>();
  @Output() onChangeCar = new EventEmitter<boolean>();
  public isOpened = false;
  constructor(
    private navCtrl: NavController,
    public userInfo: UserInfoService
  ) {}

  public changeUser(): void {
    this.onChangeUser.emit(true);
  }

  public openDropdown(): void {
    this.isOpened = !this.isOpened;
  }

  public chooseStatus(i: number): void {
    this.userInfo.statusIndex$.next(i);
  }


  public changeCar(): void {
    this.onChangeCar.emit(true);
  }

  ngOnInit() {}
}
