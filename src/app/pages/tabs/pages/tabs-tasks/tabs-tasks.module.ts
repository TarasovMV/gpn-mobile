import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsTasksPage } from './tabs-tasks.page';
import { SharedModule } from '../../../../@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TabsTasksCardComponent } from './components/tabs-tasks-card/tabs-tasks-card.component';
import { TabsTasksTimerComponent } from './components/tabs-tasks-timer/tabs-tasks-timer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{ path: '', component: TabsTasksPage }]),
        SharedModule,
        AngularSvgIconModule,
    ],
    declarations: [
        TabsTasksPage,
        TabsTasksCardComponent,
        TabsTasksTimerComponent,
    ],
})
export class TabsTasksPageModule {}
