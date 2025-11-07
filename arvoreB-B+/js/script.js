// script.js — B / B+ visualizador (corrigido: considera altura do header)

// elementos DOM
const svg = document.getElementById("svgRoot");
const orderInput = document.getElementById("order");
const keyInput = document.getElementById("keyInput");
const insertBtn = document.getElementById("insertBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");
const treeTypeSelect = document.getElementById("treeType");
const canvasWrap = document.getElementById("canvasWrap");
const headerEl = document.querySelector("header");

// coordenadas lógicas
const CANVAS_W = 1200;
const CANVAS_H = 800;
svg.setAttribute("viewBox", `0 0 ${CANVAS_W} ${CANVAS_H}`);
svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

// estado
let tree = null;
let TOP_OFFSET = 80; // valor inicial, será atualizado

// ================= utilitários para ajustar offset do header =================
function updateTopOffset() {
  // calcula altura real do header e aplica padding-top ao wrapper para evitar sobreposição
  const h = headerEl ? headerEl.getBoundingClientRect().height : 0;
  TOP_OFFSET = Math.max(20, Math.round(h + 20)); // pelo menos 20px de folga
  if (canvasWrap) {
    canvasWrap.style.paddingTop = `${TOP_OFFSET}px`;
  }
}
window.addEventListener("resize", () => {
  updateTopOffset();
  draw();
});
window.addEventListener("DOMContentLoaded", () => {
  updateTopOffset();
  draw();
});
updateTopOffset();

// ================= Implementação das árvores (B e B+) =================

class BTreeNode {
  constructor(order, leaf = true) {
    this.order = order;
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
  }
  isFull() { return this.keys.length >= 2 * this.order - 1; }
}

class BTree {
  constructor(order = 3) {
    this.order = order;
    this.root = new BTreeNode(order, true);
  }

  insert(k) {
    const r = this.root;
    if (r.isFull()) {
      const s = new BTreeNode(this.order, false);
      s.children.push(r);
      this.splitChild(s, 0, r);
      this.root = s;
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(r, k);
    }
  }

  splitChild(parent, i, y) {
    const t = this.order;
    const z = new BTreeNode(this.order, y.leaf);
    // z keys = y.keys[t ... end]
    z.keys = y.keys.slice(t);
    // y keeps keys 0 .. t-1 (exclusive pivot)
    const pivot = y.keys[t - 1];
    y.keys = y.keys.slice(0, t - 1);

    if (!y.leaf) {
      z.children = y.children.slice(t);
      y.children = y.children.slice(0, t);
    }

    parent.children.splice(i + 1, 0, z);
    parent.keys.splice(i, 0, pivot);
  }

  insertNonFull(node, k) {
    if (node.leaf) {
      // insere e ordena
      node.keys.push(k);
      node.keys.sort((a, b) => a - b);
    } else {
      let i = node.keys.length - 1;
      while (i >= 0 && k < node.keys[i]) i--;
      i++;
      if (node.children[i].isFull()) {
        this.splitChild(node, i, node.children[i]);
        if (k > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], k);
    }
  }

  clear() { this.root = new BTreeNode(this.order, true); }
}

// B+ (simplificada para visualização)
class BPlusTreeNode {
  constructor(order, leaf = true) {
    this.order = order;
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
    this.next = null;
  }
  isFull() { return this.keys.length >= 2 * this.order - 1; }
}

class BPlusTree {
  constructor(order = 3) {
    this.order = order;
    this.root = new BPlusTreeNode(order, true);
  }

  insert(k) {
    const r = this.root;
    if (r.isFull()) {
      const s = new BPlusTreeNode(this.order, false);
      s.children.push(r);
      this.splitChild(s, 0, r);
      this.root = s;
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(r, k);
    }
  }

  splitChild(parent, i, y) {
    const t = this.order;
    const z = new BPlusTreeNode(this.order, y.leaf);
    // copy right part to z
    z.keys = y.keys.slice(t - 1);
    y.keys = y.keys.slice(0, t - 1);

    if (!y.leaf) {
      z.children = y.children.slice(t);
      y.children = y.children.slice(0, t);
    } else {
      z.next = y.next;
      y.next = z;
    }

    parent.children.splice(i + 1, 0, z);
    parent.keys.splice(i, 0, z.keys[0]);
  }

  insertNonFull(node, k) {
    if (node.leaf) {
      let i = 0;
      while (i < node.keys.length && node.keys[i] < k) i++;
      node.keys.splice(i, 0, k);
    } else {
      let i = 0;
      while (i < node.keys.length && k >= node.keys[i]) i++;
      if (node.children[i].isFull()) {
        this.splitChild(node, i, node.children[i]);
        if (k >= node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], k);
    }
  }

  clear() { this.root = new BPlusTreeNode(this.order, true); }
}

// ================= Layout / renderização =================

function clearSVG() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

// calcula largura necessária de uma subárvore (em px lógicos)
function getSubtreeWidth(node, keyWidth = 40, margin = 12) {
  if (!node) return 0;
  if (node.leaf) {
    return Math.max(node.keys.length * keyWidth + margin * 2, 60);
  }
  let width = 0;
  const SPACING = 48;
  for (const child of node.children) {
    width += getSubtreeWidth(child, keyWidth, margin) + SPACING;
  }
  return Math.max(width - SPACING, node.keys.length * keyWidth + margin * 2);
}

function drawNode(node, cx, cy) {
  if (!node) return;
  const keyWidth = 40;
  const margin = 12;
  const height = 40;
  const nodeWidth = Math.max(node.keys.length * keyWidth + margin * 2, 60);

  // retângulo do nó
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", cx - nodeWidth / 2);
  rect.setAttribute("y", cy - height / 2);
  rect.setAttribute("width", nodeWidth);
  rect.setAttribute("height", height);
  rect.setAttribute("rx", 8);
  rect.setAttribute("ry", 8);
  rect.setAttribute("class", "node");
  rect.style.fill = node.leaf ? "#2563eb" : "#1d4ed8";
  svg.appendChild(rect);

  // chaves centralizadas
  node.keys.forEach((k, i) => {
    const keyX = cx - nodeWidth / 2 + margin + keyWidth / 2 + i * keyWidth;
    const keyY = cy + 1; // pequeno ajuste vertical
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = k;
    text.setAttribute("x", keyX);
    text.setAttribute("y", keyY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#f8fafc");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-weight", "600");
    svg.appendChild(text);
  });

  // filhos (posicionamento proporcional)
  if (!node.leaf && node.children.length > 0) {
    const totalW = getSubtreeWidth(node);
    let offset = cx - totalW / 2;
    const SPACING = 48;
    for (const child of node.children) {
      const childW = getSubtreeWidth(child);
      const childCx = offset + childW / 2;
      const childCy = cy + 120; // distância vertical

      // linha
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy + height / 2);
      line.setAttribute("x2", childCx);
      line.setAttribute("y2", childCy - height / 2);
      line.setAttribute("stroke", "#94a3b8");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);

      // recursão
      drawNode(child, childCx, childCy);

      offset += childW + SPACING;
    }
  }
}

function draw() {
  clearSVG();
  if (!tree || !tree.root) return;

  // O topo lógico onde começa a desenhar é TOP_OFFSET (em px lógicos).
  // Convertendo TOP_OFFSET (em px físicos) para coordenadas lógicas do viewBox:
  // Assumimos 1:1 entre px físicos e px lógicos por simplicidade, já que usamos viewBox fixo.
  const startX = CANVAS_W / 2;
  const startY = Math.max(TOP_OFFSET + 20, 80); // garante raiz abaixo do header
  drawNode(tree.root, startX, startY);
}

// ================= Eventos UI =================

function initTreeFromUI() {
  const order = Math.max(3, parseInt(orderInput.value) || 3);
  const type = treeTypeSelect.value;
  tree = (type === "B+") ? new BPlusTree(order) : new BTree(order);
}

// inserir
insertBtn.addEventListener("click", () => {
  const val = parseInt(keyInput.value);
  if (isNaN(val)) return alert("Digite uma chave numérica");
  if (!tree) initTreeFromUI();
  tree.insert(val);
  keyInput.value = "";
  draw();
  // rola para mostrar raiz caso necessário
  canvasWrap.scrollTop = 0;
});

// aleatório
randomBtn.addEventListener("click", () => {
  if (!tree) initTreeFromUI();
  const v = Math.floor(Math.random() * 100);
  tree.insert(v);
  draw();
  canvasWrap.scrollTop = 0;
});

// limpar
clearBtn.addEventListener("click", () => {
  initTreeFromUI();
  clearSVG();
});

// muda tipo / ordem
treeTypeSelect.addEventListener("change", () => {
  initTreeFromUI();
  draw();
});
orderInput.addEventListener("change", () => {
  initTreeFromUI();
  draw();
});

// inicializa
initTreeFromUI();
draw();
