import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.scss'],
})
export class SimpleModalComponent implements OnInit {
    @Input() message: string;

    constructor(
        public modalController: ModalController
    ) { }

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    ngOnInit() {}

}
