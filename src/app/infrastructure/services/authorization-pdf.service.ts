/**
 * Authorization PDF Generator Service
 * Generates a professional invitation-style PDF for sharing visitor authorizations.
 * Uses jsPDF for client-side PDF generation with brand styling.
 */
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Authorization, SERVICE_TYPE_LABELS, STATUS_LABELS } from '@domain/models/authorization/authorization.model';

/** Brand colors matching global CSS variables */
const BRAND = {
  primary: '#B01129',
  primaryDark: '#8A0D20',
  primaryLight: '#D64A5E',
  success: '#28a745',
  successLight: '#d4edda',
  error: '#dc3545',
  warning: '#e0a800',
  warningLight: '#fff3cd',
  gray50: '#f8f9fa',
  gray100: '#f1f3f5',
  gray200: '#e9ecef',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  white: '#ffffff',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthorizationPdfService {

  /**
   * Generates and downloads a professional authorization PDF.
   * @param auth - The authorization data
   * @param qrImageUrl - URL of the QR code image
   * @param organizationName - Name of the organization (optional)
   */
  async generatePdf(auth: Authorization, qrImageUrl: string, organizationName?: string): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let y = 0;

    // ─── Background ───
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // ─── Top Accent Bar ───
    const gradientSteps = 50;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = 255;
      const g = Math.round(140 + (107 - 140) * ratio);
      const b = Math.round(97 + (61 - 97) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect((pageWidth / gradientSteps) * i, 0, pageWidth / gradientSteps + 1, 6, 'F');
    }
    y = 6;

    // ─── Header Card ───
    y += 8;
    this.roundedRect(doc, margin - 4, y, contentWidth + 8, 52, 4, BRAND.white);
    y += 8;

    // App Icon (shield icon drawn manually)
    this.drawShieldIcon(doc, margin + 4, y, 18);

    // Organization Name + Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text(organizationName || 'Atlas Platform', margin + 26, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.text('Autorización de Ingreso', margin + 26, y + 15);

    // Authorization ID + Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(173, 181, 189);
    doc.text(`ID: #${auth.id}`, pageWidth - margin - 4, y + 8, { align: 'right' });
    doc.text(this.formatDateShort(auth.createdAt), pageWidth - margin - 4, y + 14, { align: 'right' });

    // Status badge
    y += 24;
    const statusLabel = STATUS_LABELS[auth.status] || auth.status;
    this.drawStatusBadge(doc, margin + 4, y, statusLabel, auth.status);

    y += 22;

    // ─── Decorative Divider ───
    this.drawDivider(doc, margin, y, contentWidth);
    y += 10;

    // ─── Visitor Section ───
    y = this.drawSectionHeader(doc, margin, y, 'DATOS DEL VISITANTE', '');
    y += 4;

    this.roundedRect(doc, margin, y, contentWidth, 52, 3, BRAND.white);
    y += 6;
    y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Nombre completo', auth.personName);
    y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Documento de identidad', auth.personDocument);
    y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Tipo de servicio', SERVICE_TYPE_LABELS[auth.serviceType] || auth.serviceType, true);
    y += 8;

    // ─── Validity Section ───
    y = this.drawSectionHeader(doc, margin, y, 'VIGENCIA DE LA AUTORIZACIÓN', '');
    y += 4;

    this.roundedRect(doc, margin, y, contentWidth, 38, 3, BRAND.white);
    y += 6;
    y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Válida desde', this.formatDateTime(auth.validFrom));
    y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Válida hasta', this.formatDateTime(auth.validTo), true);
    y += 8;

    // ─── Vehicle Section (if applicable) ───
    if (auth.vehiclePlate) {
      y = this.drawSectionHeader(doc, margin, y, 'VEHÍCULO AUTORIZADO', '');
      y += 4;
      const vehicleRows = 1 + (auth.vehicleType ? 1 : 0) + (auth.vehicleColor ? 1 : 0);
      const vehicleHeight = 10 + vehicleRows * 14;
      this.roundedRect(doc, margin, y, contentWidth, vehicleHeight, 3, BRAND.white);
      y += 6;
      const hasMore = !!(auth.vehicleType || auth.vehicleColor);
      y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Placa', auth.vehiclePlate, !hasMore);
      if (auth.vehicleType) {
        y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Tipo', auth.vehicleType, !auth.vehicleColor);
      }
      if (auth.vehicleColor) {
        y = this.drawInfoRow(doc, margin + 8, y, contentWidth - 16, 'Color', auth.vehicleColor, true);
      }
      y += 8;
    }

    // ─── QR Code Section ───
    y = this.drawSectionHeader(doc, margin, y, 'CÓDIGO QR DE ACCESO', '');
    y += 4;

    const qrCardHeight = 80;
    this.roundedRect(doc, margin, y, contentWidth, qrCardHeight, 3, BRAND.white);

    // Try to load QR image
    const qrSize = 55;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = y + 6;

    try {
      const qrImg = await this.loadImage(qrImageUrl);
      doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch {
      // Fallback: draw a placeholder
      doc.setFillColor(241, 243, 245);
      doc.rect(qrX, qrY, qrSize, qrSize, 'F');
      doc.setFontSize(9);
      doc.setTextColor(173, 181, 189);
      doc.text('QR no disponible', pageWidth / 2, qrY + qrSize / 2, { align: 'center' });
    }

    // Instruction text under QR
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text('Presente este código en portería para validar su ingreso', pageWidth / 2, y + qrCardHeight - 10, { align: 'center' });

    // ─── Footer ───
    this.drawFooter(doc, pageWidth, pageHeight, margin, organizationName);

    // ─── Download ───
    const filename = `autorizacion-${auth.personName.replaceAll(/\s+/g, '-').toLowerCase()}-${auth.id}.pdf`;
    doc.save(filename);
  }

  // ═══════════════════════════════════════════════════════════
  //  Drawing Helpers
  // ═══════════════════════════════════════════════════════════

  private roundedRect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, fillColor: string): void {
    const [red, green, blue] = this.hexToRgb(fillColor);
    doc.setFillColor(red, green, blue);
    doc.setDrawColor(233, 236, 239);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  }

  private drawShieldIcon(doc: jsPDF, x: number, y: number, size: number): void {
    // Draw a shield shape with the brand color
    const cx = x + size / 2;
    const cy = y + size / 2;
    const s = size * 0.45;

    // Background circle
    doc.setFillColor(...this.hexToRgb(BRAND.primary));
    doc.circle(cx, cy, size / 2, 'F');

    // White checkmark inside
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.2);
    doc.line(cx - s * 0.35, cy + s * 0.05, cx - s * 0.05, cy + s * 0.35);
    doc.line(cx - s * 0.05, cy + s * 0.35, cx + s * 0.4, cy - s * 0.35);
  }

  private drawStatusBadge(doc: jsPDF, x: number, y: number, label: string, status: string): void {
    let bgColor: string;
    let textColor: string;

    switch (status) {
      case 'ACTIVE':
        bgColor = BRAND.successLight;
        textColor = '#155724';
        break;
      case 'REVOKED':
        bgColor = '#f8d7da';
        textColor = '#721c24';
        break;
      case 'EXPIRED':
        bgColor = BRAND.warningLight;
        textColor = '#856404';
        break;
      default:
        bgColor = BRAND.gray100;
        textColor = BRAND.gray700;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const textWidth = doc.getTextWidth(label);
    const padX = 8;
    const padY = 3;
    const badgeWidth = textWidth + padX * 2;
    const badgeHeight = 7;

    doc.setFillColor(...this.hexToRgb(bgColor));
    doc.roundedRect(x, y, badgeWidth, badgeHeight, 3, 3, 'F');

    doc.setTextColor(...this.hexToRgb(textColor));
    doc.text(label.toUpperCase(), x + padX, y + padY + 2.5);
  }

  private drawSectionHeader(doc: jsPDF, x: number, y: number, title: string, _icon: string): number {
    // Small accent line
    doc.setFillColor(...this.hexToRgb(BRAND.primary));
    doc.rect(x, y, 3, 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...this.hexToRgb(BRAND.gray700));
    doc.text(title, x + 7, y + 4);

    return y + 10;
  }

  private drawInfoRow(doc: jsPDF, x: number, y: number, width: number, label: string, value: string, isLast = false): number {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...this.hexToRgb(BRAND.gray600));
    doc.text(label, x, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...this.hexToRgb(BRAND.gray900));
    doc.text(value || '-', x + width - 4, y + 4, { align: 'right' });

    if (!isLast) {
      doc.setDrawColor(241, 243, 245);
      doc.setLineWidth(0.3);
      doc.line(x, y + 10, x + width, y + 10);
    }

    return y + 14;
  }

  private drawDivider(doc: jsPDF, x: number, y: number, width: number): void {
    const dotSize = 1;
    const dotSpacing = 4;
    const centerX = x + width / 2;
    const totalDots = 3;
    doc.setFillColor(...this.hexToRgb(BRAND.primary));
    for (let i = 0; i < totalDots; i++) {
      const dx = centerX + (i - 1) * dotSpacing;
      doc.circle(dx, y, dotSize, 'F');
    }
  }

  private drawFooter(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, orgName?: string): void {
    const footerY = pageHeight - 22;

    // Separator line
    doc.setDrawColor(233, 236, 239);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...this.hexToRgb(BRAND.gray600));
    doc.text(
      'Este documento es una autorización de ingreso generada digitalmente.',
      pageWidth / 2, footerY + 6, { align: 'center' }
    );
    doc.text(
      `${orgName || 'Atlas Platform'} — Documento generado el ${this.formatDateTime(new Date().toISOString())}`,
      pageWidth / 2, footerY + 11, { align: 'center' }
    );
    doc.setFontSize(7);
    doc.setTextColor(...this.hexToRgb(BRAND.gray600));
    doc.text(
      'Presente este documento junto con su documento de identidad en portería.',
      pageWidth / 2, footerY + 16, { align: 'center' }
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  Utility Methods
  // ═══════════════════════════════════════════════════════════

  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context error'));
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = url;
    });
  }

  private hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      Number.parseInt(h.substring(0, 2), 16),
      Number.parseInt(h.substring(2, 4), 16),
      Number.parseInt(h.substring(4, 6), 16),
    ];
  }

  private formatDateTime(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  private formatDateShort(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
