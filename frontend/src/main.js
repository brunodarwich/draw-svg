import "./style.css";
import {
  createIcons,
  Brush,
  Eraser,
  PaintBucket,
  MousePointer2,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Images,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Minus,
  Plus,
  Code2,
  Layers3,
  Copy,
  FileCode2,
  Image as ImageIcon,
  LockKeyhole,
  MoveVertical,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  X,
  ImagePlus,
  Check,
  CheckSquare,
  PanelLeft,
  ExternalLink,
  Trash,
  Pencil,
} from "lucide";
import {
  pointsToPathD,
  simplifyRDP,
  isPathClosed,
} from "./engine/geometry.js";
import {
  serializeSvg,
  analyzeSvg,
  escapeXml,
} from "./engine/serializer.js";
import { trackEvent } from "./engine/telemetry.js";
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const iconSet = {
  Brush,
  Eraser,
  PaintBucket,
  MousePointer2,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Images,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Minus,
  Plus,
  Code2,
  Layers3,
  Copy,
  FileCode2,
  Image: ImageIcon,
  LockKeyhole,
  MoveVertical,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  X,
  ImagePlus,
  Check,
  CheckSquare,
  PanelLeft,
  ExternalLink,
  Trash,
  Pencil,
};
const drawIcons = (root) =>
  createIcons({
    icons: iconSet,
    nameAttr: "data-icon",
    attrs: { "stroke-width": 1.8 },
    root,
  });
drawIcons();
const svg = $("#artboard"),
  root = $("#layers-root"),
  wrap = $("#canvas-wrap");
const s = {
  w: 800,
  h: 600,
  zoom: 100,
  tool: "brush",
  color: "#0ea5e9",
  width: 6,
  drawing: false,
  points: [],
  path: null,
  pointerId: null,
  selection: null,
  active: "layer-1",
  history: [],
  hi: -1,
  drag: null,
};
let layers = [
  { id: "layer-1", name: "Camada 1", visible: true, locked: false, opacity: 1 },
];
const initialLayer = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "g",
);
initialLayer.id = "layer-1";
root.append(initialLayer);
const esc = (x) =>
  String(x).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const dbOpen = () =>
  new Promise((ok, no) => {
    let r = indexedDB.open("drawsvg-studio", 1);
    r.onupgradeneeded = () =>
      r.result.createObjectStore("artworks", { keyPath: "id" });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
async function dbAll() {
  try {
    let d = await dbOpen();
    return await new Promise((ok, no) => {
      let r = d.transaction("artworks").objectStore("artworks").getAll();
      r.onsuccess = () =>
        ok(r.result.sort((a, b) => b.updatedAt - a.updatedAt));
      r.onerror = () => no(r.error);
    });
  } catch {
    return [];
  }
}
async function dbPut(v) {
  let d = await dbOpen();
  return new Promise((ok, no) => {
    let t = d.transaction("artworks", "readwrite");
    t.objectStore("artworks").put(v);
    t.oncomplete = ok;
    t.onerror = () => no(t.error);
  });
}
async function dbDel(id) {
  let d = await dbOpen();
  return new Promise((ok, no) => {
    let t = d.transaction("artworks", "readwrite");
    t.objectStore("artworks").delete(id);
    t.oncomplete = ok;
    t.onerror = () => no(t.error);
  });
}
function serialize() {
  const defsEl = $("#artboard-defs");
  return serializeSvg({
    width: s.w,
    height: s.h,
    layers,
    getLayerChildrenHtml: (id) => {
      let g = $(`#${CSS.escape(id)}`);
      return g ? [...g.children].map((n) => n.outerHTML).join("") : "";
    },
    getLayerMaskAttr: (id) => {
      let g = $(`#${CSS.escape(id)}`);
      return g ? g.getAttribute("mask") || "" : "";
    },
    defsHtml: defsEl ? defsEl.innerHTML : "",
    pretty: true,
  });
}
function refreshCode() {
  let xml = serialize();
  let analysis = analyzeSvg(xml);
  $("#file-size").textContent = `${analysis.sizeKb} KB`;
  $("#line-numbers").textContent = analysis.lines.map((_, i) => i + 1).join("\n");
  $("#svg-code").textContent = xml;
}
function empty() {
  $("#empty-hint").classList.toggle(
    "visible",
    !root.querySelector("path,circle,rect,ellipse,polygon,polyline,line"),
  );
}
function buttons() {
  for (let [id, disabled] of [
    ["undo", s.hi <= 0],
    ["redo", s.hi >= s.history.length - 1],
  ]) {
    $("#" + id).disabled = disabled;
    $("#" + id).style.opacity = disabled ? ".4" : "1";
  }
}
function saveHistory() {
  let x = serialize();
  if (s.history[s.hi] === x) return;
  s.history = s.history.slice(0, s.hi + 1);
  s.history.push(x);
  if (s.history.length > 60) s.history.shift();
  s.hi = s.history.length - 1;
  buttons();
  refreshCode();
}
function applySnapshot(xml) {
  let d = new DOMParser().parseFromString(xml, "image/svg+xml"),
    r = d.documentElement;
  if (r.nodeName.toLowerCase() !== "svg" || d.querySelector("parsererror"))
    return;
  let vb = r.getAttribute("viewBox")?.split(/[ ,]+/).map(Number);
  if (vb?.length === 4) {
    s.w = vb[2];
    s.h = vb[3];
  }
  svg.setAttribute("viewBox", `0 0 ${s.w} ${s.h}`);
  $("#dimensions-label").textContent = `${s.w} × ${s.h} px`;
  let sizeOpt = [...$("#size-select").options].find(
    (o) => o.value === `${s.w},${s.h}`,
  );
  if (!sizeOpt) {
    sizeOpt = new Option(`${s.w} × ${s.h}`, `${s.w},${s.h}`);
    $("#size-select").add(sizeOpt);
  }
  $("#size-select").value = sizeOpt.value;

  const defsEl = $("#artboard-defs");
  if (defsEl) {
    defsEl.replaceChildren();
    const srcDefs = r.querySelector("defs");
    if (srcDefs) {
      [...srcDefs.children].forEach((n) =>
        defsEl.append(document.importNode(n, true)),
      );
    }
  }

  layers = [...r.children]
    .filter((n) => n.tagName.toLowerCase() === "g" && n.id !== "layers-root")
    .map((g, i) => ({
      id: g.id || `layer-${i + 1}`,
      name: g.getAttribute("data-name") || `Camada ${i + 1}`,
      visible: g.getAttribute("style") !== "display:none",
      locked: g.getAttribute("data-locked") === "true",
      opacity: Number(g.getAttribute("opacity") ?? 1),
      mask: g.getAttribute("mask") || "",
    }));
  if (!layers.length)
    layers = [
      {
        id: "layer-1",
        name: "Camada 1",
        visible: true,
        locked: false,
        opacity: 1,
        mask: "",
      },
    ];
  root.replaceChildren();
  for (let l of layers) {
    let src = r.querySelector(`#${CSS.escape(l.id)}`),
      g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.id = l.id;
    g.setAttribute("opacity", l.opacity);
    if (l.mask) g.setAttribute("mask", l.mask);
    if (!l.visible) g.style.display = "none";
    if (src)
      [...src.children].forEach((n) => g.append(document.importNode(n, true)));
    root.append(g);
  }
  if (!layers.some((x) => x.id === s.active)) {
    s.active = layers.at(-1).id;
  }
  clearSelection();
  updateLayers();
  refreshCode();
  empty();
}
function createEraserMask(layerId) {
  const layer = $(`#${CSS.escape(layerId)}`);
  if (!layer || !layer.querySelector("[data-draw-id]")) return null;
  let defsEl = $("#artboard-defs");
  if (!defsEl) {
    defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defsEl.id = "artboard-defs";
    svg.prepend(defsEl);
  }
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.id = `mask-${crypto.randomUUID()}`;
  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("maskContentUnits", "userSpaceOnUse");
  mask.setAttribute("mask-type", "luminance");
  mask.setAttribute("x", "0");
  mask.setAttribute("y", "0");
  mask.setAttribute("width", s.w);
  mask.setAttribute("height", s.h);
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", s.w);
  rect.setAttribute("height", s.h);
  rect.setAttribute("fill", "white");
  mask.append(rect);
  defsEl.append(mask);

  // A máscara envolve somente os elementos que já existiam nesta passada.
  // Novos traços ficam fora dela e podem repintar a área apagada.
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("mask", `url(#${mask.id})`);
  const previousMask = layer.getAttribute("mask");
  if (previousMask) {
    const previousGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    previousGroup.setAttribute("mask", previousMask);
    while (layer.firstChild) previousGroup.append(layer.firstChild);
    group.append(previousGroup);
    layer.removeAttribute("mask");
    const info = layers.find((item) => item.id === layerId);
    if (info) info.mask = "";
  } else {
    while (layer.firstChild) group.append(layer.firstChild);
  }
  layer.append(group);
  return mask;
}
function clearSelection() {
  if (s.selection) {
    if (s.selection.elements) {
      s.selection.elements.forEach((el) =>
        el.classList.remove("selected-element"),
      );
    }
  }
  s.selection = null;
}
function selectAll() {
  clearSelection();
  let l = layers.find((x) => x.id === s.active);
  if (!l || l.locked || !l.visible) {
    return toast("A camada ativa está bloqueada ou invisível.");
  }
  const g = $(`#${CSS.escape(s.active)}`);
  const elements = g ? [...g.querySelectorAll("[data-draw-id]")] : [];
  if (!elements.length) {
    return toast("Nenhum elemento na camada ativa.");
  }
  tool("select");
  elements.forEach((el) => el.classList.add("selected-element"));
  s.selection = {
    elements,
    start: null,
    originals: elements.map((el) => ({
      el,
      transform: el.getAttribute("transform") || "",
    })),
  };
  toast(
    `${elements.length} ${elements.length === 1 ? "elemento selecionado" : "elementos selecionados"} (Delete para apagar)`,
  );
}
function applyColorToSelection(color) {
  if (s.selection && s.selection.elements?.length) {
    s.selection.elements.forEach((el) => {
      if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
        el.setAttribute("fill", color);
      } else {
        el.setAttribute("stroke", color);
      }
    });
    saveHistory();
    refreshCode();
  }
}
function updateLayers() {
  let host = $("#layer-list");
  host.innerHTML = "";
  for (let l of [...layers].reverse()) {
    let row = document.createElement("div");
    row.className = `layer-row ${l.id === s.active ? "selected" : ""}`;
    row.draggable = true;
    row.dataset.id = l.id;
    row.innerHTML = `<i class="layer-grip" data-icon="grip-vertical"></i><div class="layer-name"><i data-icon="layers-3"></i><span title="Duplo clique para renomear">${esc(l.name)}</span></div><div class="layer-actions"><button data-action="move-up" title="Mover para cima (frente)"><i data-icon="chevron-up"></i></button><button data-action="move-down" title="Mover para baixo (trás)"><i data-icon="chevron-down"></i></button><button data-action="visibility" class="${l.visible ? "enabled" : ""}" title="Visibilidade"><i data-icon="${l.visible ? "eye" : "eye-off"}"></i></button><button data-action="lock" class="${l.locked ? "enabled" : ""}" title="Bloquear camada"><i data-icon="${l.locked ? "lock" : "unlock"}"></i></button><button data-action="delete" title="Excluir camada"><i data-icon="trash"></i></button></div>`;
    host.append(row);
  }
  drawIcons(host);
  let l = layers.find((x) => x.id === s.active) || layers.at(-1);
  if (l) {
    $("#opacity-range").value = Math.round(l.opacity * 100);
    $("#opacity-output").textContent = `${Math.round(l.opacity * 100)}%`;
    let g = $(`#${CSS.escape(l.id)}`);
    if (g) g.setAttribute("opacity", l.opacity);
  }
}
function tool(t) {
  s.tool = t;
  $$(".tool").forEach((b) =>
    b.classList.toggle("active", b.dataset.tool === t),
  );
  wrap.className = `canvas-wrap tool-${t}`;
}
function pt(e) {
  let p = svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
svg.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  let target = e.target.closest("[data-draw-id]"),
    targetLayer =
      target && layers.find((l) => l.id === target.closest("#layers-root > g")?.id),
    editable = targetLayer && !targetLayer.locked && targetLayer.visible;

  if (s.tool === "select") {
    if (s.selection?.elements?.length) {
      if (target && s.selection.elements.includes(target)) {
        s.selection.start = pt(e);
        svg.setPointerCapture(e.pointerId);
        return;
      }
    }
    clearSelection();
    if (editable && target) {
      s.active = targetLayer.id;
      updateLayers();
      target.classList.add("selected-element");
      s.selection = {
        elements: [target],
        start: pt(e),
        originals: [
          { el: target, transform: target.getAttribute("transform") || "" },
        ],
      };
      svg.setPointerCapture(e.pointerId);
    }
    return;
  }

  let l = layers.find((x) => x.id === s.active);
  if (!l || l.locked || !l.visible) {
    return toast("Selecione uma camada desbloqueada e visível.");
  }

  if (s.tool === "eraser") {
    const mask = createEraserMask(s.active);
    if (!mask) return;

    s.drawing = true;
    s.pointerId = e.pointerId;
    s.points = [pt(e)];
    let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.dataset.type = "eraser-stroke";
    p.setAttribute("d", eraserPathD(s.points));
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "black");
    p.setAttribute("stroke-width", s.width);
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    s.path = p;
    mask.append(p);
    svg.setPointerCapture(e.pointerId);
    return;
  }

  if (s.tool === "fill") {
    let fillTarget = target;
    const clickPoint = pt(e);

    if (!fillTarget) {
      const g = $(`#${CSS.escape(s.active)}`);
      if (g) {
        const paths = [...g.querySelectorAll("[data-draw-id]")].reverse();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        for (const el of paths) {
          const d = el.getAttribute("d");
          if (d && ctx) {
            try {
              const p2d = new Path2D(d);
              if (ctx.isPointInPath(p2d, clickPoint.x, clickPoint.y)) {
                fillTarget = el;
                break;
              }
            } catch {}
          }
        }
      }
    }

    if (!fillTarget) {
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      fillTarget = elements.find((el) => {
        const g = el.closest("g");
        return el.hasAttribute("data-draw-id") && g && g.id === s.active;
      });
    }

    if (!fillTarget) {
      return toast("Clique dentro de uma forma ou sobre um traço para preencher.");
    }

    const ftLayer = layers.find((ly) => ly.id === fillTarget.closest("#layers-root > g")?.id);
    if (!ftLayer || ftLayer.locked || !ftLayer.visible) {
      return toast("Essa forma está em uma camada bloqueada ou oculta.");
    }

    if (fillTarget.tagName.toLowerCase() === "path") {
      let d = (fillTarget.getAttribute("d") || "").trim();
      if (!/z\s*$/i.test(d)) {
        fillTarget.setAttribute("d", `${d} Z`);
      }
    }
    fillTarget.setAttribute("fill", s.color);
    fillTarget.setAttribute("fill-rule", "evenodd");
    saveHistory();
    toast("Forma preenchida");
    trackEvent("shape_filled", { layer_id: ftLayer.id, color: s.color });
    return;
  }

  s.drawing = true;
  s.pointerId = e.pointerId;
  s.points = [pt(e)];
  let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.dataset.drawId = crypto.randomUUID();
  p.setAttribute("d", pointsToPathD(s.points, false, 1));
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", s.color);
  p.setAttribute("stroke-width", s.width);
  p.setAttribute("stroke-linecap", "round");
  p.setAttribute("stroke-linejoin", "round");
  p.setAttribute("vector-effect", "non-scaling-stroke");
  s.path = p;
  $(`#${CSS.escape(s.active)}`).append(p);
  svg.setPointerCapture(e.pointerId);
});
svg.addEventListener("pointermove", (e) => {
  if (s.pointerId !== null && e.pointerId !== s.pointerId) return;
  if (s.selection && s.selection.start && s.selection.elements?.length) {
    let p = pt(e),
      dx = p.x - s.selection.start.x,
      dy = p.y - s.selection.start.y;
    for (let item of s.selection.originals) {
      item.el.setAttribute(
        "transform",
        `${item.transform} translate(${dx.toFixed(1)} ${dy.toFixed(1)})`.trim(),
      );
    }
    refreshCode();
    return;
  }
  if (!s.drawing) return;
  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const ev of events) {
    const p = pt(ev);
    const q = s.points.at(-1);
    if (!q || Math.hypot(p.x - q.x, p.y - q.y) >= 0.8) {
      s.points.push(p);
    }
  }
  s.path.setAttribute("d", s.tool === "eraser" ? eraserPathD(s.points) : pointsToPathD(s.points, false, 1));
  refreshCode();
  empty();
});
function eraserPathD(points) {
  if (points.length === 1) {
    const { x, y } = points[0];
    return `M ${x.toFixed(2)} ${y.toFixed(2)} L ${(x + 0.01).toFixed(2)} ${y.toFixed(2)}`;
  }
  return pointsToPathD(points, false, 1);
}
function finish(e) {
  if (e && s.pointerId !== null && e.pointerId !== s.pointerId) return;
  s.pointerId = null;
  if (s.selection && s.selection.start) {
    for (let item of s.selection.originals) {
      item.transform = item.el.getAttribute("transform") || "";
    }
    s.selection.start = null;
    saveHistory();
    return;
  }
  if (!s.drawing) return;
  s.drawing = false;
  if (s.path) {
    const isEraser = s.tool === "eraser";
    const closed = isEraser ? false : isPathClosed(s.points, s.width);
    const epsilon = Math.max(0.6, s.width * 0.12);
    const simplified = simplifyRDP(s.points, epsilon);
    s.path.setAttribute("d", isEraser ? eraserPathD(simplified) : pointsToPathD(simplified, closed, 1));
    trackEvent(isEraser ? "eraser_stroke_completed" : "stroke_completed", {
      tool: s.tool,
      layer_id: s.active,
      points_count: simplified.length,
      raw_points: s.points.length,
    });
    s.path = null;
    saveHistory();
    empty();
  }
}
svg.addEventListener("pointerup", finish);
svg.addEventListener("pointercancel", finish);
$$(".tool").forEach((b) => (b.onclick = () => tool(b.dataset.tool)));
$$(".swatch").forEach(
  (b) =>
    (b.onclick = () => {
      s.color = b.dataset.color;
      $("#color-picker").value = s.color;
      $$(".swatch").forEach((x) => x.classList.toggle("selected", x === b));
      applyColorToSelection(s.color);
    }),
);
$("#color-picker").oninput = (e) => {
  s.color = e.target.value;
  $$(".swatch").forEach((x) => x.classList.remove("selected"));
  applyColorToSelection(s.color);
};
$("#stroke-width").oninput = (e) => {
  s.width = +e.target.value;
  $("#stroke-output").value = s.width;
  $("#stroke-preview").style.width = $("#stroke-preview").style.height =
    `${Math.min(s.width, 20)}px`;
};
$("#undo").onclick = () => {
  if (s.hi > 0) {
    applySnapshot(s.history[--s.hi]);
    buttons();
  }
};
$("#redo").onclick = () => {
  if (s.hi < s.history.length - 1) {
    applySnapshot(s.history[++s.hi]);
    buttons();
  }
};
$("#clear").onclick = () => {
  if (!root.querySelector("path,circle,rect,ellipse,polygon,polyline,line"))
    return toast("A prancheta já está vazia.");
  root.querySelectorAll("g").forEach((g) => {
    g.replaceChildren();
    g.removeAttribute("mask");
  });
  const defsEl = $("#artboard-defs");
  if (defsEl) defsEl.replaceChildren();
  layers.forEach((l) => (l.mask = ""));
  clearSelection();
  saveHistory();
  empty();
  toast("Prancheta limpa");
};
const selectAllBtn = $("#select-all-btn");
if (selectAllBtn) selectAllBtn.onclick = selectAll;
$("#size-select").onchange = (e) => {
  [s.w, s.h] = e.target.value.split(",").map(Number);
  svg.setAttribute("viewBox", `0 0 ${s.w} ${s.h}`);
  $("#dimensions-label").textContent = `${s.w} × ${s.h} px`;
  saveHistory();
};
function zoom(n) {
  s.zoom = Math.max(40, Math.min(160, n));
  $("#zoom-value").textContent = `${s.zoom}%`;
  wrap.style.transform = `scale(${s.zoom / 100})`;
  wrap.style.transformOrigin = "center";
}
$("#zoom-in").onclick = () => zoom(s.zoom + 10);
$("#zoom-out").onclick = () => zoom(s.zoom - 10);
$("#zoom-value").onclick = () => zoom(100);
$("#add-layer").onclick = () => {
  let l = {
    id: `layer-${Date.now()}`,
    name: `Camada ${layers.length + 1}`,
    visible: true,
    locked: false,
    opacity: 1,
  };
  layers.push(l);
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.id = l.id;
  root.append(g);
  s.active = l.id;
  updateLayers();
  saveHistory();
  toast("Camada adicionada");
};
$("#layer-list").onclick = (e) => {
  let row = e.target.closest(".layer-row");
  if (!row) return;
  let l = layers.find((x) => x.id === row.dataset.id),
    a = e.target.closest("button")?.dataset.action;
  if (a === "move-up") {
    let idx = layers.findIndex((x) => x.id === l.id);
    if (idx < layers.length - 1) {
      let [item] = layers.splice(idx, 1);
      layers.splice(idx + 1, 0, item);
      layers.forEach((ly) => root.append($(`#${CSS.escape(ly.id)}`)));
      updateLayers();
      saveHistory();
      toast("Camada movida para cima");
    }
  } else if (a === "move-down") {
    let idx = layers.findIndex((x) => x.id === l.id);
    if (idx > 0) {
      let [item] = layers.splice(idx, 1);
      layers.splice(idx - 1, 0, item);
      layers.forEach((ly) => root.append($(`#${CSS.escape(ly.id)}`)));
      updateLayers();
      saveHistory();
      toast("Camada movida para baixo");
    }
  } else if (a === "delete") {
    if (layers.length === 1) return toast("Mantenha pelo menos uma camada.");
    $(`#${CSS.escape(l.id)}`).remove();
    const defsEl = $("#artboard-defs");
    if (defsEl) {
      const usedMaskIds = new Set(
        [...root.querySelectorAll("[mask]")]
          .map((node) => node.getAttribute("mask")?.match(/^url\(#(.+)\)$/)?.[1])
          .filter(Boolean),
      );
      defsEl.querySelectorAll("mask").forEach((mask) => {
        if (!usedMaskIds.has(mask.id)) mask.remove();
      });
    }
    layers = layers.filter((x) => x.id !== l.id);
    if (s.active === l.id) s.active = layers.at(-1).id;
    clearSelection();
    updateLayers();
    saveHistory();
    toast("Camada excluída");
  } else if (a === "visibility") {
    l.visible = !l.visible;
    $(`#${CSS.escape(l.id)}`).style.display = l.visible ? "" : "none";
    updateLayers();
    saveHistory();
  } else if (a === "lock") {
    l.locked = !l.locked;
    updateLayers();
    saveHistory();
    toast(l.locked ? "Camada bloqueada" : "Camada desbloqueada");
  } else {
    s.active = l.id;
    updateLayers();
  }
};
$("#layer-list").ondblclick = (e) => {
  let span = e.target.closest(".layer-name span");
  if (!span) return;
  let l = layers.find((x) => x.id === span.closest(".layer-row").dataset.id),
    i = document.createElement("input");
  i.value = l.name;
  span.replaceWith(i);
  i.focus();
  i.select();
  i.onblur = () => {
    l.name = i.value.trim() || l.name;
    updateLayers();
    saveHistory();
  };
  i.onkeydown = (e) => {
    if (e.key === "Enter") i.blur();
    if (e.key === "Escape") {
      i.value = l.name;
      i.blur();
    }
  };
};
$("#layer-list").ondragstart = (e) => {
  let r = e.target.closest(".layer-row");
  if (r) {
    s.drag = r.dataset.id;
    r.classList.add("dragging");
  }
};
$("#layer-list").ondragover = (e) => {
  e.preventDefault();
  e.target.closest(".layer-row")?.classList.add("drag-over");
};
$("#layer-list").ondragleave = (e) => {
  e.target.closest(".layer-row")?.classList.remove("drag-over");
};
$("#layer-list").ondrop = (e) => {
  e.preventDefault();
  let r = e.target.closest(".layer-row");
  $$(".layer-row").forEach((row) =>
    row.classList.remove("drag-over", "dragging"),
  );
  if (!r || !s.drag || r.dataset.id === s.drag) return;
  let fromIdx = layers.findIndex((x) => x.id === s.drag),
    toIdx = layers.findIndex((x) => x.id === r.dataset.id);
  if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
    let [m] = layers.splice(fromIdx, 1);
    layers.splice(toIdx, 0, m);
    layers.forEach((l) => root.append($(`#${CSS.escape(l.id)}`)));
    s.drag = null;
    updateLayers();
    saveHistory();
    toast("Camadas reordenadas");
  }
};
$("#opacity-range").oninput = (e) => {
  let l = layers.find((x) => x.id === s.active);
  l.opacity = +e.target.value / 100;
  $("#opacity-output").textContent = `${e.target.value}%`;
  $(`#${CSS.escape(l.id)}`).setAttribute("opacity", l.opacity);
  refreshCode();
};
$("#opacity-range").onchange = saveHistory;
function toast(msg) {
  let t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window._toast);
  window._toast = setTimeout(() => t.classList.remove("show"), 2200);
}
$("#copy-code").onclick = async () => {
  try {
    const xml = serialize();
    await navigator.clipboard.writeText(xml);
    trackEvent("svg_copied_clipboard", {
      svg_length_bytes: xml.length,
      elements_count: root.querySelectorAll("path,circle,rect,ellipse,polygon,polyline,line").length,
    });
    toast("Código SVG copiado");
  } catch {
    toast("Área de transferência indisponível");
  }
};
function download(name, blob) {
  let u = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
$("#export-svg").onclick = () => {
  const xml = serialize();
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  download("meu-desenho.svg", blob);
  trackEvent("artwork_exported", {
    format: "svg",
    file_size_kb: +(blob.size / 1024).toFixed(1),
  });
};
$("#export-png").onclick = () => {
  let u = URL.createObjectURL(
      new Blob([serialize()], { type: "image/svg+xml" }),
    ),
    im = new Image();
  im.onload = () => {
    let c = document.createElement("canvas");
    c.width = s.w;
    c.height = s.h;
    let x = c.getContext("2d");
    x.fillStyle = "#fff";
    x.fillRect(0, 0, s.w, s.h);
    x.drawImage(im, 0, 0);
    c.toBlob((b) => {
      if (b) {
        download("meu-desenho.png", b);
        trackEvent("artwork_exported", {
          format: "png",
          file_size_kb: +(b.size / 1024).toFixed(1),
        });
      }
      URL.revokeObjectURL(u);
    }, "image/png");
  };
  im.onerror = () => {
    URL.revokeObjectURL(u);
    toast("Falha ao exportar PNG");
  };
  im.src = u;
};
const dlg = $("#save-dialog");
$("#save").onclick = () => {
  $("#artwork-name").value =
    `Desenho ${new Date().toLocaleDateString("pt-BR")}`;
  dlg.showModal();
  $("#artwork-name").select();
};
$("#save-form").onsubmit = async (e) => {
  if (e.submitter?.value !== "save") return;
  e.preventDefault();
  try {
    const newId = crypto.randomUUID();
    await dbPut({
      id: newId,
      name: $("#artwork-name").value.trim() || "Desenho sem título",
      svg: serialize(),
      updatedAt: Date.now(),
    });
    trackEvent("artwork_saved_gallery", {
      artwork_id: newId,
      layers_count: layers.length,
    });
    dlg.close();
    toast("Desenho salvo na galeria");
    await renderGallery();
  } catch {
    toast("Não foi possível salvar neste dispositivo");
  }
};
function openGallery() {
  $("#gallery-drawer").classList.add("open");
  $("#gallery-drawer").setAttribute("aria-hidden", "false");
  $("#drawer-backdrop").classList.add("open");
  renderGallery();
}
function closeGallery() {
  $("#gallery-drawer").classList.remove("open");
  $("#gallery-drawer").setAttribute("aria-hidden", "true");
  $("#drawer-backdrop").classList.remove("open");
}
$("#gallery-open").onclick = openGallery;
$("#gallery-close").onclick = closeGallery;
$("#drawer-backdrop").onclick = closeGallery;
$("#gallery-start").onclick = closeGallery;
async function renderGallery() {
  let items = await dbAll(),
    grid = $("#gallery-grid");
  $("#gallery-count").textContent = items.length;
  $("#gallery-subtitle").textContent =
    `${items.length} ${items.length === 1 ? "desenho salvo" : "desenhos salvos"}`;
  $("#gallery-empty").classList.toggle("hidden", items.length > 0);
  grid.replaceChildren();
  for (let a of items) {
    let card = document.createElement("article");
    card.className = "gallery-card";
    card.dataset.id = a.id;
    let th = document.createElement("div");
    th.className = "thumb";
    let doc = new DOMParser().parseFromString(a.svg, "image/svg+xml"),
      im = doc.documentElement;
    im.removeAttribute("width");
    im.removeAttribute("height");
    th.append(document.importNode(im, true));
    let meta = document.createElement("div");
    meta.className = "card-meta";
    let h = document.createElement("h3");
    h.textContent = a.name;
    let time = document.createElement("time");
    time.dateTime = new Date(a.updatedAt).toISOString();
    time.textContent = new Date(a.updatedAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    meta.append(h, time);
    let acts = document.createElement("div");
    acts.className = "card-actions";
    acts.innerHTML =
      '<button class="button primary" data-action="open"><i data-icon="external-link"></i> Abrir no estúdio</button><button class="icon-button" data-action="duplicate" title="Duplicar"><i data-icon="copy"></i></button><button class="icon-button" data-action="delete" title="Excluir"><i data-icon="trash"></i></button>';
    card.append(th, meta, acts);
    grid.append(card);
  }
  drawIcons(grid);
}
$("#gallery-grid").ondblclick = async (e) => {
  let title = e.target.closest(".card-meta h3");
  if (!title) return;
  let card = title.closest(".gallery-card"),
    item = (await dbAll()).find((x) => x.id === card.dataset.id);
  if (!item) return;
  let input = document.createElement("input");
  input.value = item.name;
  title.replaceWith(input);
  input.focus();
  input.select();
  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") {
      input.value = item.name;
      input.blur();
    }
  };
  input.onblur = async () => {
    let name = input.value.trim();
    if (name) item.name = name;
    item.updatedAt = Date.now();
    await dbPut(item);
    await renderGallery();
  };
};
$("#gallery-grid").onclick = async (e) => {
  let card = e.target.closest(".gallery-card"),
    a = e.target.closest("[data-action]")?.dataset.action;
  if (!card || !a) return;
  let item = (await dbAll()).find((x) => x.id === card.dataset.id);
  if (!item) return;
  if (a === "open") {
    applySnapshot(item.svg);
    s.history = [serialize()];
    s.hi = 0;
    buttons();
    closeGallery();
    toast("Desenho aberto no estúdio");
  } else if (a === "duplicate") {
    await dbPut({
      ...item,
      id: crypto.randomUUID(),
      name: `${item.name} (cópia)`,
      updatedAt: Date.now(),
    });
    await renderGallery();
    toast("Cópia criada");
  } else {
    await dbDel(item.id);
    await renderGallery();
    toast("Desenho excluído");
  }
};
$("#mobile-menu").onclick = () => {
  const opened = $("#inspector").classList.toggle("mobile-open");
  if (opened && !$(".inspector-tab.active")) {
    $(".inspector-tab[data-panel='code']").classList.add("active");
  }
};
$$(".inspector-tab").forEach((b) => {
  b.onclick = () => {
    const workspace = $(".workspace");
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const alreadyOpen =
      !workspace.classList.contains("inspector-collapsed") &&
      b.classList.contains("active");
    if (!isMobile && alreadyOpen) {
      workspace.classList.add("inspector-collapsed");
      b.classList.remove("active");
      return;
    }
    workspace.classList.remove("inspector-collapsed");
    $$(".inspector-tab").forEach((tab) =>
      tab.classList.toggle("active", tab === b),
    );
    $("#code-panel").classList.toggle("hidden", b.dataset.panel !== "code");
    $("#layers-panel").classList.toggle("hidden", b.dataset.panel !== "layers");
    if (isMobile) $("#inspector").classList.add("mobile-open");
  };
});
document.onkeydown = (e) => {
  if (e.key === "Escape") {
    closeGallery();
    clearSelection();
  }
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName))
    return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
    e.preventDefault();
    selectAll();
    return;
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    if (s.selection && s.selection.elements?.length) {
      e.preventDefault();
      const count = s.selection.elements.length;
      s.selection.elements.forEach((el) => el.remove());
      clearSelection();
      saveHistory();
      empty();
      toast(
        `${count} ${count === 1 ? "elemento excluído" : "elementos excluídos"}`,
      );
      return;
    }
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    (e.shiftKey ? $("#redo") : $("#undo")).click();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault();
    $("#redo").click();
  } else if (!e.ctrlKey && !e.metaKey) {
    let k = e.key.toLowerCase();
    if (k === "b") tool("brush");
    if (k === "e") tool("eraser");
    if (k === "g") tool("fill");
    if (k === "v") tool("select");
  }
};
saveHistory();
updateLayers();
refreshCode();
empty();
renderGallery();
