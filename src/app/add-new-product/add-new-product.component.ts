import { Component, OnInit } from '@angular/core';
import { AddNewProduct } from './add-new-product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent  implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]], // Default value should be number
      code: ['', Validators.required],
      barcode: [''],
      category: ['', Validators.required],
      image: [''],
      stockAmount: [0, [Validators.required, Validators.min(0)]], // Removed || null
      shortDescription: [''], // Removed || null
      longDescription: [''],
      msrp: [0, [Validators.required, Validators.min(0)]],
      online: [true], // No need for || null
      active: [true]
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
        const productData: AddNewProduct = {
          ...this.productForm.value,
          id: Date.now(),
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString()
        };

        // Uncomment if using backend API
        // await this.productService.addProduct(productData);

        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Product added successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
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
