import jimp from 'jimp';

export async function convertToIcon(filePath, iconWidth = 32, iconHeight = 32) {
    let inputImage = await jimp.read(filePath);
    let aspect = inputImage.bitmap.width / inputImage.bitmap.height;
	let w = aspect >= 1 ? iconWidth : jimp.AUTO;
	let h = aspect <= 1 ? iconHeight : jimp.AUTO;
    inputImage.resize(w, h);

    let backgroundCanvas = new jimp(iconWidth, iconHeight, 0x00_00_00_00); // #00 00 00 00 - transparent hex code

    let renderWidth = inputImage.bitmap.width;
    let renderHeight = inputImage.bitmap.height;

    let marginTop = renderHeight === iconHeight ? 0 : Math.floor((iconHeight - renderHeight) / 2);
    let marginLeft = renderWidth === iconWidth ? 0 : Math.floor((iconWidth - renderWidth) / 2);

    backgroundCanvas.composite(inputImage, marginLeft, marginTop);
    let pngBuffer = await backgroundCanvas.getBufferAsync(jimp.MIME_PNG);

    let bitPerPixel = (8 + 8 + 8 + 8); // Red, Green, Blue, Alpha

    // ICON Header
    let header = Buffer.alloc(22);
    header.writeUintLE(0, 0, 2); // Reserved
    header.writeUintLE(1, 2, 2); // Type, 1 = icon, 2 = cursor
    header.writeUintLE(1, 4, 2); // Count, 1 icon
    
    let index = 6;

    // ICON data
    header.writeUintLE(iconWidth, index, 1); // Reserved
    header.writeUintLE(iconHeight, index + 1, 1); // Reserved
    header.writeUintLE(0, index + 2, 1); // Color palette, 0 = no color palette
    header.writeUintLE(0, index + 3, 1); // Reserved
    header.writeUintLE(1, index + 4, 2); // Color planes
    header.writeUintLE(bitPerPixel, index + 6, 2); // Bits per pixel
    header.writeUintLE(pngBuffer.length, index + 8, 4); // Size of image data
    header.writeUintLE(header.length, index + 12, 4); // Offset to data

    let iconBuffer = Buffer.concat([header, pngBuffer]);
    return iconBuffer;
}