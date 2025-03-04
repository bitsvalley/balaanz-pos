import { Component, OnInit } from '@angular/core';
import { AddNewProduct } from './add-new-product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { Category } from '../product-add/product-add.model';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent  implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
  private subscriptions: Subscription = new Subscription(); 
  public categories : Category[] = []

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
    private navCtrl: NavController,
    private _product : ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      unitPrice: [0],
      barcode: [''],
      categoryId: ['', Validators.required],
      image: [''],
      stockAmount: [0],
      shortDescription: [''], 
      longDescription: [''],
    });
    this.categories = this._product.getCategories();
    
    
  }

  ngOnInit() {}

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
      console.log(this.productForm.value);
      try {
       
        const productData: AddNewProduct = {
          ...this.productForm.value,
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString()
        };
        console.log(productData);

        const loginApi = this._user.getnewproductadd(productData).subscribe((response: any) => {
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