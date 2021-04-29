import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'tabs',
        loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'map',
        loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule)
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: NoPreloading})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
