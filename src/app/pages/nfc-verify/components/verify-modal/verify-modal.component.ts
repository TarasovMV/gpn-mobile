import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-verify-modal',
    templateUrl: './verify-modal.component.html',
    styleUrls: ['./verify-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyModalComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
