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
  title: String = '';
  ngOnInit(): void {

    //keep listening if navbar click happens to re-render
    this.productService.getSelectedProductType().subscribe((type) => {
      if (type) {
        switch (type) {
          case "clothing":
            this.title = "Tuniscape Products";
            break;
          case "merch":
            this.title = "Tuniscape Collabs";
            break;
          case "accessories":
            this.title = "Tuniscape Accessories";
            break;
        
          default:
            break;
        }
        this.productService.getProductsByType(type).subscribe(
          (products) => {
            this.products = products;
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.productService.getAllProducts().subscribe(
          (products) => {
            this.products = products;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });

  }

  viewDetails(product: any) {
    //this.productService.setSelectedProduct(product);   this is deleted because id is passed in url
    this.router.navigate(['/product-details', product._id]);
  }
}
