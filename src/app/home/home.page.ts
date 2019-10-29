import { Component } from '@angular/core';
import {
  Plugins,
  Capacitor,
  CameraResultType,
  CameraSource,
} from '@capacitor/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private _imagePicker: ImagePicker,
    private androidPermissions: AndroidPermissions,
  ) {}

  async onCamera() {
    if (Capacitor.isPluginAvailable('Camera')) {
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        )
        .then(
          async result => {
            if (!result.hasPermission) {
              this.androidPermissions
                .requestPermissions([
                  this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
                  this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
                ])
                .then(permission => {
                  this.androidPermissions
                    .checkPermission(
                      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
                    )
                    .then(async result => {
                      if (result.hasPermission) {
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
                    });
                });
            } else {
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
          },
          err => console.log(err),
        );
    }
  }

  onImagePick() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      )
      .then(
        async result => {
          if (!result.hasPermission) {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
              )
              .then(async hasPermission => {
                if (hasPermission.hasPermission) {
                  try {
                    const imagePick = await this._imagePicker.getPictures({
                      maximumImagesCount: 10,
                      quality: 50,
                      outputType: 1,
                    });
                    if (imagePick) {
                      for (var i = 0; i < imagePick.length; i++) {
                        console.log('Image URI: ' + imagePick[i]);
                      }
                    }
                  } catch (e) {
                    console.log(e, 'error in picking image');
                  }
                }
              });
          } else {
            try {
              const imagePick = await this._imagePicker.getPictures({
                maximumImagesCount: 10,
                quality: 50,
                outputType: 1,
              });
              if (imagePick) {
                for (var i = 0; i < imagePick.length; i++) {
                  console.log('Image URI: ' + imagePick[i]);
                }
              }
            } catch (e) {
              console.log(e, 'error in picking image');
            }
          }
          console.log('Has permission?', result.hasPermission);
        },
        err =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          ),
      );
  }
}
