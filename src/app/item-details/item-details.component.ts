import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ItemService } from '../item.service';
import { Department } from '../department';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  //styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  @Input() departments: Department[];
  @Output() updateDepartmentItemList = new EventEmitter();

  itemForm = new FormGroup({
    Name: new FormControl(''),
    Description: new FormControl(''),
    Colour: new FormControl(''),
    Weight: new FormControl(''),
    IsStocked: new FormControl(0),
    DepartmentId: new FormControl('')
  });

  constructor(private itemService : ItemService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.itemService.addItem(this.itemForm.value)
      .subscribe(item => {
        this.updateDepartmentItemList.emit(item.DepartmentId);
        this.itemForm.reset();
      });
  }
}
