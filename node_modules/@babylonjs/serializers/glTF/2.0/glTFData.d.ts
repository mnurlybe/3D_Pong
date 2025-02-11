/**
 * Class for holding and downloading glTF file data
 */
export declare class GLTFData {
    /**
     * Object which contains the file name as the key and its data as the value
     */
    readonly files: {
        [fileName: string]: string | Blob;
    };
    /**
     * @deprecated Use files instead
     */
    get glTFFiles(): {
        [fileName: string]: string | Blob;
    };
    /**
     * Downloads the glTF data as files based on their names and data
     */
    downloadFiles(): void;
}
