import { Component, OnInit } from '@angular/core';
import { EditProduct } from './edit-product-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent  implements OnInit {

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
        
        image: [''],
       
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
          const productData: EditProduct = {
            ...this.productForm.value,
            id: Date.now(),
           
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
