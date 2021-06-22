import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../@shared/shared.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {EndTaskComponent} from './end-task.component';

@NgModule({
  declarations: [EndTaskComponent],
  imports: [
      CommonModule,
      IonicModule,
      RouterModule.forChild([{path: '', component: EndTaskComponent}]),
      SharedModule,
      AngularSvgIconModule
  ]
})
export class EndTaskModule { }
