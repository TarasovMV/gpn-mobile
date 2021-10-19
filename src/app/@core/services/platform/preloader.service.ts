import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class PreloaderService {
    public isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

    constructor(public loadingController: LoadingController) {}

    public async activate(): Promise<void> {
        await this.presentLoadingWithOptions();
    }

    public async disable(): Promise<void> {
        await this.loadingController.dismiss();
    }

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'circular',
            cssClass: 'custom-loading',
        });
        await loading.present();
    }
}
