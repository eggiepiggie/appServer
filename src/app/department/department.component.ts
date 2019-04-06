import { Component, OnInit } from '@angular/core';

import { ItemService } from '../item.service';
import { Department } from '../department';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  //styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments: Department[];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemService.getDepartments()
      .subscribe(departments => this.departments = departments);
  }

}
