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

  masterOptionState: boolean = false;
  currentItemsLength: number;
  currentDepartmentId: number;

  departments: Department[];
  departmentItems: Item[];
  displayItems: Item[];
  currentItemStates: any = {};
  searchText: string = "";

  enableListFunction: boolean = false;

  constructor(private itemService : ItemService) { }

  ngOnInit() {
    this.getDepartments();
  }

  // Retrieves all the departments.
  getDepartments() {
    this.itemService.getDepartments()
      .subscribe(departments => this.departments = departments);
  }

  setItemsToDisplay() {
    if (this.searchText != "") {
      this.displayItems = this.departmentItems.filter(item => item.Name.toLowerCase().match(this.searchText.toLowerCase()));
    }
    else {
      this.displayItems = this.departmentItems;
    }
    this.clearItemStates();
  }

  clearItemStates() {
    this.masterOptionState = false;
    this.displayItems.forEach(item => {
      this.currentItemStates[item.Id] = this.masterOptionState;
    });
    this.currentItemsLength = this.displayItems.length;
    this.enableListFunction = this.getCurrentItemStatesById().length == 0 ? false : true;
  }

  getCurrentItemStatesById() {
    return Object.keys(this.currentItemStates).filter(item => this.currentItemStates[item] == true);
  }

  // Updates the states of all the items' checkboxes.
  masterOptionChanged() {
    Object.keys(this.currentItemStates).forEach(key => 
      this.currentItemStates[key] = this.masterOptionState
    );
    this.enableListFunction = this.getCurrentItemStatesById().length == 0 ? false : true;
  }

  // Updates the checkbox state of current item.
  updateSelectedItem(itemId) {
    this.currentItemStates[itemId] = !this.currentItemStates[itemId];
    this.enableListFunction = this.getCurrentItemStatesById().length == 0 ? false : true;
  }

  // Retrieves all the items for the current department.
  onDepartmentClicked(departmentId: number) {
    this.currentDepartmentId = departmentId;
    this.itemService.getItemsByDepartmentId(this.currentDepartmentId)
      .subscribe(items => {
        this.departmentItems = items;
        this.setItemsToDisplay();
      });
  }

  onDeleteClicked() {
    this.getCurrentItemStatesById().forEach(key => {
      this.itemService.deleteItem(Number(key)).subscribe(result => {
        this.onDepartmentClicked(this.currentDepartmentId);
      });
    });
  }

  // Searches through the list of items.
  searchList() {
    if (this.searchText == "") {
      this.onDepartmentClicked(this.currentDepartmentId);
    } else {
      this.setItemsToDisplay();
    }
  }
}
