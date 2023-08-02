import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
 
})
export class HeaderComponent{
  private _cart: Cart = { items: []};
  itemsQuantity = 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart){
    this._cart = cart;
  // sets the cart to the value of private cart 

    this.itemsQuantity = cart.items
    .map((item) => item.quantity)
    .reduce((prev, current) => prev + current, 0);
  } 
//  to keep the itemsQuantity property in sync with the Cart object provided by the parent component.

  constructor(private cartService: CartService){}

  getTotal(items: Array<CartItem>): number{
    return this.cartService.getTotal(items);
  }

  onClearCart(){
    this.cartService.clearCart();
  }
}    
