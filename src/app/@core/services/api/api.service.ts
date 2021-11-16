import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../platform/app-config.service';
import {IUser, IUserCredentials} from '../../model/user.model';
import {IVehicle} from "../../model/vehicle.model";
import {ITask, ITaskData} from "../../model/task.model";
import {
    ISetWorkShift,
    IWorkShift,
    IWorkShiftEnd,
    IWorkShiftStatus,
    IWorkShiftVehicle
} from "../../model/workshift.model";
import {IStatusInfo} from "../../../@shared/avatar-modal/avatar-modal.component";
import {UserInfoService} from "../../../services/user-info.service";
import {PreloaderService} from "../platform/preloader.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly restUrl: string;

    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService,
        private preloader: PreloaderService,
    ) {
        this.restUrl = appConfigService.getAttribute('restUrl');
    }

    public async userAuth(cred: IUserCredentials): Promise<IUser> {
        return await this.http.post<IUser>(`${this.restUrl}/api/auth`, cred).toPromise();
    }

    public async getVehicles(): Promise<IVehicle[]> {
        return await this.http.get<IVehicle[]>(`${this.restUrl}/api/Vehicle/free`).toPromise();
    }

    public async getVehicleById(id: number): Promise<IVehicle> {
        return await this.http.get<IVehicle>(`${this.restUrl}/api/Vehicle/${id}`).toPromise();
    }

    public async getWorkShift(userId: number): Promise<IWorkShift> {
        return await this.http
            .get<IWorkShift>(`${this.restUrl}/api/WorkShift/user/${userId}`)
            .toPromise();
    }

    public async setWorkShift(params: ISetWorkShift): Promise<IWorkShift> {
        await this.preloader.activate();
        const res = await this.http.post<IWorkShift>(`${this.restUrl}/api/WorkShift`, params).toPromise();
        await this.preloader.disable();
        return res;
    }
    public async endWorkShift(params: {userId: number}): Promise<IWorkShiftEnd> {
        return await this.http.post<IWorkShiftEnd>(`${this.restUrl}/api/WorkShift/finish`, params).toPromise();
    }

    public async changeStatus(param: IWorkShiftStatus): Promise<{id: number; state: string}> {
        return await this.http.post<{id: number; state: string}>(`${this.restUrl}/api/WorkShift/status`, param).toPromise();
    }

    public getCurrentStatus(userId: number): Observable<{id: number; state: string}> {
        return this.http.get<{id: number; state: string}>(`${this.restUrl}/api/WorkShift/status/${userId}`);
    }

    public async getStatusList(): Promise<IStatusInfo[]> {
        return await this.http.get<IStatusInfo[]>(`${this.restUrl}/api/DriverState`).toPromise();
    }

    public async changeVehicle(param: IWorkShiftVehicle): Promise<IWorkShift> {
        return await this.http.put<IWorkShift>(`${this.restUrl}/api/WorkShift/vehicle`, param).toPromise();
    }
}
