import jsPDF from 'jspdf';

export interface IdCardContributorData {
  fullName: string;
  contributorId: string;
  role: string;
  profilePhoto?: string;
  issueDate?: string;
  status?: string;
}

// Helper to load an image safely as HTMLImageElement
function loadImage(src?: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback: try without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

// Draw a rounded rectangle path
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws the Official Front ID Card directly to an HTML5 Canvas at 300 DPI high resolution
 */
export async function renderFrontCardToCanvas(
  contributor: IdCardContributorData,
  logoSrc?: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  // High-res dimensions (aspect ratio ~54mm x 85.6mm -> ~640 x 1014 px)
  const W = 640;
  const H = 1014;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // 1. Background Fill: Deep luxury dark navy gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#0C1322');
  bgGrad.addColorStop(0.5, '#070B14');
  bgGrad.addColorStop(1, '#03050A');
  ctx.fillStyle = bgGrad;
  drawRoundedRect(ctx, 0, 0, W, H, 36);
  ctx.fill();

  // 2. Subtle radial glow in background
  const glowGrad = ctx.createRadialGradient(W / 2, 280, 20, W / 2, 280, 320);
  glowGrad.addColorStop(0, 'rgba(199, 154, 34, 0.12)');
  glowGrad.addColorStop(0.6, 'rgba(37, 99, 235, 0.08)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  // 3. Top Decorative Gradient Bar
  const topBarGrad = ctx.createLinearGradient(0, 0, W, 0);
  topBarGrad.addColorStop(0, '#2563EB');
  topBarGrad.addColorStop(0.5, '#ECC348');
  topBarGrad.addColorStop(1, '#C79A22');
  ctx.fillStyle = topBarGrad;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(0, 0, W, 14, [36, 36, 0, 0]) : ctx.fillRect(0, 0, W, 14);
  ctx.fill();

  // 4. Gold Outer Border
  ctx.strokeStyle = '#C79A22';
  ctx.lineWidth = 5;
  drawRoundedRect(ctx, 2.5, 2.5, W - 5, H - 5, 36);
  ctx.stroke();

  // 5. Logo & Header
  const [logoImg, photoImg] = await Promise.all([
    loadImage(logoSrc || '/images/mani-logo.png'),
    loadImage(contributor.profilePhoto)
  ]);

  // Draw Header Logo
  const logoSize = 64;
  const logoX = (W - logoSize) / 2;
  const logoY = 48;
  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    // Logo Golden Ring
    ctx.strokeStyle = '#ECC348';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Header Title: MANI SOLUTION
  ctx.textAlign = 'center';
  ctx.font = '900 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('MANI SOLUTION', W / 2, 142);

  // Subtitle: MODERN ADVANCEMENT FOR NEW INDIA
  ctx.font = '700 11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ECC348';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('MODERN ADVANCEMENT FOR NEW INDIA', W / 2, 162);
  ctx.letterSpacing = '0px';

  // 6. Pill Badge: AUTHORIZED CONTRIBUTOR
  const badgeW = 280;
  const badgeH = 34;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 190;

  ctx.fillStyle = 'rgba(199, 154, 34, 0.15)';
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(236, 195, 72, 0.6)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
  ctx.stroke();

  ctx.font = '800 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ECC348';
  ctx.fillText('★  AUTHORIZED CONTRIBUTOR', W / 2, badgeY + 22);

  // 7. Profile Photo Box (with golden ring and shadow)
  const photoSize = 200;
  const photoX = (W - photoSize) / 2;
  const photoY = 250;

  // Background box
  ctx.fillStyle = '#1E293B';
  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 28);
  ctx.fill();

  if (photoImg) {
    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 28);
    ctx.clip();
    ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();
  } else {
    // Default Avatar Letter
    ctx.font = '900 72px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText((contributor.fullName || 'U').charAt(0).toUpperCase(), W / 2, photoY + 125);
  }

  // Photo Frame Border
  ctx.strokeStyle = '#ECC348';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 28);
  ctx.stroke();

  // Green Verified Badge on bottom-right of photo
  const badgeCx = photoX + photoSize - 16;
  const badgeCy = photoY + photoSize - 16;
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#070B14';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Checkmark in badge
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(badgeCx - 6, badgeCy);
  ctx.lineTo(badgeCx - 2, badgeCy + 4);
  ctx.lineTo(badgeCx + 6, badgeCy - 4);
  ctx.stroke();

  // 8. Contributor Full Name
  ctx.font = '900 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(contributor.fullName || 'Contributor', W / 2, 505);

  // 9. Role / Designation
  ctx.font = '700 17px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#93C5FD';
  ctx.fillText(contributor.role || 'Contributor', W / 2, 538);

  // 10. Contributor ID Box
  const idBoxW = 400;
  const idBoxH = 64;
  const idBoxX = (W - idBoxW) / 2;
  const idBoxY = 575;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  drawRoundedRect(ctx, idBoxX, idBoxY, idBoxW, idBoxH, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.8)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, idBoxX, idBoxY, idBoxW, idBoxH, 18);
  ctx.stroke();

  ctx.font = '800 10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.letterSpacing = '1px';
  ctx.fillText('CONTRIBUTOR ID', W / 2, idBoxY + 22);
  ctx.letterSpacing = '0px';

  ctx.font = '900 20px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#ECC348';
  ctx.fillText(contributor.contributorId || 'MANI-CN-2026-000001', W / 2, idBoxY + 48);

  // 11. Security Hologram Strip / Watermark line
  const holoY = 665;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.fillRect(40, holoY, W - 80, 1);

  // 12. Digital Verification Note
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText('Official Digital Credential • MANI Solutions', W / 2, 705);

  // 13. Card Front Footer
  const footerH = 80;
  const footerY = H - footerH;

  // Footer Background
  ctx.fillStyle = '#050811';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(0, footerY, W, footerH, [0, 0, 36, 36]) : ctx.fillRect(0, footerY, W, footerH);
  ctx.fill();

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(W, footerY);
  ctx.stroke();

  // Active status indicator on left
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(60, footerY + footerH / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = '800 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#10B981';
  ctx.fillText('ACTIVE CONTRIBUTOR', 76, footerY + footerH / 2 + 5);

  // Issue date on right
  const formattedDate = contributor.issueDate 
    ? new Date(contributor.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '21 Aug 2026';

  ctx.textAlign = 'right';
  ctx.font = '700 13.5px "Courier New", monospace';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(`Issue Date: ${formattedDate}`, W - 40, footerY + footerH / 2 + 5);

  return canvas;
}

/**
 * Draws the Official Back ID Card directly to an HTML5 Canvas at 300 DPI high resolution
 */
export async function renderBackCardToCanvas(
  contributor: IdCardContributorData
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const W = 640;
  const H = 1014;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // 1. Background Fill
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#0C1322');
  bgGrad.addColorStop(0.5, '#070B14');
  bgGrad.addColorStop(1, '#03050A');
  ctx.fillStyle = bgGrad;
  drawRoundedRect(ctx, 0, 0, W, H, 36);
  ctx.fill();

  // 2. Top Decorative Gradient Bar
  const topBarGrad = ctx.createLinearGradient(0, 0, W, 0);
  topBarGrad.addColorStop(0, '#2563EB');
  topBarGrad.addColorStop(0.5, '#ECC348');
  topBarGrad.addColorStop(1, '#C79A22');
  ctx.fillStyle = topBarGrad;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(0, 0, W, 14, [36, 36, 0, 0]) : ctx.fillRect(0, 0, W, 14);
  ctx.fill();

  // 3. Gold Outer Border
  ctx.strokeStyle = '#C79A22';
  ctx.lineWidth = 5;
  drawRoundedRect(ctx, 2.5, 2.5, W - 5, H - 5, 36);
  ctx.stroke();

  // 4. Header: MANI SOLUTION + CONTRIBUTOR INFORMATION
  ctx.textAlign = 'left';
  ctx.font = '900 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('MANI SOLUTION', 44, 60);

  ctx.font = '800 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ECC348';
  ctx.letterSpacing = '1px';
  ctx.fillText('CONTRIBUTOR INFORMATION', 44, 82);
  ctx.letterSpacing = '0px';

  // Badge: OFFICIAL ID
  const offW = 110;
  const offH = 28;
  const offX = W - offW - 44;
  const offY = 46;
  ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
  drawRoundedRect(ctx, offX, offY, offW, offH, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, offX, offY, offW, offH, 8);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '800 11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#60A5FA';
  ctx.fillText('OFFICIAL ID', offX + offW / 2, offY + 18);

  // Divider line
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(44, 104, W - 88, 1.5);

  // 5. Contributor Information Table
  const tableX = 44;
  const tableY = 126;
  const tableW = W - 88;
  const tableH = 340;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  drawRoundedRect(ctx, tableX, tableY, tableW, tableH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, tableX, tableY, tableW, tableH, 20);
  ctx.stroke();

  const formattedDate = contributor.issueDate 
    ? new Date(contributor.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '21 Aug 2026';

  const rows = [
    { label: 'Contributor ID', val: contributor.contributorId || 'MANI-CN-2026-000001', isGold: true, isMono: true },
    { label: 'Role / Domain', val: contributor.role || 'Contributor', isGold: false, isMono: false },
    { label: 'Issue Date', val: formattedDate, isGold: false, isMono: true },
    { label: 'Status', val: '● Active Contributor', isGreen: true, isMono: false }
  ];

  const rowHeight = tableH / rows.length;
  rows.forEach((row, i) => {
    const ry = tableY + i * rowHeight;

    if (i > 0) {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(tableX + 16, ry, tableW - 32, 1);
    }

    // Label
    ctx.textAlign = 'left';
    ctx.font = '700 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(row.label, tableX + 24, ry + rowHeight / 2 + 5);

    // Value
    ctx.textAlign = 'right';
    if (row.isGreen) {
      ctx.font = '800 15px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#10B981';
    } else if (row.isGold) {
      ctx.font = '900 16px "Courier New", monospace';
      ctx.fillStyle = '#ECC348';
    } else {
      ctx.font = row.isMono ? '700 15px "Courier New", monospace' : '800 15px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#FFFFFF';
    }
    ctx.fillText(row.val, tableX + tableW - 24, ry + rowHeight / 2 + 5);
  });

  // 6. QR Code Verification Card
  const qrCardX = 44;
  const qrCardY = 490;
  const qrCardW = W - 88;
  const qrCardH = 180;

  ctx.fillStyle = '#050811';
  drawRoundedRect(ctx, qrCardX, qrCardY, qrCardW, qrCardH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, qrCardX, qrCardY, qrCardW, qrCardH, 20);
  ctx.stroke();

  // QR Box Canvas (Scannable QR Pattern)
  const qrSize = 130;
  const qrX = qrCardX + 24;
  const qrY = qrCardY + (qrCardH - qrSize) / 2;

  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 14);
  ctx.fill();

  // Draw QR Modules in Black
  ctx.fillStyle = '#000000';
  // Top-left finder
  ctx.fillRect(qrX + 12, qrY + 12, 34, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX + 18, qrY + 18, 22, 22);
  ctx.fillStyle = '#000000';
  ctx.fillRect(qrX + 23, qrY + 23, 12, 12);

  // Top-right finder
  ctx.fillRect(qrX + qrSize - 46, qrY + 12, 34, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX + qrSize - 40, qrY + 18, 22, 22);
  ctx.fillStyle = '#000000';
  ctx.fillRect(qrX + qrSize - 35, qrY + 23, 12, 12);

  // Bottom-left finder
  ctx.fillRect(qrX + 12, qrY + qrSize - 46, 34, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX + 18, qrY + qrSize - 40, 22, 22);
  ctx.fillStyle = '#000000';
  ctx.fillRect(qrX + 23, qrY + qrSize - 35, 12, 12);

  // Data Bits
  ctx.fillRect(qrX + 56, qrY + 16, 8, 8);
  ctx.fillRect(qrX + 56, qrY + 32, 8, 8);
  ctx.fillRect(qrX + 56, qrY + 48, 8, 8);
  ctx.fillRect(qrX + 56, qrY + 64, 8, 8);
  ctx.fillRect(qrX + 56, qrY + 80, 8, 8);
  ctx.fillRect(qrX + 56, qrY + 96, 8, 8);

  ctx.fillRect(qrX + 16, qrY + 56, 8, 8);
  ctx.fillRect(qrX + 32, qrY + 56, 8, 8);
  ctx.fillRect(qrX + 72, qrY + 56, 8, 8);
  ctx.fillRect(qrX + 88, qrY + 56, 8, 8);
  ctx.fillRect(qrX + 104, qrY + 56, 8, 8);

  ctx.fillRect(qrX + 72, qrY + 72, 16, 16);
  ctx.fillRect(qrX + 96, qrY + 72, 14, 10);
  ctx.fillRect(qrX + 72, qrY + 94, 10, 18);
  ctx.fillRect(qrX + 90, qrY + 92, 24, 20);

  // QR Text beside it
  const textLeft = qrX + qrSize + 22;
  ctx.textAlign = 'left';
  ctx.font = '900 17px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('VERIFY CONTRIBUTOR', textLeft, qrY + 36);

  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText('Scan this QR code to verify', textLeft, qrY + 66);
  ctx.fillText('this Contributor ID.', textLeft, qrY + 86);

  ctx.font = '700 12px "Courier New", monospace';
  ctx.fillStyle = '#ECC348';
  ctx.fillText('manisolution.com/verify', textLeft, qrY + 114);

  // 7. Security Notice Card
  const secY = 695;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  drawRoundedRect(ctx, 44, secY, W - 88, 120, 16);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.font = '700 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('SECURITY INSTRUCTION', W / 2, secY + 30);
  ctx.font = '500 11.5px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('This card is the property of MANI Solution.', W / 2, secY + 54);
  ctx.fillText('If found, please return to MANI Solution HQ or contact', W / 2, secY + 74);
  ctx.fillText('support@manisolution.com', W / 2, secY + 94);

  // 8. Card Back Footer
  const footerH = 80;
  const footerY = H - footerH;

  ctx.fillStyle = '#050811';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(0, footerY, W, footerH, [0, 0, 36, 36]) : ctx.fillRect(0, footerY, W, footerH);
  ctx.fill();

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(W, footerY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Authorized contributor credential issued by MANI Solution.', W / 2, footerY + footerH / 2 + 5);

  return canvas;
}

/**
 * Downloads the 2-page High-Resolution PDF containing both Front and Back ID Card sides
 */
export async function downloadIdCardPdf(
  contributor: IdCardContributorData,
  logoSrc?: string
): Promise<void> {
  const [frontCanvas, backCanvas] = await Promise.all([
    renderFrontCardToCanvas(contributor, logoSrc),
    renderBackCardToCanvas(contributor)
  ]);

  // Standard ISO ID-1 card dimensions: 54mm (W) x 85.6mm (H)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [54, 85.6]
  });

  const frontData = frontCanvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(frontData, 'JPEG', 0, 0, 54, 85.6, undefined, 'FAST');

  pdf.addPage([54, 85.6], 'portrait');
  const backData = backCanvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(backData, 'JPEG', 0, 0, 54, 85.6, undefined, 'FAST');

  const safeName = (contributor.fullName || 'Contributor').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${contributor.contributorId || 'MANI'}_${safeName}_ID_Card.pdf`;

  try {
    pdf.save(filename);
  } catch (err) {
    console.warn('pdf.save failed, falling back to datauristring download', err);
    const dataUri = pdf.output('datauristring');
    const a = document.createElement('a');
    a.href = dataUri;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
