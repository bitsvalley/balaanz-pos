import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  NavController,
  ToastController,
  ActionSheetController,
} from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { Category } from '../product-add/product-add.model';
import { ProductService } from '../shared/services/product.service';
import { GlobalService } from '../shared/services/global.service';
import { AddNewProduct } from './add-new-product.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  private readonly MAX_FILE_SIZE = 45 * 1024 * 1024;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _user: UserService,
    private navCtrl: NavController,
    private _product: ProductService,
    private _global: GlobalService,
    private actionSheetController: ActionSheetController
  ) {
    this.initializeForm();
    this.categories = this._product.getCategories();
  }

  private initializeForm() {
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      // unitPrice: [
      //   0,
      //   [
      //     Validators.required,
      //     Validators.min(0),
      //     Validators.pattern(/^\d+(\.\d{1,2})?$/),
      //   ],
      // ],
      barcode: ['', [Validators.maxLength(50)]],
      categoryId: ['', [Validators.required]],
      image: [''],
      stockAmount: [
        0,
        [
          // Validators.required,
          //  Validators.min(0), Validators.pattern(/^\d+$/)
          ],
      ],
      // shortDescription: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.minLength(10),
      //     Validators.maxLength(100),
      //   ],
      // ],
      // longDescription: ['', [Validators.maxLength(500)]],
    });
  }


  // Removed duplicate import and constructor for NavController

  goBack() {
    this.navCtrl.back();
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
          },
        },

        {
          text: 'File',
          icon: 'folder',
          handler: () => {
            const fileInput = document.querySelector(
              'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.click();
            }
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
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
        height: 500,
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
        color: 'danger',
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

  async compressImage(
    file: File | string,
    maxSizeKB: number = 700
  ): Promise<string> {
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

          const base64Size = compressedDataUrl.length * (3 / 4);
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
    if (this.productForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Adding product...',
      });
      await loading.present();
      try {
        const productData: AddNewProduct = {
          name: this.productForm.get('name')?.value?.trim(),
          unitPrice: parseFloat(this.productForm.get('unitPrice')?.value) || 0,
          barcode: this.productForm.get('barcode')?.value?.trim() || '',
          categoryId: parseInt(this.productForm.get('categoryId')?.value),
          image: this.productForm.get('image')?.value || '',
          stockAmount:
            parseInt(this.productForm.get('stockAmount')?.value) || 0,
          shortDescription: this.productForm
            .get('shortDescription')
            ?.value?.trim(),
          longDescription:
            this.productForm.get('longDescription')?.value?.trim() || '',
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString(),
        };

        console.log('Form Data:', this.productForm.value);
        console.log('Processed Data:', productData);

        const loginApi = this._user.getnewproductadd(productData).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            this.handleSuccess();
          },
          (error: any) => {
            console.error('API Error:', error);
            this.handleError('Failed to add product. Please try again.');
          }
        );
        this.subscriptions.add(loginApi);

        await loading.dismiss();
      } catch (error) {
        console.error('Unexpected Error:', error);
        await loading.dismiss();
        this.handleError('An unexpected error occurred. Please try again.');
      }
    } else {
      this.markFormGroupTouched();
      this.handleError('Please fill in all required fields correctly.');
    }
  }

  private async handleSuccess() {
    const toast = await this.toastCtrl.create({
      message: 'Product added successfully!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();

    setTimeout(() => {
      this.navCtrl.navigateForward('/product');
    }, 2000);

    this.resetForm();
  }

  private async handleError(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm() {
    this.productForm.reset();
    this.imagePreview = null;
    this.initializeForm();
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['minlength'])
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['maxlength'])
      return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
    if (field.errors['min'])
      return `Minimum value is ${field.errors['min'].min}`;
    if (field.errors['pattern']) return 'Invalid format';

    return 'Invalid input';
  }
}
