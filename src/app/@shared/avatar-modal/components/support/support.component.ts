import {Component, Inject, OnInit} from '@angular/core';
import {HTTP_GLOBAL} from "../../../../@core/tokens";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserInfoService} from "../../../../services/user-info.service";
import {AppConfigService} from "../../../../@core/services/platform/app-config.service";

interface ISelectOption {
    id: number;
    value: string;
}

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
    public data: ISelectOption[] = [];
    public dropdownList: string[] = [];
    public currentValueId: number = 0;
    public textValueId: number;
    public message: string = '';
    public get isDisableSend(): boolean {
        return !(this.currentValueId !== this.textValueId || !!this.message);
    }

    private readonly restUrl: string;

    constructor(
        @Inject(HTTP_GLOBAL) private http: HttpClient,
        private userInfo: UserInfoService,
        appConfig: AppConfigService,
    ) {
        this.restUrl = appConfig.getAttribute('supportUrl');
    }

    public changeDropdownValue(idx: number): void {
        this.currentValueId = this.data[idx].id;
    }

    async ngOnInit(): Promise<void> {
        const reasons = await this.getTechReasons();
        this.dropdownList = reasons.map(x => x.value);
        this.data = reasons;
    }

    public async getTechReasons(): Promise<ISelectOption[]> {
        const reasons = await this.http.get<{id: number; name: string}[]>(
            `${this.restUrl}/mobile_v1/TechSupport/get_tech_support_message`
        ).toPromise();
        this.textValueId = reasons.find(x => x.name.toLowerCase() === 'другое').id;
        return reasons.map(x => ({id: x.id, value: x.name}));
    }

    public async sendSupport(): Promise<void> {
        let params: HttpParams = new HttpParams()
            .set('login', this.userInfo.currentUser.userId)
            .set('id_tech', this.currentValueId);
        if (!!this.message) {
            params = params.append('message', this.message);
        }
        await this.http
            .post(
                `${this.restUrl}/mobile_v1/TechSupport/set_oper_techsupport_message`,
                {},
                {params}
            )
            .toPromise();
        this.message = '';
    }
}
