import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart= new BehaviorSubject<Cart>({ items:[]})
  // BehaviorSubject initial value  is set to an empty cart object with an empty array for the items property. allowing BehaviorSubject to emit and store updates to the shopping cart's state. subscribers can access the current value of the cart.

  constructor(private _snackBar: MatSnackBar) { }
  // private property named _snackBar of type MatSnackBar 
  // constructor of the CartService class is injected with the MatSnackBar service as a dependency

//----ADD TO CART
  addToCart(item: CartItem): void{
    // recieves cart item
    const items = [...this.cart.value.items];
    //creates a new array items that contains all the existing items in the shopping cart

    const itemInCart = items.find((_item) => _item.id === item.id);
    //find if the item added to cart already exists in the items array
    if (itemInCart){
      itemInCart.quantity += 1;
    } 
    // if it does exist, add to the quantity of that item 
    else{
      items.push(item);
    }
    // if not, add the item to the cart

    this.cart.next({items});
    //updates the BehaviorSubject named cart with the new array of items. 
    this._snackBar.open('1 item added to cart.', 'Ok', {duration: 3000});
    //opens a notification for 3000 miliseconds
  }

//----REMOVE Quantity
  removeQuantity(item: CartItem): void{
    let itemForRemoval: CartItem | undefined; 
    // used to keep track of an item that should be removed if quantity = 0

    let filteredItems = this.cart.value.items.map((_item) => {
      // iterates through each item in the shopping cart and uses _item to target each item

      if (_item.id === item.id) {
        _item.quantity--;
          //Check if the current item matches the specified item (by comparing their IDs), If matching item found, decrease its quantity by one.
        if(_item.quantity === 0)
          itemForRemoval = _item;
      }
      
      return _item;
    });

    if (itemForRemoval){
      filteredItems = this.removeFromCart(itemForRemoval, false); 
    }
    //set the update value to fasle to prevent form sending multiple notifications
    
    this.cart.next({ items: filteredItems }); 
    //update the cart with filtered items
    this._snackBar.open('1 item removed from cart.','Ok', {
      duration: 3000
    });
  }

//----GET TOTAL
  getTotal(items: Array<CartItem>): number{
// return a number
    return items
    .map((item) => item.price * item.quantity) 
    // method creates a new array where each element is the total of each item (result of price * quantity)
    .reduce((prev, current) => prev + current, 0);
    // method calculates the grand total by itereating through the array and adding the previous total to the current one, if empty return 0
  }

  //CLEAR CART
  clearCart():void{
    this.cart.next({items: []});
    this._snackBar.open('Cart is cleared.','Ok',{
      duration: 3000
    });
  }

  //REMOVE FROM CART
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items //get the array of items in the shopping cart
    .filter((_item) => _item.id !== item.id) //Create a new array (filteredItems) by filtering out the item that matches the specified item's ID.
    //if true the item is included in the new filteredItems array otherwise not included
    if(update){
      this.cart.next({items : filteredItems});
      //updates the shopping cart with the filteredItems array,
        this._snackBar.open('1 item removed from cart', 'Ok', {
      duration: 3000
      });
    }
    return filteredItems;
  }
}
