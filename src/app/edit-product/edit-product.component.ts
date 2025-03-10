import { Component, OnInit } from '@angular/core';
import { EditProduct } from './edit-product-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../product-add/product-add.model';
import { GlobalService } from '../shared/services/global.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
  private subscriptions: Subscription = new Subscription();
  itemData: Product;
  
  private readonly MAX_FILE_SIZE = 45 * 1024 * 1024;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
    private _productService: ProductService,
    private navCtrl: NavController,
    private _global: GlobalService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.itemData = this._productService.getItemData();
    this.formSetUp();
    this.imagePreview = this.itemData.image1;
  }

  formSetUp() {
    this.productForm = this.fb.group({
      name: [this.itemData.name, [Validators.required, Validators.minLength(3)]],
      barcode: [this.itemData.barcode, [Validators.required, Validators.min(0)]],
      image: [this.itemData.image1, ''],
    });
  }

  async presentImageSourceActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          }
        },
        {
          text: 'File',
          icon: 'folder',
          handler: () => {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.click();
            }
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
        correctOrientation: true,
        width: 500,
        height: 500
      });

      if (image.base64String) {
        const base64Image = `data:image/jpeg;base64,${image.base64String}`;
        
        const sizeInBytes = this.getBase64Size(base64Image);
        if (sizeInBytes > this.MAX_FILE_SIZE) {
          const toast = await this.toastCtrl.create({
            message: 'Image size must be less than or equal to 45MB.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
          return;
        }
        
        try {
          const compressedImage = await this.compressImage(base64Image);
          this.imagePreview = compressedImage;
          this.productForm.patchValue({ image: compressedImage });
        } catch (error) {
          const toast = await this.toastCtrl.create({
            message: 'Failed to process image. Please try another image.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        }
      }
    } catch (error) {
      console.error('Error taking picture', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to get image. Please try again.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  private getBase64Size(base64String: string): number {
    const base64Data = base64String.split(',')[1];
    return base64Data ? Math.ceil((base64Data.length * 3) / 4) : 0;
  }

  private getFileSize(file: File): number {
    return file.size;
  }

  async compressImage(file: File | string, maxSizeKB: number = 700): Promise<string> {
    this._global.setLoader(true);
    return new Promise((resolve, reject) => {
      let reader: FileReader;
      let img = new Image();
      
      if (typeof file === 'string') {
        img.src = file;
      } else {
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          img.src = event.target?.result as string;
        };
        reader.onerror = (error) => reject(error);
      }

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
      
      img.onerror = (error) => reject(error);
    });
  }

  async onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.getFileSize(file) > this.MAX_FILE_SIZE) {
        const toast = await this.toastCtrl.create({
          message: 'Image size must be less than or equal to 45MB.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
        return;
      }
      
      try {
        const compressedImage = await this.compressImage(file);
  
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
    if (!this.productForm.valid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all required fields correctly.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return; 
    }
  
    const loading = await this.loadingCtrl.create({ message: 'Updating product...' });
    await loading.present();
  
    try {
      const productData: EditProduct = {
        ...this.productForm.value,
        lastUpdatedDate: new Date().toISOString(),
        createdDate: this.itemData.createdDate,
        id: this.itemData.id,
        categoryId: this.itemData.category,
        stockAmount: this.itemData.stockAmount,
        shortDescription: this.itemData.shortDescription,
        longDescription: this.itemData.longDescription,
        unitPrice: this.itemData.unitPrice,
        bulkPrice: this.itemData.bulkPrice,
        purchasePrice: this.itemData.purchasePrice
      };
  
      this._user.geteditproduct(productData).subscribe(
        async (response: any) => {
          console.log(response);
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Product updated successfully!',
            duration: 2000,
            color: 'success',
          });
          await toast.present();
          setTimeout(() => {
            this.navCtrl.navigateForward('/product');
          }, 2000);
        },
        async (error: any) => {
          console.error('API error:', error);
          await loading.dismiss();
          const toast = await this.toastCtrl.create({
            message: 'Failed to update product. Please try again.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Failed to update product. Please try again.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
  
}