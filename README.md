# IONIC Angular BleClient 

To use Bluetooth on Ionic Capacitor, you can use the “@capacitor-community/bluetooth-le” plugin. This plugin provides support for Bluetooth Low Energy (BLE) on the web, Android, and iOS platforms. The plugin supports the central role of the BLE protocol and not the peripheral role.

## Installation & Documentation

This is a Capacitor plugin for Bluetooth Low Energy. It supports the web, Android and iOS. [Follow BleClient Documentation](https://www.npmjs.com/package/@capacitor-community/bluetooth-le?activeTab=readme) to install & setup.

```bash
npm install @capacitor-community/bluetooth-le
npx cap sync
```

## Usage

```python
import { BleClient } from '@capacitor-community/bluetooth-le';

#In the export class pageNAme{ add below line }
await BleClient.initialize({ androidNeverForLocation: true });
```

## Add Required Android Permissions

In the below path 
 ```bash
android>app>src>main>AndroidManifest.xml
```

add the Android Required permissions 

```bash 
 <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Storage Permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!--  Wi-Fi Permissions -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />

    <!-- Bluetooth Permissions -->
    <!-- Request legacy Bluetooth permissions on older devices. -->
    <uses-permission
        android:name="android.permission.BLUETOOTH"
        android:maxSdkVersion="30" />
    <uses-permission
        android:name="android.permission.BLUETOOTH_ADMIN"
        android:maxSdkVersion="30" />
    <!-- Needed only if your app looks for Bluetooth devices.
        You must add an attribute to this permission, or declare the
        ACCESS_FINE_LOCATION permission, depending on the results when you
        check location usage in your app. -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
    <!-- Needed only if your app makes the device discoverable to Bluetooth
        devices. -->
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <!-- Needed only if your app communicates with already-paired Bluetooth
        devices. -->
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

After that set  ```  android:exported="true" ``` in activity tag as attribute. 
#Check that  ```  android:exported="false" ```  is not set in the file other wise graddle build might be fail.

## UI setup

Make the UI that you required to find and connect the device.
