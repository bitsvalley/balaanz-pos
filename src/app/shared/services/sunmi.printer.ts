import { Directive, Injectable, OnDestroy } from '@angular/core';
// import { SunmiPrinter, SunmiPrinterPlugin } from '@kduma-autoid/capacitor-sunmi-printer';
import { Sunmi } from '@bistroo/capacitor-plugin-sunmi';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SunmiPrinterService implements OnDestroy {

    constructor(private decimalPipe: DecimalPipe) {
      // console.log(this.decimalPipe.transform(1000));
    }

    fillSpace(text, align) {
      const spacesNeeded = 29 - text.length;
      const spaces = ' '.repeat(spacesNeeded)
      if (align === 'right') {
        return spaces + text;
      } else {
        return text + spaces;
      }
    }
    
    breakWords(text, align) {
      const breakString = text.match(/.{1,29}/g);
      const breakSpaceString = breakString.map(item => item.length < 29? this.fillSpace(item, align) : item);
      return breakSpaceString.join("");
    }

    dashedBorder() {
      return `-----------------------------`;
    }

    formatLines(text: any, align: any = 'left') {
      const isSingleString = text.length > 29? false : true;
      if (isSingleString) {
        return this.fillSpace(text,  align);
      } else {
        return this.breakWords(text, align);
      }
    }

    addEmptyLine() {
      return `                             `;
    }

    formatColumn2(colText1, colText2) {
      const colL1 = colText1.length;
      const colL2 = colText2.length;
      const spaceNeed = 29 - (colL1 + colL2);
      const spaces = ' '.repeat(spaceNeed);
      return colL1 + spaces + colL2;
    }

    printProducts(data) {
      return new Promise((resolve, reject) => {
        data.cartList.forEach((itm) => {
          Sunmi.text({text: this.formatLines(`${itm.name} X ${itm.quantity}`)});
          // Sunmi.text({text: this.formatLines(`X ${itm.quantity}`)});
          Sunmi.text({text: this.formatLines(`${this.decimalPipe.transform(itm.unitPrice)}`, 'right')});
        });
        resolve(true);
      });
    }

    async print(data: any) {
      const thankNote = `Thank you for shopping with`;
      const thankNote2 = `us`;

        // Default Settings
        await Sunmi.start();
        await Sunmi.align({ direction: "LEFT"});
        await Sunmi.fontSize({size: 1});

        // Title and Address
        await Sunmi.text({text: this.formatLines("======== BALAANZ POS ========")});
        await Sunmi.text({text: this.addEmptyLine()});

        // Show Customer Name
        await Sunmi.text({text: this.formatLines(`Agent: ${data.userDetails.first_name} ${data.userDetails.last_name}`)});
        await Sunmi.text({text: this.formatLines("Order Type: SALE")});
        await Sunmi.text({text: this.formatLines(`Payment Method: ${data.paymentData.method}`)});
        if (data.paymentData.method !== 'CASH') {
          await Sunmi.text({text: this.formatLines(`Account: ${data.paymentData.value}`)});
        }

        // Show Customer Name
        await Sunmi.text({text: this.addEmptyLine()});
        await Sunmi.text({text: this.formatLines("Product List")});
        await Sunmi.text({text: this.dashedBorder()});

        // Show Customer Name
        await this.printProducts(data);

        await Sunmi.text({text: this.dashedBorder()});
        await Sunmi.text({text: this.formatLines(`Total: ${this.decimalPipe.transform(data.cartSummary.totalAmount)}`, 'right')});
        await Sunmi.text({text: this.addEmptyLine()});
        await Sunmi.text({text: this.formatLines(`${thankNote}`)});
        await Sunmi.text({text: this.formatLines(`${thankNote2}`)});
        await Sunmi.text({text: this.addEmptyLine()});
        await Sunmi.text({text: this.addEmptyLine()});
        await Sunmi.text({text: this.addEmptyLine()});

        // Print 
        await Sunmi.print();
      }

    ngOnDestroy(): void {

    }
}