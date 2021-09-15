import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './@core/guards/authentication.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./pages/login/login.module').then((m) => m.LoginPageModule),
    },
    {
        path: 'tabs',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
            import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'map',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
            import('./pages/map/map.module').then((m) => m.MapPageModule),
    },
    {
        path: 'nfc',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
            import('./pages/nfc-verify/nfc-verify.module').then(
                (m) => m.NfcVerifyModule
            ),
    },
    {
        path: 'end-task',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
            import('./pages/end-task/end-task.module').then(
                (m) => m.EndTaskModule
            ),
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
