import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';


const ROWS_HEIGHT:{ [id:number]: number}={ 1:400, 3:335, 4:350 };
  // this is an objects of row height, where the key (id) is of type number and the values are also of type number

@Component({
  selector: 'app-home',
  //Allows the component to be acceessible to HTML files
  templateUrl: './home.component.html',
  // specifies the file tat contains the components template
})

export class HomeComponent implements OnInit, OnDestroy {
  //exports the type script class 
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  // this determines the row height based off the current instance of cols ex. cols is 2 -> rowHeight = ROW_HEIGHT[2]
  category: string | undefined; 
  // if you leave the value with no value you need to put undeffiend
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productsSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private storeService: StoreService){ }
  //dependency injection
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void{
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  onColumnsCountChange(colsNum: number): void{
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }
  // updates the values based on user interaction
  onShowCategory(newCategory: string): void{
    this.category = newCategory;
    this.getProducts();
  } 
  onAddToCart(product: Product): void{
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
    // converts a Product object into a Cart Item object and then using the cartService to add the item to the shopping cart. 
  }
  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
    //updating count variable 
  }
  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
    //updateing count variable 
  }
  ngOnDestroy(): void {
    if(this.productsSubscription){
      this.productsSubscription.unsubscribe();
    }
  }
}
