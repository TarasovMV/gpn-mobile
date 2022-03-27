import { Injectable } from '@angular/core';
import { ITaskData } from '../../model/task.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {HTTP_CACHE_HEADER, HttpCachingService} from '../http-caching.service';


interface IReason {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class TasksApiService {
    private readonly restUrl: string = environment.restUrl;
    constructor(
        private http: HttpClient,
        private httpCachingService: HttpCachingService,
    ) {}

    // Получить задачи
    public async getTasks(userId: number): Promise<ITaskData> {
        return await this.http
            .get<ITaskData>(`${this.restUrl}/api/Task/driver/${userId}`)
            // .get<ITaskData>(`assets/mock.json`)
            .toPromise();
    }

    // Прервать задачу
    public async failTask(
        taskId: number,
        body: {
            taskDeclineReasonId: number;
            comment: string;
        }
    ): Promise<boolean> {
        try {
            const id = this.httpCachingService.getNextId();
            let headers = new HttpHeaders();
            headers = headers.append(HTTP_CACHE_HEADER, id.toString());
            await this.http
                .put<void>(`${this.restUrl}/api/Task/${taskId}/fail`, body, {headers})
                .toPromise();
            return true;
        } catch (e) {
            return false;
        }
    }

    // Завершить задачу
    public async finalizeTask(taskId: number, body: unknown): Promise<boolean> {
        try {
            const id = this.httpCachingService.getNextId();
            let headers = new HttpHeaders();
            headers = headers.append(HTTP_CACHE_HEADER, id.toString());
            await this.http
                .put<void>(`${this.restUrl}/api/Task/${taskId}/finalize`, body, {headers})
                .toPromise();
            return true;
        } catch (e) {
            return false;
        }
    }

    // Проверить метку
    public async finalizeAllTasks(body: {
        userId: number;
        position: string;
    }): Promise<{ taskNumber: number; prodObjName: string }[]> {
        try {
            return await this.http
                .post<{ taskNumber: number; prodObjName: string }[]>(
                    `${this.restUrl}/api/Task/finalize`,
                    body
                )
                .toPromise();
        } catch (e) {
            return null;
        }
    }

    // Получить причины завершение
    public async getReasonsList(): Promise<IReason[]> {
        try {
            return await this.http
                .get<IReason[]>(`${this.restUrl}/api/TaskFailReason`)
                .toPromise();
        } catch (e) {
            console.error(e);
        }
    }
}
