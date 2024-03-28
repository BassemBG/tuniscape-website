import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = this.apiBaseUrl + 'products/';

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') private apiBaseUrl: string
  ) {}

  //selectedProduct: any;    this is deleted because id is passed in url
  cartProducts: any[] = [];
  productDirectlyBought: any;
  productsToBuy: any[] = [];
  //numberOfCartProducts: any;
  adminProductDetails: any;

  //this is used to show current quantity in header cart
  private totalNotifQuantity = 0;

  private cartQuantityNotifSubject = new BehaviorSubject<number>(0);
  cartQuantityNotif$ = this.cartQuantityNotifSubject.asObservable();

  //make api call to get all products from DB
  getAllProducts() {
    //const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');

    return this.http.get(this.url + 'getall',/* { headers }*/);
  }

  getProductById(id: any) {
    return this.http.get(this.url + 'getbyid/' + id);
  }

  deleteProduct(productId: String) {
    return this.http.delete(this.url + 'delete/' + productId);
  }

  addProduct(product: any) {
    return this.http.post(this.url + 'add', product);
  }

  updateProduct(productId : any, newProductData: any) {
    console.log(newProductData);
    
    return this.http.put(this.url + 'update/' + productId, newProductData);
  }

  //this is deleted because id is passed in url
  //used to get data to details components (product details)
  /*
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  getSelectedProduct(): any {
    return this.selectedProduct;
  }*/


  //used to get data to modify-product components (admin side)
  setAdminProductDetails(product: any) {
    this.adminProductDetails = product;
  }

  getAdminProductDetails(): any {
    return this.adminProductDetails;
  }

  //this is used when user modifies cartProducts in cart/view
  setCartProducts(modifiedCartProducts: any) {
    this.totalNotifQuantity = 0;
    this.cartProducts = modifiedCartProducts;
    console.log('modified: ', modifiedCartProducts);
    let newQuantity = 0;
    for (const cartProduct of modifiedCartProducts) {
      console.log('product modified : ', cartProduct);

      newQuantity += cartProduct['quantity'];      
    }
    this.updateCartQuantityNotif(newQuantity);
  }

  // quantityModif is 1 or -1
  modifycartProductQuantity(arrayIndex: any, quantityModif: any) {
    this.cartProducts[arrayIndex].quantity += quantityModif;
    this.cartProducts[arrayIndex].totalPrice +=
      quantityModif * this.cartProducts[arrayIndex].price;
    this.updateCartQuantityNotif(quantityModif);
  }

  //used to let any component add to cart from anywhere to the same variable that is shared
  addCartProduct(cartProduct: any) {
    //check if product is already in cart
    const productIndexes: number[] = this.findProductIndexesById(
      this.cartProducts,
      cartProduct._id
    );
    console.log('product indexes : ', productIndexes);

    if (productIndexes.length != 0) {
      console.log('product is already in cart');
      var productIdWithSameSize: number = NaN;
      //if exists, we update quantity if same size is added, else add another object of size and relative quantity

      const sizeToAdd = cartProduct['size'];
      //get already added size
      for (let index = 0; index < productIndexes.length; index++) {
        const alreadyAddedCartProduct = this.cartProducts[index];
        const alreadyAddedSize = alreadyAddedCartProduct['size'];
        if (alreadyAddedSize == sizeToAdd) {
          console.log('existing size : ', alreadyAddedSize);
          productIdWithSameSize = index;
          break;
        }
      }

      //if the same size, only update quantity
      if (!Number.isNaN(productIdWithSameSize)) {
        console.log(
          'product id to change quantity of: ',
          productIdWithSameSize
        );
        let quantity = cartProduct['quantity'];
        this.cartProducts[productIdWithSameSize]['quantity'] += quantity;
        this.cartProducts[productIdWithSameSize]['totalPrice'] +=
          quantity * this.cartProducts[productIdWithSameSize]['price'];
        //else add it as an independant object
      } else {
        this.cartProducts.push(cartProduct);
      }
    } else {
      // product doesn't exist, simply add it to array
      console.log("product isn't already in cart");

      this.cartProducts.push(cartProduct);
    }
    this.updateCartQuantityNotif(cartProduct['quantity']);
    console.log('cart products : ', this.cartProducts);
  }

  updateCartQuantityNotif(newQuantity: number): void {
    this.totalNotifQuantity += newQuantity;
    this.cartQuantityNotifSubject.next(this.totalNotifQuantity);
  }

  resetCartQuantityNotif(): void {
    this.totalNotifQuantity = 0;
    this.cartQuantityNotifSubject.next(this.totalNotifQuantity);
  }

  getCartProductById(cartProductId: string) {
    return this.cartProducts.find((product) => product._id === cartProductId);
  }

  getAllCartProducts() {
    return this.cartProducts;
  }

  resetCartProducts() {
    this.cartProducts = [];
    this.resetCartQuantityNotif();
  }

  //helper function -> returns product index if exists
  findProductIndexesById(productList: any[], productId: number): number[] {
    const matchingIndexes: number[] = [];
    for (let i = 0; i < productList.length; i++) {
      if (productList[i]._id === productId) {
        matchingIndexes.push(i);
      }
    }
    return matchingIndexes;
  }

  //this function adds products that will be finally bought
  //(user went from cart page to checkout page, so we need to transfer products and keep them in a variable)
  setProductsToBuy(productsToBuy: any[]) {
    this.productsToBuy = productsToBuy;
  }

  getProductsToBuy() {
    return this.productsToBuy;
  }

  //this is used to reset after successfully buying
  resetProductsToBuy() {
    this.productsToBuy = [];
  }
}
