import { PriceHistory } from './priceHistory';
import { StockLevel } from './stockLevel';
import { PurchaseItemList } from './purchaseItemList';

export class Item {
  Id : number;
  Name : string;
  Description : string;
  Colour : string;
  Weight : number;
  IsStocked : boolean;
  DepartmentId : number;
  PriceHistoryList : PriceHistory[] = [];
  StockLevelList : StockLevel[] = [];
  PurchaseItemListList : PurchaseItemList[] = [];
}

