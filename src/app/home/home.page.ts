import { Component } from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraResultType,
  CameraSource,
} from '@capacitor/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {}

  async onCamera() {
    if (Capacitor.isPluginAvailable('Camera')) {
      try {
        const camera = await Plugins.Camera.getPhoto({
          correctOrientation: true,
          quality: 50,
          resultType: CameraResultType.Base64,
          source: CameraSource.Prompt,
        });
        if (camera) {
          console.log(camera.base64String, 'base64 output');
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}
