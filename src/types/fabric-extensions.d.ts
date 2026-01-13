import "fabric";

declare module "fabric" {
    namespace fabric {
        interface Object {
            customType?: string;
            customRole?: string;
            paletteIndex?: number;
        }

        interface Group {
            customType?: string;
        }
    }
}
