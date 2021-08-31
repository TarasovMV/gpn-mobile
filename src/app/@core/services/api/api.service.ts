import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../platform/app-config.service';
import {IUser, IUserCredentials} from '../../model/user.model';
import {IVehicle} from "../../model/vehicle.model";
import {ITask} from "../../model/task.model";
import {IWorkShift, IWorkShiftStatus, IWorkShiftVehicle} from "../../model/workshift.model";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly restUrl: string;

    constructor(
        private http: HttpClient,
        appConfigService: AppConfigService,
    ) {
        this.restUrl = appConfigService.getAttribute('restUrl');
    }

    public async userAuth(cred: IUserCredentials): Promise<IUser> {
        return await this.http.post<IUser>(`${this.restUrl}/api/auth`, cred).toPromise();
    }

    public async getTasks(userId: number): Promise<ITask[]> {
        return await this.http.get<ITask[]>(`${this.restUrl}/api/Task/driver/${userId}`).toPromise();
    }

    public async getVehicles(): Promise<IVehicle[]> {
        return await this.http.get<IVehicle[]>(`${this.restUrl}/api/Vehicle/free`).toPromise();
    }

    public async changeStatus(param: IWorkShiftStatus): Promise<IWorkShift> {
        return await this.http.put<IWorkShift>(`${this.restUrl}/api/WorkShift/status`, param).toPromise();
    }

    public async changeVehicle(param: IWorkShiftVehicle): Promise<IWorkShift> {
        return await this.http.put<IWorkShift>(`${this.restUrl}/api/WorkShift/vehicle`, param).toPromise();
    }
}
