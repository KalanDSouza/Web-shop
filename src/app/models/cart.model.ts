// Cart interfacee focuses on the overall cart object, describing its structure and properties
export interface Cart {
    items: Array<CartItem>;
}
// CartItem interface focuses on individual items in the cart
export interface CartItem{
    product: string;
    name: string;
    price: number;
    quantity: number;
    id: number;
}