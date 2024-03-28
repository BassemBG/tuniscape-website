import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject('API_URL_GET_IMAGE') public apiUrlGetImage: string
  ) {}
  products: any;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (res) => {
        console.log('All products: ', res);
        this.products = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  viewDetails(product: any) {
    //this.productService.setSelectedProduct(product);   this is deleted because id is passed in url
    this.router.navigate(['/product-details', product._id]);
  }
}
