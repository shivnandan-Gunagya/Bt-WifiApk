import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  showLoader: boolean = true;
  bluetoothScanResults: ScanResult[] = [];
  bluetoothIsScanning = false;

  bluetoothConnectedDevice?: ScanResult;

  constructor(
    public toastController: ToastController,
    public router: Router,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {}

  async showLoading() {
    if (this.bluetoothScanResults.length <= 0) {
      const loading = await this.loadingCtrl.create({
        message: 'Finding nearby bluetooth devices',
        duration: 5000,
      });

      loading.present();

      if (this.bluetoothScanResults.length > 0) {
        loading.dismiss();
      }
    }
  }

  async scanForBluetoothDevices() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });

      const isEnable = await BleClient.isEnabled();

      if (!isEnable) {
        const enableRes = await BleClient.enable();
       
        if (void enableRes) {
          console.log('Enabled');
        } else if (void enableRes != true) {
          return;
        }
      }

      this.bluetoothScanResults = [];
      this.bluetoothIsScanning = true;

      await BleClient.requestLEScan({}, (result:any) => {
        console.log('Received new scan result', result);
      
        this.bluetoothScanResults.push(result);
      });

      const stopScanAfterMilliSeconds = 10000;
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

    alert(scanResult)

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
