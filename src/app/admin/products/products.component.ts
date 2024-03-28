import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any;
  constructor(private productService: ProductService, private router: Router) {}

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

  deleteProduct(productId: String) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The selected product will be deleted from the website.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          (res) => {
            console.log('Deleted: ', res);
            this.products = this.products.filter(
              (product: any) => product._id !== productId
            );
          },
          (err) => {
            console.log(err);
          }
        );
        Swal.fire({
          title: 'Deleted!',
          text: 'Your product has been deleted from the website.',
          icon: 'success',
        });
      }
    });
  }

  goToAddPage() {
    this.router.navigate(['admin/products/add']);
  }

  goToModifyPage(product: any) {
    this.productService.setAdminProductDetails(product);
    this.router.navigate(['admin/products/modify', product._id]);
  }
}
