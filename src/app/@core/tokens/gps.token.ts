import {InjectionToken} from '@angular/core';
import {IGpsService} from '../model/gps.model';

export const GPS = new InjectionToken<IGpsService>('GPS token');
