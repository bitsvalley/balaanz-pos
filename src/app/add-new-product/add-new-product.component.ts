import { Component, OnInit } from '@angular/core';
import { AddNewProduct } from './add-new-product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent  implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
   private subscriptions: Subscription = new Subscription(); 

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
  ) {
    

   this.productForm = this.fb.group({
  orgId: [null, Validators.required],  
  name: [null, [Validators.required, Validators.minLength(3)]],
  createdBy: [null],  
  lastUpdatedBy: [null],
  createdDate: [null],
  lastUpdatedDate: [null],

  productCategory: this.fb.group({
    id: [null],  
    orgId: [null],
    name: [null, Validators.required],
    description: [null],
    parentID: [null],
    childID: [null],
    category: [null],
    active: [null],
  }),

  warehouseLocation: this.fb.group({
    id: [null],
    orgId: [null],
    name: [null, Validators.required],
    binNumber: [null],
    description: [null],
    parentID: [null],
  }),

  unitPrice: [null, [Validators.required, Validators.min(0)]],  
  bulkPrice: [null],  
  purchasePrice: [null],
  msrp: [null, [Validators.required, Validators.min(0)]],
  requisitionLevel: [null],

  stockAmount: [null, [Validators.required, Validators.min(0)]],
  imageUrl1: [null],  
  imageUrl2: [null],
  imageUrl3: [null],
  imageUrl4: [null],

  productCode: [null, Validators.required],  
  barcode: [null],
  sku: [null],
  supplier: [null],
  expiry: [null],

  shortDescription: [null, Validators.required],  
  longDescription: [null],

  online: [null],
  active: [null]
});

    
  }

  ngOnInit() {}

  async onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
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
        const productData = {
          ...this.productForm.value,
          id: Date.now(), 
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString()
        };
  
        this._user.newproductadd(productData).subscribe(
          async (response) => {
            console.log('Product added:', response);
            await loading.dismiss();
            
            const toast = await this.toastCtrl.create({
              message: 'Product added successfully!',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
            
            this.productForm.reset();
            this.imagePreview = null;
          },
          async (error) => {
            console.error('Error adding product:', error);
            await loading.dismiss();
            
            const toast = await this.toastCtrl.create({
              message: 'Failed to add product. Please try again.',
              duration: 2000,
              color: 'danger'
            });
            await toast.present();
          }
        );
  
      } catch (error) {
        await loading.dismiss();
        
        const toast = await this.toastCtrl.create({
          message: 'An unexpected error occurred.',
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
