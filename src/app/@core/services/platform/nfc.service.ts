import {Injectable} from '@angular/core';
import {NFC} from '@ionic-native/nfc/ngx';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NfcService {
    public nfcHandler$: Subject<unknown> = new Subject<unknown>();

    private readonly flags =
        this.nfc.FLAG_READER_NFC_A |
        this.nfc.FLAG_READER_NFC_V |
        this.nfc.FLAG_READER_SKIP_NDEF_CHECK;

    constructor(private nfc: NFC) {}

    public initNfc(): void {
        this.nfc.addNdefFormatableListener(
            () => console.log('Success reading tag'),
            () => console.error('Error reading tag (background)')
        ).subscribe((tag) => this.handleNfc(tag));

        // this.nfc.addMimeTypeListener(
        //     'text/any',
        //     () => console.log('Success reading tag mime'),
        //     () => console.error('Error reading tag (background mime)')
        // ).subscribe((tag) => this.handleNfc(tag));

        this.nfc.readerMode(this.flags).subscribe(
            tag => this.handleNfc(tag),
            err => console.error('Error reading tag', err)
        );
    }

    private handleNfc(nfcData: unknown): void {
        console.log(JSON.stringify(nfcData));
        this.nfcHandler$.next(this.nfc);
    }
}
