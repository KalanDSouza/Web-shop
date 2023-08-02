import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
// This property represents the overall shopping cart object.
export class CartComponent implements OnInit{
  cart: Cart = {
    items: [{
      product: 'https://via.placeholder.com/150',
      name: 'snickers',
      price: 150,
      quantity: 1,
      id: 1,
    },
    {
      product: 'https://via.placeholder.com/150',
      name: 'snickers',
      price: 200,
      quantity: 2,
      id: 2,
    }
    ],

  }

  // This property is used to store and manage a list of cart items.
  dataSource: Array<CartItem> = [];
  // This property defines the columns to be displayed in the table.
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total', 
    'action'
  ];

  constructor(private cartService: CartService, private http: HttpClient){ }

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  // loops through the items to get the grand total
  getTotal(items: Array<CartItem>): number{
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void{
    this.cartService.removeFromCart(item);
  }

  onAddQuantity (item: CartItem): void{
    this.cartService.addToCart(item);
  }
  onRemoveQuantity (item: CartItem): void{
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http.post('http://localhost:4242/checkout',{
      items: this.cart.items //sends cart items to stripe
    }).subscribe(async(res:any) => { 
      let stripe = await loadStripe('pk_test_51NNi7iBuYeW1xxhdiE99edKF3scCZaRXagQlu5t4IuQzQttjFTwDBltptJ4s1ILYRWWOC3siDzXV0B5NxKF97eG5005JbFAxKa');
      stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    });
  }
  // sends a post requst to the local server to create a stripie session with items in cart, the user is then redirected to the stripe check out page to complete the payment process
     
}