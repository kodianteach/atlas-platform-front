/**
 * ColorExtractionService - Extracts dominant colors from images using Canvas API + k-means
 *
 * Processes images entirely in the client (TypeScript pure) without backend involvement.
 * Uses a simplified k-means clustering algorithm on downscaled images for performance.
 */
import { Injectable } from '@angular/core';

export interface ExtractedColors {
  dominant: string;
  secondary: string;
  accent: string;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

@Injectable({ providedIn: 'root' })
export class ColorExtractionService {

  private static readonly MAX_DIMENSION = 100;
  private static readonly K_CLUSTERS = 5;
  private static readonly MAX_ITERATIONS = 20;

  /**
   * Extract dominant, secondary and accent colors from an image file
   * @param imageFile - PNG or JPG image file
   * @returns Promise with 3 hex colors
   */
  extractColors(imageFile: File): Promise<ExtractedColors> {
    return new Promise((resolve, reject) => {
      if (!this.isValidImageType(imageFile.type)) {
        reject(new Error('Formato de imagen no válido. Solo se aceptan PNG y JPG.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          try {
            const pixels = this.getPixelData(img);
            const clusters = this.kMeans(pixels, ColorExtractionService.K_CLUSTERS, ColorExtractionService.MAX_ITERATIONS);
            const sorted = this.sortByFrequency(clusters);
            const top3 = sorted.slice(0, 3);

            while (top3.length < 3) {
              top3.push({ r: 128, g: 128, b: 128 });
            }

            resolve({
              dominant: this.rgbToHex(top3[0]),
              secondary: this.rgbToHex(top3[1]),
              accent: this.rgbToHex(top3[2])
            });
          } catch (err) {
            reject(new Error('Error al procesar la imagen para extraer colores.'));
          }
        };
        img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
      reader.readAsDataURL(imageFile);
    });
  }

  private isValidImageType(type: string): boolean {
    return type === 'image/png' || type === 'image/jpeg';
  }

  /**
   * Downscale image and extract pixel RGB data using Canvas API
   */
  private getPixelData(img: HTMLImageElement): RgbColor[] {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    const scale = Math.min(
      ColorExtractionService.MAX_DIMENSION / img.width,
      ColorExtractionService.MAX_DIMENSION / img.height,
      1
    );
    canvas.width = Math.max(1, Math.floor(img.width * scale));
    canvas.height = Math.max(1, Math.floor(img.height * scale));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const pixels: RgbColor[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 128) continue; // Skip transparent pixels

      pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
    }

    return pixels;
  }

  /**
   * Simplified k-means clustering for color quantization
   */
  private kMeans(pixels: RgbColor[], k: number, maxIterations: number): { center: RgbColor; count: number }[] {
    if (pixels.length === 0) {
      return [{ center: { r: 128, g: 128, b: 128 }, count: 1 }];
    }

    // Initialize centroids using evenly spaced pixels
    const step = Math.max(1, Math.floor(pixels.length / k));
    let centroids: RgbColor[] = [];
    for (let i = 0; i < k && i * step < pixels.length; i++) {
      centroids.push({ ...pixels[i * step] });
    }

    let assignments: number[] = new Array(pixels.length).fill(0);

    for (let iter = 0; iter < maxIterations; iter++) {
      let changed = false;

      // Assignment step
      for (let i = 0; i < pixels.length; i++) {
        let minDist = Infinity;
        let bestCluster = 0;
        for (let c = 0; c < centroids.length; c++) {
          const dist = this.colorDistance(pixels[i], centroids[c]);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = c;
          }
        }
        if (assignments[i] !== bestCluster) {
          assignments[i] = bestCluster;
          changed = true;
        }
      }

      if (!changed) break;

      // Update step
      const sums: { r: number; g: number; b: number; count: number }[] =
        centroids.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

      for (let i = 0; i < pixels.length; i++) {
        const cluster = assignments[i];
        sums[cluster].r += pixels[i].r;
        sums[cluster].g += pixels[i].g;
        sums[cluster].b += pixels[i].b;
        sums[cluster].count++;
      }

      centroids = sums.map(s => {
        if (s.count === 0) return { r: 128, g: 128, b: 128 };
        return {
          r: Math.round(s.r / s.count),
          g: Math.round(s.g / s.count),
          b: Math.round(s.b / s.count)
        };
      });
    }

    // Count pixels per cluster
    const counts = new Array(centroids.length).fill(0);
    for (const a of assignments) {
      counts[a]++;
    }

    return centroids.map((center, i) => ({ center, count: counts[i] }));
  }

  private colorDistance(a: RgbColor, b: RgbColor): number {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return dr * dr + dg * dg + db * db;
  }

  /**
   * Sort clusters by pixel count descending, filtering near-white/near-black
   */
  private sortByFrequency(clusters: { center: RgbColor; count: number }[]): RgbColor[] {
    const filtered = clusters.filter(c => {
      const { r, g, b } = c.center;
      const brightness = (r + g + b) / 3;
      return brightness > 20 && brightness < 235;
    });

    const sorted = (filtered.length > 0 ? filtered : clusters)
      .sort((a, b) => b.count - a.count);

    return sorted.map(c => c.center);
  }

  private rgbToHex(color: RgbColor): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
  }
}
