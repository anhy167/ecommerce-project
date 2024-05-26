import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode: boolean = false;

  // new properties of pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we a key word different than previous
    // then set thePageNumber to 1

    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword= ${theKeyword}, thePageNumber=${this.thePageNumber}`);
    

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
    
  }

  handleListProduct() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the symbol "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else this.currentCategoryId = 1;

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is being viewd

    // if we have a different category id than previous
    // then set the page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId= ${this.currentCategoryId}, thePageNumber= ${this.thePageNumber}`);

    this.productService
      .getProductListPaginate(this.thePageNumber - 1,
                              this.thePageSize,
                              this.currentCategoryId)
      .subscribe(this.processResult());
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, unit price: ${theProduct.unitPrice}`);
    
    // TODO
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
    
  } 

  updatePageSize(pageSize: string) {
    this.thePageSize= +pageSize!;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data : any)=> {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
}
