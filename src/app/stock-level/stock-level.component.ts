import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ItemService } from '../item.service';
import { UiService } from '../ui.service';

import { Item } from '../item';

@Component({
  selector: 'app-stock-level',
  templateUrl: './stock-level.component.html',
  styleUrls: ['./stock-level.component.css']
})
export class StockLevelComponent implements OnInit {

  allItems: Item[];
  currentItem: Item;
  currentPrice: number;
  currentPriceDelta: number;
  currentDateDeltaInDays: number;
  currentAvgPrice: number;
  currentStock: number;
  currentAvgStock: number;

  stockLevelForm = new FormGroup({
    Count: new FormControl('', [Validators.required, Validators.min(0)]),
    NextShipment: new FormControl('', [Validators.required]),
    ItemId: new FormControl('', [Validators.required, Validators.min(0)])
  });

  constructor(private itemService : ItemService, private uiService : UiService) {
  }

  ngOnInit() {
    this.itemService.getItems().subscribe(
      items => this.allItems = items
    );
  }

  setText(item: Item) {
    this.currentItem = item;
    this.calculatePriceChange();
    this.calculateStockLevel();
    this.stockLevelForm.patchValue({
      "ItemId": item.Id
    });
  }

  /**
   * Gets the price delta from the last price change.
   * Gets the number of day since last price changed.
   */
  calculatePriceChange() {

    if (!this.currentItem) {
      return;
    }
    else if (this.currentItem.PriceHistoryList.length < 2) {
      this.currentPrice = 0;
      this.currentAvgPrice = 0;
      return;
    }

    let arrayLength = this.currentItem.PriceHistoryList.length;
    let priceHistory1 = this.currentItem.PriceHistoryList[arrayLength - 1];
    let priceHistory2 = this.currentItem.PriceHistoryList[arrayLength - 2];

    // Get price difference.
    this.currentPrice = priceHistory1.Price;
    this.currentPriceDelta = priceHistory1.Price - priceHistory2.Price;

    let date1 = new Date(priceHistory1.Date).getTime();
    let date2 = new Date(priceHistory2.Date).getTime();

    // Gets number of days since last price difference.
    let diffTime = Math.abs(date1 - date2);
    this.currentDateDeltaInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // Calculate the average for the price of current item.
    this.currentAvgPrice = this.currentItem.PriceHistoryList.reduce((sum, priceEntry) => sum + priceEntry.Price, 0);
    this.currentAvgPrice = this.currentAvgPrice / arrayLength;
  }

  calculateStockLevel() {

    if (!this.currentItem) {
      return;
    }
    else if (this.currentItem.StockLevelList.length < 1) {
      this.currentStock = 0;
      this.currentAvgStock = 0;
      return;
    }

    let arrayLength = this.currentItem.StockLevelList.length;
    this.currentStock = this.currentItem.StockLevelList[arrayLength - 1].Count;

    this.currentAvgStock = this.currentItem.StockLevelList.reduce((sum, stockEntry) => sum + stockEntry.Count, 0);
    this.currentAvgStock = this.currentAvgStock / arrayLength;
  }
}
