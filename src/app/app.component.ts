import { Component, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart, CartItem } from './models/cart.model';

@Component({
  selector: 'app-root',
  template: `
  <app-header [cart]= "cart"></app-header>
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  cart: Cart = { items: [] };

  constructor(private cartService: CartService){
    
  }
  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      // listens for changes/updates in the shopping cart data
      this.cart = _cart;
      // when updated the value emitted by the shopping cart (_cart) is assigned to the cart property of the AppComponent
    });
  }
}
