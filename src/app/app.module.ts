import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItemComponent } from './item/item.component';
import { SearchComponent } from './search/search.component';
import { DepartmentComponent } from './department/department.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { ItemService } from './item.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DepartmentComponent,
    ItemComponent,
    ItemDetailsComponent,
    SearchComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [FormBuilder, ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
