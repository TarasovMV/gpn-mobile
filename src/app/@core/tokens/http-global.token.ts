import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * @description Global HttpClient token for provide to use Global Interceptors
 */
export const HTTP_GLOBAL: InjectionToken<HttpClient> = new InjectionToken<HttpClient>('Global HttpClient');
