/**
 * DrawSVG Studio - SVG Serializer & Code Engine
 * Serializa a árvore DOM de camadas e elementos em SVG semântico, limpo e indentado.
 */

/**
 * Escapa caracteres HTML/XML especiais.
 */
export function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[c]));
}

/**
 * Serializa prancheta e camadas em string SVG semântica e limpa.
 * 
 * @param {object} options
 * @param {number} options.width - Largura da prancheta.
 * @param {number} options.height - Altura da prancheta.
 * @param {Array<object>} options.layers - Metadados das camadas.
 * @param {Function} options.getLayerChildrenHtml - Função que retorna o HTML interno do grupo da camada.
 * @param {boolean} [options.pretty=true] - Se deve formatar com quebras de linha e indentação.
 * @returns {string} String do SVG serializado.
 */
export function serializeSvg({ width, height, layers, getLayerChildrenHtml, getLayerMaskAttr, defsHtml = '', pretty = true }) {
  const indent = pretty ? '  ' : '';
  const newline = pretty ? '\n' : '';

  let xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${newline}`;

  if (defsHtml && defsHtml.trim()) {
    if (pretty) {
      xml += `${indent}<defs>${newline}`;
      const defLines = defsHtml
        .replace(/></g, `>${newline}<`)
        .split(newline)
        .filter((l) => l.trim().length > 0);
      for (const line of defLines) {
        xml += `${indent}${indent}${line.trim()}${newline}`;
      }
      xml += `${indent}</defs>${newline}`;
    } else {
      xml += `<defs>${defsHtml.trim()}</defs>`;
    }
  }

  for (const layer of layers) {
    const layerContent = getLayerChildrenHtml ? getLayerChildrenHtml(layer.id) : '';
    const visibleAttr = layer.visible ? '' : ' style="display:none"';
    const lockedAttr = layer.locked ? ' data-locked="true"' : ' data-locked="false"';
    const opacityAttr = ` opacity="${layer.opacity ?? 1}"`;
    const nameAttr = ` data-name="${escapeXml(layer.name)}"`;
    const maskVal = getLayerMaskAttr ? getLayerMaskAttr(layer.id) : (layer.mask || '');
    const maskAttr = maskVal ? ` mask="${escapeXml(maskVal)}"` : '';

    if (pretty) {
      xml += `${indent}<g id="${escapeXml(layer.id)}"${nameAttr}${lockedAttr}${opacityAttr}${visibleAttr}${maskAttr}>${newline}`;
      if (layerContent.trim()) {
        const lines = layerContent
          .replace(/></g, `>${newline}<`)
          .split(newline)
          .filter((l) => l.trim().length > 0);
        for (const line of lines) {
          xml += `${indent}${indent}${line.trim()}${newline}`;
        }
      }
      xml += `${indent}</g>${newline}`;
    } else {
      xml += `<g id="${escapeXml(layer.id)}"${nameAttr}${lockedAttr}${opacityAttr}${visibleAttr}${maskAttr}>${layerContent.trim()}</g>`;
    }
  }

  xml += '</svg>';
  return xml;
}

/**
 * Calcula métricas do código SVG (tamanho em KB, linhas e total de elementos vetoriais).
 */
export function analyzeSvg(svgXml) {
  const bytes = new Blob([svgXml]).size;
  const sizeKb = +(bytes / 1024).toFixed(1);
  const lines = svgXml.split('\n');
  const pathMatches = svgXml.match(/<path|<circle|<rect|<polygon|<ellipse|<polyline|<line/g);
  const elementsCount = pathMatches ? pathMatches.length : 0;

  return {
    bytes,
    sizeKb,
    lineCount: lines.length,
    elementsCount,
    lines,
  };
}
