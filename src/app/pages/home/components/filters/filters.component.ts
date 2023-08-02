import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit, OnDestroy{

  @Output() showCategory = new EventEmitter<string>(); 
// emits the an instance of the string to the parent component
  categoriesSubscription: Subscription | undefined;
  categories: Array<string> | undefined;

  constructor(private storeService: StoreService){ }

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService.getAllCategories() //fetches categories from the server
    .subscribe((response: Array<string>) => { //returns an observerable that is subscribed to, When the response is received from the server, the callback function in subscribe is executed.
      this.categories = response; // updates the component's data with the received categories
    });
  }
  onShowCategory(category: string): void{
// recieves category and retuens nothing
    this.showCategory.emit(category);
// emit value
  }

  ngOnDestroy(): void {
    if(this.categoriesSubscription){//checks if the categories subsription exists and is not null
      this.categoriesSubscription.unsubscribe(); //then unsubscribes form the observable to prevent memory leaks
    }

  }
}
