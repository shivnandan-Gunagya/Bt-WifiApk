import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  BleClient,
  dataViewToText,
  numberToUUID,
  ScanResult,
  textToDataView,
} from '@capacitor-community/bluetooth-le';
import {
  IonButton,
  IonInput,
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

  
  @ViewChild('inputField')
  inputField!: IonInput;
  @ViewChild('sendButton')
  sendButton!: IonButton;
  inputVisible = false;
  newText: any = null;
  dataView: any = null;
  incomingData: any = null;
  userInput: string = '';
  loaderToShow: any;
  bluetoothScanResults: ScanResult[] = [];
  bluetoothIsScanning = false;
  bluetoothConnectedDevice?: ScanResult;
  connectedDevice: any = '';
  ESP_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'.toUpperCase();
  ESP_RX_CHARACTERISTICS = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'.toUpperCase();
  ESP_TX_CHARACTERISTICS = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'.toUpperCase();

  constructor(
    public toastController: ToastController,
    public router: Router,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  toggleInputField() {
    this.inputVisible = !this.inputVisible;

    if (this.inputVisible) {
      this.inputField.setFocus();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1700,
    });
    toast.present();
  }

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

  ngOnInit(): void {}

  // Scan Function
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

      // this.showLoader('Scan Bluetooth Devices');
      this.bluetoothScanResults = [];
      this.bluetoothIsScanning = true;

      await BleClient.requestLEScan({}, (result: any) => {
        console.log('Received new scan result', result);

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

  // Enable Bluetooth function

  async enableBt() {
    try {
      await BleClient.enable().then(
        () => {
          this.scanForBluetoothDevices();
        },
        () => {
          alert('Allow Bluetooth To Turn On Or Exit The App!');
        }
      );
    } catch (error) {
      alert('please turn on Bluetooth manulally');
    }
  }

  // Connect Function

  async connectToBluetoothDevice(scanResult: any) {
    this.showLoader(`connecting with ${scanResult.name}`);
    try {
      await BleClient.connect(scanResult.deviceId);

      this.connectedDevice = scanResult;
      // this.readData();
      this.bluetoothConnectedDevice = scanResult.name;
      this.hideLoader();
      if (this.bluetoothConnectedDevice === scanResult.name) {
        alert('connected');
      }
    } catch (error: any) {
      this.hideLoader();
      alert(error.message);
      console.error('connectToDevice', error);
      // this.presentToast(JSON.stringify(error));
    }
  }

  //Write a message

  async writeData() {
    this.newText = textToDataView(this.userInput);
    // this.dataView = dataViewToText(this.newText);

    try {
      await BleClient.write(
        this.connectedDevice.deviceId,
        this.ESP_SERVICE,
        this.ESP_RX_CHARACTERISTICS,
        this.newText
      );
      alert(`message ${this.userInput} sended`)
      console.log('Update value');
    } catch (error) {
      alert('can not send the message');
    }
  }

  //Read Characteristic

  async readData() {
    try {
      const esp_characterictic = await BleClient.read(
        this.connectedDevice.deviceId,
        // '48:77:85:E6:A4:57',
        this.ESP_SERVICE,
        this.ESP_TX_CHARACTERISTICS
      );
      let result = dataViewToText(esp_characterictic);
      this.incomingData = result;
      console.log(' The data is : ' + result);
      // alert("time" + esp_characterictic);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
