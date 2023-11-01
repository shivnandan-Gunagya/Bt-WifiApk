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
  loaderToShow: any;
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

  showLoader(text: any) {
    this.loaderToShow = this.loadingCtrl
      .create({
        message: text,
      })
      .then((res) => {
        res.present();
        res.onDidDismiss().then((dis) => {
          console.log('Loading dismissed!');
        });
      });
  }

  hideLoader() {
    this.loadingCtrl.dismiss();
  }

  async scanForBluetoothDevices() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });

      const isEnable = await BleClient.isEnabled();

      if (!isEnable) {
        const enableRes = this.enableBt();

        if (void enableRes) {
          console.log('Enabled');
        } else if (void enableRes != true) {
          return;
        }
      }

      this.showLoader('Scan Bluetooth Devices');
      this.bluetoothScanResults = [];
      this.bluetoothIsScanning = true;

      await BleClient.requestLEScan({}, (result: any) => {
        console.log('Received new scan result', result);

        console.log('MData', result);

        this.bluetoothScanResults.push(result);
        this.hideLoader();
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

  enableBt() {
    BleClient.enable().then(
      () => {
        this.scanForBluetoothDevices();
      },
      () => {
        alert('Allow Bluetooth To Turn On Or Exit The App!');
      }
    );
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

    alert(scanResult);

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
