import { Directive, Injectable, OnDestroy } from '@angular/core';
// import { SunmiPrinter, SunmiPrinterPlugin } from '@kduma-autoid/capacitor-sunmi-printer';
import { Sunmi } from '@bistroo/capacitor-plugin-sunmi';

@Injectable({
  providedIn: 'root'
})
export class SunmiPrinterService implements OnDestroy {

    // constructor(private _sunmi: SunmiPrinterPlugin) {

    // }

    fillSpace(text) {
      const spacesNeeded = 29 - text.length;
      const spaces = ' '.repeat(spacesNeeded)
      return text + spaces;
    }
    
    breakWords(text) {
      const breakString = text.match(/.{1,29}/g);
      const breakSpaceString = breakString.map(item => item.length < 29? this.fillSpace(item) : item);
      return breakSpaceString.join("");
    }

    dashedBorder() {
      return `-----------------------------`;
    }

    formatLines(text: any) {
      const isSingleString = text.length > 29? false : true;
      if (isSingleString) {
        return this.fillSpace(text);
      } else {
        return this.breakWords(text);
      }
    }

    formatColumn2(colText1, colText2) {
      const colL1 = colText1.length;
      const colL2 = colText2.length;
      const spaceNeed = 29 - (colL1 + colL2);
      const spaces = ' '.repeat(spaceNeed);
      return colL1 + spaces + colL2;
    }

    async print(data: any) {
        // console.log(await SunmiPrinter.printerInit());
        // const testArray = [
        //   {name: "Product 1", qty: 2, price: 20, total: 40},
        //   {name: "Product 2", qty: 2, price: 30, total: 60},
        //   {name: "Product 3", qty: 2, price: 40, total: 80}
        // ]
//         const receiptContent = `
// Balaanz Food Shop            
// Address: 123 Main St, City,  
// Country                      
// Date: 10/12/2024             
                             
// -----------------------------
// Item        Qty  Price  Total
// -----------------------------
// Product A   1    $10   $10.00
// Product B   2    $10   $30.00
// ${testArray.map((item) => {
//   return `${item.name}   ${item.qty}    ${item.price}   ${item.total}`
// })}
// -----------------------------
// Total:                 $40.00
// -----------------------------
// Thank you for shopping with  
// us! 
// `;

      const thankNote = 
`Thank you for using agent   
banking!                     
                             `

        // Default Settings
        await Sunmi.start();
        await Sunmi.align({ direction: "LEFT"});
        await Sunmi.fontSize({size: 1});

        // Title and Address
        await Sunmi.text({text: this.formatLines("====== UNICS PLC AGENT ======")});
        await Sunmi.text({text: this.dashedBorder()});

        // Show Customer Name
        await Sunmi.text({text: this.formatLines("Date")});
        await Sunmi.text({text: this.formatLines(`${data.date}`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Customer Name
        await Sunmi.text({text: this.formatLines("Transaction Type")});
        await Sunmi.text({text: this.formatLines(`${data.transaction.transactionType}`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Customer Name
        await Sunmi.text({text: this.formatLines("Customer Name")});
        await Sunmi.text({text: this.formatLines(`${data.customer.customer?.firstName} ${data.customer.customer?.lastName}`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Agent Name
        await Sunmi.text({text: this.formatLines("Agent Name")});
        await Sunmi.text({text: this.formatLines(`${data.user?.first_name} ${data.user?.last_name}`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Account Number
        await Sunmi.text({text: this.formatLines("Account Number")});
        await Sunmi.text({text: this.formatLines(`${data.customer?.selectedAccount?.accountNumber}`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Account Number
        await Sunmi.text({text: this.formatLines("Amount")});
        await Sunmi.text({text: this.formatLines(`${data.transaction?.savingAmount} frs`)})
        await Sunmi.text({text: this.dashedBorder()});

        // Show Account Balance
        await Sunmi.text({text: this.formatLines("Account Balance")});
        await Sunmi.text({text: this.formatLines(`${data.transResp?.savingBilanzList?.totalSaving} frs`)})
        await Sunmi.text({text: this.dashedBorder()});

        await Sunmi.text({text: thankNote})

        // Print 
        await Sunmi.print();
        
        // console.log(await SunmiPrinter.getDeviceName());
        
        // console.log(await SunmiPrinter.getPrinterModel());
        // console.log(await SunmiPrinter.printerInit());
        // console.log(await SunmiPrinter.bindService());
        
        // try {
        //   const result = await SunmiPrinter.printText({
        //     text: text
        //   });
        //   console.log('Print successful', result);
        //   return true;
        // } catch (error) {
        //   console.error('Error printing:', error);
        //   return false;
        // }
      }

    ngOnDestroy(): void {

    }
}