/**
 * Export a rendered Destiny Matrix SVG (inside `container`) as a PNG file.
 * Pure client-side: serialize the SVG, rasterise it on a canvas, download.
 */
export function exportChartPng(container: HTMLElement | null, filename = 'destiny-matrix.png') {
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const width = 1200;
  const height = 1200;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  const data = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }));
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fdf9f3';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  img.src = url;
}
