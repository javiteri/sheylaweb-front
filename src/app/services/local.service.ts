import { Injectable } from '@angular/core';
//import { EncryptStorage } from "encrypt-storage";

const SECRET_KEY = 'M10101418/2=golosossoftsheyla';

@Injectable({
    providedIn: 'root'
})
export class LocalService {

    /*encryptStorage = new EncryptStorage(SECRET_KEY);

    constructor() { }

    // Set the json data to local 
    storageSetJsonValue(key: string, value: any) {    
        this.encryptStorage.setItem(key, value);
        //this.storageService.secureStorage.setItem(key, value);
    }

    // Get the json value from local 
    storageGetJsonValue(key: string) {    
        return this.encryptStorage.getItem(key);
        //return this.storageService.secureStorage.getItem(key);
    }

    // Clear the local 
    storageclearToken() {    
        //return this.storageService.secureStorage.clear();
    }*/
}