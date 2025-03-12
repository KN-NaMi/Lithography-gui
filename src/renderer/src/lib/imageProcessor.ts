export async function processImage(file: File, color: number): Promise<string> {

    // Input validation
    if (!(file instanceof File)) {
        throw new Error('Invalid file parameter: File object required');
    }
    if (![1, 2].includes(color)) {
        throw new Error('Invalid color parameter: must be 1 (blue) or 2 (red)');
    }
    if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type: Image required');
    }

    // Reasonable file size limit (2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large: Maximum size is 2MB');
    }

    return new Promise((resolve) => {
        // Create an image object
        const img: HTMLImageElement = new Image();
        const originalUrl: string = URL.createObjectURL(file);

        img.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Could not get canvas context");
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData: ImageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );
            const data: Uint8ClampedArray = imageData.data;

            // Process pixels: change white-ish to specified color
            for (let i: number = 0; i < data.length; i += 4) {
                const r: number = data[i];
                const g: number = data[i + 1];
                const b: number = data[i + 2];

                // Check if pixel is white-ish (adjustable thresholds)
                if (r > 200 && g > 200 && b > 200) {
                    if (color === 1) {
                        // Blue
                        data[i] = 0;     // Red
                        data[i + 1] = 0; // Green
                        data[i + 2] = 255; // Blue
                    } else if (color === 2) {
                        // Red
                        data[i] = 255;   // Red
                        data[i + 1] = 0; // Green
                        data[i + 2] = 0; // Blue
                    }
                }
            }

            // Put modified data back
            ctx.putImageData(imageData, 0, 0);

            // Convert to blob URL
            canvas.toBlob((blob: Blob | null) => {
                if (blob) {
                    const modifiedUrl: string = URL.createObjectURL(blob);
                    resolve(modifiedUrl);
                }
            }, "image/jpeg");

            // Clean up original URL
            URL.revokeObjectURL(originalUrl);
        };

        img.src = originalUrl;
    });
}