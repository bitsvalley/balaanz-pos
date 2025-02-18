import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { UserService } from '../shared/services/user.service';
import { GlobalService } from '../shared/services/global.service'; 
import { ToastrService } from 'ngx-toastr'; 
import { Subscription } from 'rxjs'; 

import { Category, Product } from './product-add.model'; 

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit, OnDestroy {
  isNavOpen: boolean = false;
  isAccountOpen: boolean = false;
  cartAnimation: boolean = false;
  categoryList: any[] = [];
  selelctedCategory: any = null;
  searchProductField: any;
  products: Product[] = [];

  trendingProducts: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTrendingProducts();
  }

  ionViewWillEnter() {
    this.loadTrendingProducts();
  }

  loadTrendingProducts() {
    this.loading = true;
    this.error = null;

    this.trendingProducts = [
      {
        id: 1,
        price: 19.99,
        name: "Product 1",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P001",
        barcode: "123456789012",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 2,
        price: 29.99,
        name: "Product 2",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P002",
        barcode: "123456789013",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 3,
        price: 39.99,
        name: "Product 3",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P003",
        barcode: "123456789014",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 4,
        price: 49.99,
        name: "Product 4",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P004",
        barcode: "123456789015",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 5,
        price: 59.99,
        name: "Product 5",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P005",
        barcode: "123456789016",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 6,
        price: 69.99,
        name: "Product 6",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P006",
        barcode: "123456789017",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 7,
        price: 79.99,
        name: "Product 7",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P007",
        barcode: "123456789018",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 8,
        price: 89.99,
        
        name: "Product 8",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P008",
        barcode: "123456789019",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      }
    ];

    this.categoryList = [
      {
        id: 1,
        price: 19.99,
        name: "Product 1",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P001",
        barcode: "123456789012",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 2,
        price: 29.99,
        name: "Product 2",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P002",
        barcode: "123456789013",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 3,
        price: 39.99,
        name: "Product 3",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P003",
        barcode: "123456789014",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 4,
        price: 49.99,
        name: "Product 4",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P004",
        barcode: "123456789015",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 5,
        price: 59.99,
        name: "Product 5",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P005",
        barcode: "123456789016",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 6,
        price: 69.99,
        name: "Product 6",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P006",
        barcode: "123456789017",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 7,
        price: 79.99,
        name: "Product 7",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P007",
        barcode: "123456789018",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      },
      {
        id: 8,
        price: 89.99,
        
        name: "Product 8",
        image: 'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
        code: "P008",
        barcode: "123456789019",
        category: 0,
        stockAmount: 0,
        shortDescription: '',
        online: false,
        active: false,
        msrp: 0
      }
    ];

    this.loading = false;
  }

  handleRefresh(event: any) {
    this.loadTrendingProducts();
    event.target.complete();
  }

  goToProductDetail(product: Product) {
    this.navCtrl.navigateForward(`/product-detail/${product.id}`);
  }

  editProduct(product: Product, event: Event) {
    this.navCtrl.navigateForward('/editproduct');
    event.stopPropagation(); 
    this.globalService.addToCart(product, this.userService.getCurrentUserId());
    this.toastr.success(`${product.name} added to cart`);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  toggleAccount() {
    this.isAccountOpen = !this.isAccountOpen;
  }

  closeNav() {
    this.isNavOpen = false;
  }

  closeAccount() {
    this.isAccountOpen = false;
  }

  openCart() {
    this.navCtrl.navigateForward('/newproductadd');
  }

  logout() {
    this.userService.logout(this.userService.getCurrentUserId()).subscribe(() => {
      this.navCtrl.navigateRoot('home');
    });
  }

  showAllProducts() {
    this.selelctedCategory = null;
    this.isNavOpen = false;
    console.log('Showing all products');
  }

  selectCategory(category: Category) {
    this.selelctedCategory = category;
    this.isNavOpen = false;
    console.log(`Selected category: ${category.name}`);
  }


  changeSearch() {
    // Just rely on the ngModel value and filter the products accordingly
    if (this.searchProductField.trim() === '') {
      this.products = [...this.trendingProducts]; // Reset to the original list if search is empty
    } else {
      this.products = this.trendingProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchProductField.toLowerCase())
      );
    }
  }
  
}