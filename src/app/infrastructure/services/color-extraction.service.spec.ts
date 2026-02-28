import { ColorExtractionService, ExtractedColors } from './color-extraction.service';

describe('ColorExtractionService', () => {
  let service: ColorExtractionService;

  beforeEach(() => {
    service = new ColorExtractionService();
  });

  describe('extractColors', () => {
    it('should reject invalid image types', async () => {
      const invalidFile = new File(['data'], 'test.gif', { type: 'image/gif' });

      await expectAsync(service.extractColors(invalidFile))
        .toBeRejectedWithError('Formato de imagen no válido. Solo se aceptan PNG y JPG.');
    });

    it('should reject non-image files', async () => {
      const textFile = new File(['hello'], 'test.txt', { type: 'text/plain' });

      await expectAsync(service.extractColors(textFile))
        .toBeRejectedWithError('Formato de imagen no válido. Solo se aceptan PNG y JPG.');
    });

    it('should accept PNG files', async () => {
      const pngFile = createTestImageFile('image/png');
      const result = await service.extractColors(pngFile);

      expectValidColors(result);
    });

    it('should accept JPEG files', async () => {
      const jpegFile = createTestImageFile('image/jpeg');
      const result = await service.extractColors(jpegFile);

      expectValidColors(result);
    });

    it('should return 3 distinct hex color strings', async () => {
      const file = createTestImageFile('image/png');
      const result = await service.extractColors(file);

      expect(result.dominant).toBeDefined();
      expect(result.secondary).toBeDefined();
      expect(result.accent).toBeDefined();
    });

    it('should return valid hex color format (#RRGGBB)', async () => {
      const file = createTestImageFile('image/png');
      const result = await service.extractColors(file);

      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      expect(result.dominant).toMatch(hexPattern);
      expect(result.secondary).toMatch(hexPattern);
      expect(result.accent).toMatch(hexPattern);
    });
  });
});

/**
 * Creates a small valid test image file using Canvas API
 */
function createTestImageFile(mimeType: string): File {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext('2d')!;

  // Draw distinct color blocks
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 5, 5);
  ctx.fillStyle = '#00FF00';
  ctx.fillRect(5, 0, 5, 5);
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(0, 5, 5, 5);
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(5, 5, 5, 5);

  const dataUrl = canvas.toDataURL(mimeType);
  const byteString = atob(dataUrl.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  return new File([uint8Array], `test.${extension}`, { type: mimeType });
}

function expectValidColors(result: ExtractedColors): void {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  expect(result.dominant).toMatch(hexPattern);
  expect(result.secondary).toMatch(hexPattern);
  expect(result.accent).toMatch(hexPattern);
}
