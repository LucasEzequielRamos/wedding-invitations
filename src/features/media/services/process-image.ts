import sharp from "sharp";

const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;

export async function processImage(buffer: Buffer) {
  const output = await sharp(buffer)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
    })
    .toBuffer();

  const metadata = await sharp(output).metadata();

  return {
    buffer: output,
    mimeType: "image/webp",
    sizeBytes: output.length,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  };
}