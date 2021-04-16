import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'tabs-main',
        pathMatch: 'full',
    },
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'tabs-main',
                loadChildren: () => import('./pages/tabs-main/tabs-main.module').then(m => m.TabsMainPageModule)
            },
            {
                path: 'tabs-tasks',
                loadChildren: () => import('./pages/tabs-tasks/tabs-tasks.module').then(m => m.TabsTasksPageModule)
            },
            {
                path: 'tabs-ready',
                loadChildren: () => import('./pages/tabs-ready/tabs-ready.module').then(m => m.TabsReadyPageModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'tabs-main',
        pathMatch: 'full',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
