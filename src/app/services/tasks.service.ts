import {Injectable} from "@angular/core";
import {ITasksItem} from "../pages/tabs/pages/tabs-tasks/tabs-tasks.page";

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    public currentTask: ITasksItem
}
