export async function processImage(file: File, color: number, invert: boolean = false): Promise<string> {
    // Input validation
    if (!(file instanceof File)) {
        throw new Error('Invalid file parameter: File object required');
    }
    
    if (![1, 2, 3].includes(color)) {
        throw new Error('Invalid color parameter: must be 1 (blue), 2 (red), or 3 (white)');
    }
    
    // Check if file is SVG
    if (file.type !== 'image/svg+xml') {
        throw new Error('Invalid file type: SVG required');
    }

    // Reasonable file size limit (2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large: Maximum size is 2MB');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            if (!event.target || typeof event.target.result !== 'string') {
                reject(new Error('Failed to read SVG file'));
                return;
            }

            const svgContent = event.target.result;
            
            try {
                // Parse SVG content into DOM
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                
                // Check for parsing errors
                const parserError = svgDoc.querySelector('parsererror');
                if (parserError) {
                    reject(new Error('Invalid SVG format'));
                    return;
                }
                
                // Find elements with colors to process
                const svgElements = svgDoc.querySelectorAll('*');
                
                svgElements.forEach(el => {
                    // Process fill attribute
                    if (el.hasAttribute('fill')) {
                        const fill = el.getAttribute('fill');
                        const newFill = processColorValue(fill, color, invert);
                        if (newFill !== fill) {
                            el.setAttribute('fill', newFill);
                        }
                    }
                    
                    // Process stroke attribute
                    if (el.hasAttribute('stroke')) {
                        const stroke = el.getAttribute('stroke');
                        const newStroke = processColorValue(stroke, color, invert);
                        if (newStroke !== stroke) {
                            el.setAttribute('stroke', newStroke);
                        }
                    }
                    
                    // Process style attribute
                    if (el.hasAttribute('style')) {
                        const style = el.getAttribute('style') || '';
                        const newStyle = processStyleAttribute(style, color, invert);
                        if (newStyle !== style) {
                            el.setAttribute('style', newStyle);
                        }
                    }
                });
                
                // Convert back to string
                const serializer = new XMLSerializer();
                const modifiedSvgContent = serializer.serializeToString(svgDoc);
                
                // Create a blob URL for the modified SVG
                const blob = new Blob([modifiedSvgContent], { type: 'image/svg+xml' });
                const modifiedUrl = URL.createObjectURL(blob);
                
                resolve(modifiedUrl);
            } catch (error) {
                reject(new Error(`Error processing SVG: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading SVG file'));
        };
        
        reader.readAsText(file);
    });
}

// Process individual color values with inversion logic
function processColorValue(colorValue: string | null, targetColor: number, invert: boolean): string {
    if (!colorValue) return colorValue || '';
    
    const originalColor = colorValue;
    
    if (invert) {
        // Inversion mode: swap colors
        if (isBlack(colorValue)) {
            // Black becomes the target color
            return getColorValue(targetColor);
        } else if (isTargetColor(colorValue, targetColor)) {
            // Target color becomes black
            return 'rgb(0, 0, 0)';
        } else if (isWhite(colorValue) && targetColor !== 3) {
            // White becomes black (only if target color is not white)
            return 'rgb(0, 0, 0)';
        } else if (isWhite(colorValue) && targetColor === 3) {
            // If target is white and current is white, make it black
            return 'rgb(0, 0, 0)';
        }
    } else {
        // Normal mode: replace whitish colors with target color
        if (isWhite(colorValue)) {
            return getColorValue(targetColor);
        }
    }
    
    return originalColor;
}

// Process style attributes
function processStyleAttribute(style: string, targetColor: number, invert: boolean): string {
    return style.replace(/(fill|stroke):\s*([^;]+)/gi, (match, property, value) => {
        const processedValue = processColorValue(value.trim(), targetColor, invert);
        if (processedValue !== value.trim()) {
            return `${property}: ${processedValue}`;
        }
        return match;
    });
}

// Get color value based on color parameter
function getColorValue(color: number): string {
    switch (color) {
        case 1: return 'rgb(0, 0, 255)';     // Blue
        case 2: return 'rgb(255, 0, 0)';     // Red
        case 3: return 'rgb(255, 255, 255)'; // White
        default: return 'rgb(0, 0, 255)';    // Default to blue
    }
}

// Check if color is black or very dark
function isBlack(colorValue: string | null): boolean {
    if (!colorValue) return false;
    
    colorValue = colorValue.toLowerCase().trim();
    
    if (colorValue === 'black' || colorValue === '#000' || colorValue === '#000000') {
        return true;
    }
    
    // Check RGB format
    const rgbMatch = colorValue.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        return r < 50 && g < 50 && b < 50; // Very dark colors
    }
    
    // Check hex format
    if (colorValue.startsWith('#') && (colorValue.length === 4 || colorValue.length === 7)) {
        let r, g, b;
        
        if (colorValue.length === 4) {
            r = parseInt(colorValue[1] + colorValue[1], 16);
            g = parseInt(colorValue[2] + colorValue[2], 16);
            b = parseInt(colorValue[3] + colorValue[3], 16);
        } else {
            r = parseInt(colorValue.slice(1, 3), 16);
            g = parseInt(colorValue.slice(3, 5), 16);
            b = parseInt(colorValue.slice(5, 7), 16);
        }
        
        return r < 50 && g < 50 && b < 50;
    }
    
    return false;
}

// Check if color is white or very light
function isWhite(colorValue: string | null): boolean {
    if (!colorValue) return false;
    
    colorValue = colorValue.toLowerCase().trim();
    
    if (colorValue === 'white' || colorValue === '#fff' || colorValue === '#ffffff') {
        return true;
    }
    
    // Check RGB format
    const rgbMatch = colorValue.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        return r > 200 && g > 200 && b > 200;
    }
    
    // Check hex format
    if (colorValue.startsWith('#') && (colorValue.length === 4 || colorValue.length === 7)) {
        let r, g, b;
        
        if (colorValue.length === 4) {
            r = parseInt(colorValue[1] + colorValue[1], 16);
            g = parseInt(colorValue[2] + colorValue[2], 16);
            b = parseInt(colorValue[3] + colorValue[3], 16);
        } else {
            r = parseInt(colorValue.slice(1, 3), 16);
            g = parseInt(colorValue.slice(3, 5), 16);
            b = parseInt(colorValue.slice(5, 7), 16);
        }
        
        return r > 200 && g > 200 && b > 200;
    }
    
    return false;
}

// Check if color matches the target color
function isTargetColor(colorValue: string | null, targetColor: number): boolean {
    if (!colorValue) return false;
    
    const targetColorValue = getColorValue(targetColor);
    const normalizedInput = normalizeColor(colorValue);
    const normalizedTarget = normalizeColor(targetColorValue);
    
    return normalizedInput === normalizedTarget;
}

// Normalize color values for comparison
function normalizeColor(colorValue: string): string {
    colorValue = colorValue.toLowerCase().trim();
    
    // Convert named colors to RGB
    if (colorValue === 'white') return 'rgb(255,255,255)';
    if (colorValue === 'black') return 'rgb(0,0,0)';
    if (colorValue === 'red') return 'rgb(255,0,0)';
    if (colorValue === 'blue') return 'rgb(0,0,255)';
    
    // Convert hex to RGB
    if (colorValue.startsWith('#')) {
        let r, g, b;
        
        if (colorValue.length === 4) {
            r = parseInt(colorValue[1] + colorValue[1], 16);
            g = parseInt(colorValue[2] + colorValue[2], 16);
            b = parseInt(colorValue[3] + colorValue[3], 16);
        } else if (colorValue.length === 7) {
            r = parseInt(colorValue.slice(1, 3), 16);
            g = parseInt(colorValue.slice(3, 5), 16);
            b = parseInt(colorValue.slice(5, 7), 16);
        } else {
            return colorValue;
        }
        
        return `rgb(${r},${g},${b})`;
    }
    
    // Clean up RGB format
    const rgbMatch = colorValue.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        return `rgb(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]})`;
    }
    
    return colorValue;
}

// Usage examples:
// processImage(file, 1, false) - Normal mode: replace white with blue
// processImage(file, 1, true)  - Invert mode: swap black↔blue, white→black
// processImage(file, 2, false) - Normal mode: replace white with red
// processImage(file, 2, true)  - Invert mode: swap black↔red, white→black
// processImage(file, 3, false) - Normal mode: replace white with white (no change)
// processImage(file, 3, true)  - Invert mode: swap black↔white