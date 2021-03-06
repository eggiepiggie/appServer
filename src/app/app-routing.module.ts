import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { DepartmentComponent }  from './department/department.component';
import { ItemComponent }        from './item/item.component';
import { StockLevelComponent }  from './stock-level/stock-level.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'departments', component: DepartmentComponent },
  { path: 'items', component: ItemComponent },
  { path: 'stockLevels', component: StockLevelComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}