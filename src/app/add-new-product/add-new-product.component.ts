import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { Category } from '../product-add/product-add.model';
import { ProductService } from '../shared/services/product.service';
import { AddNewProduct } from './add-new-product.model';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent {
  productForm: FormGroup;
  imagePreview: string | null = null;
  private subscriptions: Subscription = new Subscription(); 
  public categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
    private navCtrl: NavController,
    private _product: ProductService,
    private _global: GlobalService,
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

  async compressImage(file: File, maxSizeKB: number = 700): Promise<string> {
    this._global.setLoader(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let quality = 0.9;
          let scale = 1;
          let compressedDataUrl: string;

          const compress = () => {
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            const base64Size = compressedDataUrl.length * (3/4);
            const sizeInKB = base64Size / 1024;

            if (sizeInKB > maxSizeKB) {
              if (quality > 0.1) {
                quality -= 0.1;
              } else if (scale > 0.5) {
                scale -= 0.1;
                quality = 0.9;
              } else {
                reject(new Error('Cannot compress image to required size'));
                return;
              }
              compress();
            } else {
              resolve(compressedDataUrl);
            }
          };

          compress();
          this._global.setLoader(false);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedImage = await this.compressImage(file);
  
        const base64Size = compressedImage.length * (3 / 4);
        const fileSizeInMB = base64Size / 1024;
  
        if (fileSizeInMB < 45) {
          const toast = await this.toastCtrl.create({
            message: 'Image size must be greater than or equal to 45 MB.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
          return;
        }
  
        this.imagePreview = compressedImage;
        this.productForm.patchValue({ image: compressedImage });
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Failed to compress image. Please try another image.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
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