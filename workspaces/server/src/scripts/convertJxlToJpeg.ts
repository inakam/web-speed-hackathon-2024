import fs from 'node:fs/promises';
import path from 'node:path';

import { jpegConverter } from '../image-converters/jpegConverter';
import { jpegXlConverter } from '../image-converters/jpegXlConverter';

const SEEDS_IMAGES_DIR = path.join(__dirname, '../../seeds/images');

async function convertJxlToJpeg() {
  try {
    const files = await fs.readdir(SEEDS_IMAGES_DIR);
    const jxlFiles = files.filter((file) => file.endsWith('.jxl'));

    console.log(`Found ${jxlFiles.length} JPEG XL files to convert`);

    for (const jxlFile of jxlFiles) {
      const jxlPath = path.join(SEEDS_IMAGES_DIR, jxlFile);
      const jpegFileName = jxlFile.replace('.jxl', '.jpg');
      const jpegPath = path.join(SEEDS_IMAGES_DIR, jpegFileName);

      // Skip if JPEG already exists
      try {
        await fs.access(jpegPath);
        console.log(`Skipping ${jxlFile} - JPEG already exists`);
        continue;
      } catch {
        // JPEG doesn't exist, proceed with conversion
      }

      try {
        console.log(`Converting ${jxlFile} to ${jpegFileName}...`);

        // Read JPEG XL file
        const jxlData = await fs.readFile(jxlPath);

        // Decode JPEG XL to ImageData
        const imageData = await jpegXlConverter.decode(new Uint8Array(jxlData));

        // Encode ImageData to JPEG
        const jpegData = await jpegConverter.encode(imageData);

        // Write JPEG file
        await fs.writeFile(jpegPath, jpegData);

        console.log(`✓ Converted ${jxlFile} to ${jpegFileName}`);
      } catch (error) {
        console.error(`✗ Failed to convert ${jxlFile}:`, error);
      }
    }

    console.log('Conversion completed!');
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  convertJxlToJpeg();
}

export { convertJxlToJpeg };
