import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  BleClient,
  ScanResult,
} from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  bluetoothScanResults: ScanResult[] = [];
  bluetoothIsScanning = false;

  bluetoothConnectedDevice?: ScanResult;


  constructor(public toastController: ToastController, public router: Router) {}

  ngOnInit(): void {}

  async scanForBluetoothDevices() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });
  
      this.bluetoothScanResults = [];
      this.bluetoothIsScanning = true;
  
      await BleClient.requestLEScan({}, (result) => {
        console.log('Received new scan result', result);
        this.bluetoothScanResults.push(result);
      });
  
      const stopScanAfterMilliSeconds = 5000;
      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.bluetoothIsScanning = false;
        console.log('Stopped scanning');
      }, stopScanAfterMilliSeconds);
    } catch (error) {
      this.bluetoothIsScanning = false;
      console.error('scanForBluetoothDevices', error);
    }
  }
  
  onBluetooDeviceDisconnected(disconnectedDeviceId: string) {
    alert(`Diconnected ${disconnectedDeviceId}`);
    this.bluetoothConnectedDevice = undefined;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1700,
    });
    toast.present();
  }

  async connectToBluetoothDevice(scanResult: ScanResult) {
    const device = scanResult.device;
  
    try {
      await BleClient.connect(
        device.deviceId,
        this.onBluetooDeviceDisconnected.bind(this)
      );
  
      this.bluetoothConnectedDevice = scanResult;
      const deviceName = device.name ?? device.deviceId;
      this.presentToast(`Connected to device ${deviceName}`);
    } catch (error) {
      console.error('connectToDevice', error);
      this.presentToast(JSON.stringify(error));
    }
  }

}
