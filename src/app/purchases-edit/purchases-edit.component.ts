import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../product-add/product-add.model';
import { EditProduct } from './purchases-edit-model';

@Component({
  selector: 'app-purchases-edit',
  templateUrl: './purchases-edit.component.html',
  styleUrls: ['./purchases-edit.component.scss'],
})
export class PurchasesEditComponent  implements OnInit {

  productForm: FormGroup;
  imagePreview: string | null = null;
  private subscriptions: Subscription = new Subscription();
  itemData: Product;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
    private _productService: ProductService,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    this.itemData = this._productService.getItemData();
    this.formSetUp();
    this.imagePreview = this.itemData.image1;
  }

  formSetUp() {
    this.productForm = this.fb.group({
      name: [{value: this.itemData.name, disabled: true}],
      barcode: [{value: this.itemData.barcode, disabled: true}],
      image: [{value: this.itemData.image1, disabled: true}],
      
      stockAmount: [this.itemData.stockAmount, [Validators.required, Validators.min(0)]],
      unitPrice: [this.itemData.unitPrice, [Validators.required, Validators.min(0)]],
      purchasePrice: [this.itemData.purchasePrice, [Validators.required, Validators.min(0)]],
      bulkPrice: [this.itemData.bulkPrice, [Validators.required, Validators.min(0)]]
    });
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const loading = await this.loadingCtrl.create({ message: 'Updating product prices...' });
      await loading.present();

      try {
        const productData: EditProduct = {
          id: this.itemData.id,
          name: this.itemData.name,
          image: this.itemData.image1,
          createdDate: this.itemData.createdDate,
          lastUpdatedDate: new Date().toISOString(),
          categoryId: this.itemData.category,
          barcode: this.itemData.barcode,
          shortDescription: this.itemData.shortDescription,
          longDescription: this.itemData.longDescription,
          
          stockAmount: this .productForm.get('stockAmount').value,
          unitPrice: this.productForm.get('unitPrice').value,
          purchasePrice: this.productForm.get('purchasePrice').value,
          bulkPrice: this.productForm.get('bulkPrice').value
        };

        const updateApi = this._user.geteditproduct(productData).subscribe((response: any) => {
          console.log(response);
        });
        this.subscriptions.add(updateApi);

        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Product prices updated successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        
        setTimeout(() => {
          this.navCtrl.navigateForward('/purchasesdashboardmodule');
        }, 2000);
      } catch (error) {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Failed to update product prices. Please try again.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all required price fields correctly.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
