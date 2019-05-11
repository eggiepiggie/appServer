import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  // Return the class for font awesome that is associated
  // to the corresponding department.
  getDepartmentIcon(departmentName : string) {
    if (departmentName == "Seafood") {
      return "fa-fish";
    }
    else if (departmentName == "Fruit") {
      return "fa-apple-alt";
    }
    else if (departmentName == "Vegetables") {
      return "fa-carrot";
    }
    else if (departmentName == "Bakery") {
      return "fa-bread-slice";
    }
    else if (departmentName == "Beverage") {
      return "fa-coffee";
    }
    else if (departmentName == "Alcohol") {
      return "fa-wine-glass-alt";
    }
    else if (departmentName == "Meat") {
      return "fa-drumstick-bite";
    }
    else if (departmentName == "Dairy") {
      return "fa-cheese";
    }
    else if (departmentName == "Snacks") {
      return "fa-cookie";
    }
    else {
      return "fa-shopping-basket";
    }
  }

  // Returns the icon for change in trend or amount.
  getDeltaIcon(value : number) {
    if (value > 0) {
      return 'fa-caret-up';
    }
    else if (value < 0) {
      return 'fa-caret-down';
    }
    else {
      return 'fa-caret-right';
    }
  }
}
