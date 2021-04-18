import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController, PopoverController} from "@ionic/angular";
import {CarPopowerComponent} from "./components/car-popower/car-popower.component";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public loginForm: FormGroup = new FormGroup({
        login: new FormControl('', Validators.required),
        pass: new FormControl('', Validators.required),
    });

    private readonly nextUrl: string = 'tabs';

    constructor(
        public popoverController: PopoverController,
        private navCtrl: NavController,
    ) {}

    ngOnInit(): void {}

    public submit(e: Event): void {
        this.navCtrl.navigateRoot(this.nextUrl).then();
    }
}
