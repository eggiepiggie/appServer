import { Component, OnInit } from '@angular/core';

import { ItemService } from '../item.service';
import { Department } from '../department';
import { Item } from '../item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  //styleUrls: ['../../../static/dist/tailwind.css']
})
export class ItemComponent implements OnInit {

  departmentItemsLength: number;

  departments: Department[];
  departmentItems: Item[];

  constructor(private itemService : ItemService) { }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.itemService.getDepartments()
      .subscribe(departments => this.departments = departments);
  }
  onDepartmentClicked(departmentId: number) {
    this.itemService.getItemsByDepartmentId(departmentId)
      .subscribe(items => {
        this.departmentItems = items;
        this.departmentItemsLength = items.length;
      });
  }

  itemAdded(departmentId: number) {
    this.getDepartments();
    this.onDepartmentClicked(departmentId);
  }
}
