import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl(''),
    Colour: new FormControl('', [Validators.required]),
    Weight: new FormControl('', [Validators.required, Validators.min(0)]),
    IsStocked: new FormControl(0),
    DepartmentId: new FormControl('', [Validators.required, Validators.min(0)])
  });

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.itemService.addItem(this.itemForm.value)
      .subscribe(item => {
        this.updateDepartmentItemList.emit(item.DepartmentId);
        this.resetForm();
      });
  }

  resetForm() {
    this.itemForm.reset({
      IsStocked: 0
    });
  }
}
