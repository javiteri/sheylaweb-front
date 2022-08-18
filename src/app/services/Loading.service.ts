import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal} from "@angular/cdk/portal";
import { ComponentRef, Injectable, Injector } from "@angular/core";
import { LoadingComponent } from "../components/loading/loading.component";


export class LoadingOverlayRef {
    constructor(private overlayRef: OverlayRef){}

    close(): void {
        this.overlayRef.dispose();
    }
}


@Injectable()
export class LoadingService{

    constructor(private injector: Injector, private overlay: Overlay){}


    open(): LoadingOverlayRef {
        const overlayRef = this.createOverlay();
        const dialogRef = new LoadingOverlayRef(overlayRef);
        const overlayComponent = this.attachDialogContainer(overlayRef, dialogRef);

        return dialogRef;
    }

    private createOverlay(): OverlayRef{

        const positionStrategy = this.overlay.position()
                                .global()
                                .centerHorizontally()
                                .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });     
        
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlayRef: OverlayRef, dialogRef: LoadingOverlayRef): LoadingComponent{
        
        const containerPortal = new ComponentPortal(LoadingComponent, null);
        const containerRef: ComponentRef<LoadingComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

}