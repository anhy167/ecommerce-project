import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProdductService } from 'src/app/services/prodduct.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;

  constructor(
    private productService: ProdductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the symbol "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else this.currentCategoryId = 1;

    this.productService.getProductList(this.currentCategoryId).subscribe((data) => {
      this.products = data;
    });
  }
}
