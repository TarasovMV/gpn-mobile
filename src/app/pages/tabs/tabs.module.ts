import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {SharedModule} from '../../@shared/shared.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ChooseTaskOverlayComponent} from './pages/tabs-tasks/components/choose-task-overlay/choose-task-overlay.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TabsPageRoutingModule,
        SharedModule,
        AngularSvgIconModule,
    ],
  declarations: [TabsPage, ChooseTaskOverlayComponent]
})
export class TabsPageModule {}
