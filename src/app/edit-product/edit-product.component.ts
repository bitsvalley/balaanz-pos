import { Component, OnInit } from '@angular/core';
import { EditProduct } from './edit-product-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../product-add/product-add.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent  implements OnInit {

  productForm: FormGroup;
    imagePreview: string | null = null;
    private subscriptions: Subscription = new Subscription();
    itemData : Product
    constructor(
      private fb: FormBuilder,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private _user: UserService,
      private _productServicr: ProductService,
      private navCtrl: NavController,
    ) {
      
    }
  
    ngOnInit() {
      this.itemData = this._productServicr.getItemData();
      this.formSetUp();
      this.imagePreview = this.itemData.image1
    }

    formSetUp(){
      this.productForm = this.fb.group({
        name: [this.itemData.name, [Validators.required, Validators.minLength(3)]],
        barcode: [this.itemData.barcode, [Validators.required, Validators.min(0)]], 
        
        image: [this.itemData.image1,''],
       
      });
     
    }
  
    
 async onImageSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    const fileSizeInKB = file.size / 1024; 

    if (fileSizeInKB > 700) {
      const toast = await this.toastCtrl.create({
        message: 'Image size must be less than or equal to 700 KB.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return; 
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.productForm.patchValue({ image: reader.result });
    };
    reader.readAsDataURL(file);
  }
}
    async onSubmit() {
      if (this.productForm.valid) {
        const loading = await this.loadingCtrl.create({ message: 'Adding product...' });
        await loading.present();
  
        try {
          const productData: EditProduct = {
            ...this.productForm.value,
            lastUpdatedDate: new Date().toISOString(),
            createdDate: this.itemData.createdDate,
            id: this.itemData.id,
            categoryId: this.itemData.category,
            stockAmount: this.itemData.stockAmount,
            // barcode: this.itemData.barcode,
            shortDescription: this.itemData.shortDescription,
            longDescription: this.itemData.longDescription,
            unitPrice: this.itemData.unitPrice
           
          };

          const loginApi = this._user.geteditproduct(productData).subscribe((response: any) => {
            console.log(response)
            
          },);
          this.subscriptions.add(loginApi);
  
  
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Product added successfully!',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          setTimeout(() => {
            this.navCtrl.navigateForward('/product');
          }, 2000);
          this.productForm.reset();
          this.imagePreview = null;
        } catch (error) {
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Failed to add product. Please try again.',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Please fill in all required fields correctly.',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
      }
    }
}
