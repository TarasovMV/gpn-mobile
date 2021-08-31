import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface IAppConfig {
    restUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private appConfig: IAppConfig;

    constructor(private http: HttpClient) {}

    public async loadAppConfig(): Promise<void> {
        this.appConfig = await this.http.get<IAppConfig>('assets/config.json').toPromise();
    }

    public getAttribute(key: keyof IAppConfig): IAppConfig[typeof key] {
        if (!this.appConfig) {
            console.error('Config file not found');
        }
        return this.appConfig[key];
    }
}

export const appConfigInit = (appConfigService: AppConfigService) => async () => await appConfigService.loadAppConfig();
