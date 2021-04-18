import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PopoverController} from "@ionic/angular";
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
    constructor(public popoverController: PopoverController) {}

    ngOnInit() {

    }

    public submit(e: any): void {
    }

}
