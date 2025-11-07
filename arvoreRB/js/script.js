// script.js — Red-Black Tree com remoção corrigida

// --- Nó rubro-negro ---
class RBNode {
  constructor(key, color = 'RED') {
    this.key = key;
    this.color = color; // 'RED' ou 'BLACK'
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// --- Árvore rubro-negra ---
class RBTree {
  constructor() {
    this.root = null;
  }

  // utilitário
  getColor(node) { return node ? node.color : 'BLACK'; }

  // transplant: substitui u por v na árvore (ajusta parent)
  transplant(u, v) {
    if (!u.parent) this.root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    if (v) v.parent = u.parent;
  }

  // mínimo a partir de node
  minimum(node) {
    let cur = node;
    while (cur && cur.left) cur = cur.left;
    return cur;
  }

  // rotações
  rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;
    if (!y.parent) this.root = x;
    else if (y === y.parent.left) y.parent.left = x;
    else y.parent.right = x;
    x.right = y;
    y.parent = x;
  }

  // Inserção (BST + fix)
  insert(key) {
    const newNode = new RBNode(key);
    if (!this.root) {
      this.root = newNode;
      this.root.color = 'BLACK';
      return;
    }
    let cur = this.root;
    let parent = null;
    while (cur) {
      parent = cur;
      if (key < cur.key) cur = cur.left;
      else if (key > cur.key) cur = cur.right;
      else return; // evita duplicatas
    }
    newNode.parent = parent;
    if (key < parent.key) parent.left = newNode;
    else parent.right = newNode;
    this.fixInsert(newNode);
  }

  fixInsert(z) {
    while (z.parent && z.parent.color === 'RED') {
      const gp = z.parent.parent;
      if (!gp) break;
      if (z.parent === gp.left) {
        const y = gp.right;
        if (this.getColor(y) === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          gp.color = 'RED';
          z = gp;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.rotateLeft(z);
          }
          z.parent.color = 'BLACK';
          gp.color = 'RED';
          this.rotateRight(gp);
        }
      } else {
        const y = gp.left;
        if (this.getColor(y) === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          gp.color = 'RED';
          z = gp;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rotateRight(z);
          }
          z.parent.color = 'BLACK';
          gp.color = 'RED';
          this.rotateLeft(gp);
        }
      }
    }
    if (this.root) this.root.color = 'BLACK';
  }

  // --- REMOÇÃO CORRETA ---
  remove(key) {
    // encontra o nó com a chave
    let z = this.root;
    while (z && z.key !== key) {
      z = key < z.key ? z.left : z.right;
    }
    if (!z) return; // não encontrado

    let y = z;
    const yOriginalColor = y.color;
    let x = null;

    if (!z.left) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (!z.right) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      // dois filhos: substitui por sucessor
      y = this.minimum(z.right);
      const yOrigColor = y.color;
      // x é o filho direito de y (pode ser null)
      x = y.right;
      if (y.parent === z) {
        if (x) x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        if (y.right) y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      if (y.left) y.left.parent = y;
      y.color = z.color;
      // ajustar as cores para o fixup
      // yOriginalColor já guardado mas renomeamos para compatibilidade
      if (yOrigColor === 'BLACK') { // se sucessor era preto, precisamos de fix
        this.deleteFix(x, y.parent ? y.parent : null);
        return;
      } else {
        // se sucessor era vermelho, removido sem violação
        return;
      }
    }

    // se o nó removido tinha cor preta, precisamos consertar (x pode ser null)
    if (yOriginalColor === 'BLACK') {
      this.deleteFix(x, (x ? x.parent : null));
    }
  }

  // deleteFix(x): corrige a propriedade RB após remoção.
  // x pode ser null; passamos também opcionalmente o parent se x for null.
  deleteFix(x, xParent = null) {
    // Usamos getColor(null) == 'BLACK'
    while ((x !== this.root) && (this.getColor(x) === 'BLACK')) {
      let parent = x ? x.parent : xParent;
      if (!parent) break; // chegamos à raiz
      if (x === parent.left) {
        let w = parent.right; // sibling
        if (this.getColor(w) === 'RED') {
          w.color = 'BLACK';
          parent.color = 'RED';
          this.rotateLeft(parent);
          w = parent.right;
        }
        // agora w é preto
        if (this.getColor(w.left) === 'BLACK' && this.getColor(w.right) === 'BLACK') {
          if (w) w.color = 'RED';
          x = parent;
          xParent = x ? x.parent : null;
        } else {
          if (this.getColor(w.right) === 'BLACK') {
            if (w.left) w.left.color = 'BLACK';
            if (w) w.color = 'RED';
            this.rotateRight(w);
            w = parent.right;
          }
          if (w) w.color = parent.color;
          parent.color = 'BLACK';
          if (w && w.right) w.right.color = 'BLACK';
          this.rotateLeft(parent);
          x = this.root; // termina
        }
      } else { // simétrico
        let w = parent.left;
        if (this.getColor(w) === 'RED') {
          w.color = 'BLACK';
          parent.color = 'RED';
          this.rotateRight(parent);
          w = parent.left;
        }
        if (this.getColor(w.right) === 'BLACK' && this.getColor(w.left) === 'BLACK') {
          if (w) w.color = 'RED';
          x = parent;
          xParent = x ? x.parent : null;
        } else {
          if (this.getColor(w.left) === 'BLACK') {
            if (w.right) w.right.color = 'BLACK';
            if (w) w.color = 'RED';
            this.rotateLeft(w);
            w = parent.left;
          }
          if (w) w.color = parent.color;
          parent.color = 'BLACK';
          if (w && w.left) w.left.color = 'BLACK';
          this.rotateRight(parent);
          x = this.root;
        }
      }
    }
    if (x) x.color = 'BLACK';
  }

  // limpa árvore inteira
  clear() { this.root = null; }

  // coleta nós em array (DFS)
  toArray() {
    const nodes = [];
    (function dfs(n) {
      if (!n) return;
      nodes.push(n);
      dfs(n.left);
      dfs(n.right);
    })(this.root);
    return nodes;
  }

  // calcula black height (máximo caminho em números de nós pretos)
  blackHeight(node = this.root) {
    if (!node) return 0;
    const left = this.blackHeight(node.left);
    const right = this.blackHeight(node.right);
    return Math.max(left, right) + (node.color === 'BLACK' ? 1 : 0);
  }
}

// --- Layout e render (mesma lógica anterior) ---
function computePositions(root) {
  if (!root) return;
  function measure(node) {
    if (!node) return 0;
    const l = measure(node.left);
    const r = measure(node.right);
    node._width = Math.max(1, l + r + 1);
    return node._width;
  }
  function assign(node, x, y, scale) {
    if (!node) return;
    const lw = node.left ? node.left._width : 0;
    const rw = node.right ? node.right._width : 0;
    node._x = x;
    node._y = y;
    if (node.left) assign(node.left, x - (rw + 1) * scale, y + 100, scale * 0.8);
    if (node.right) assign(node.right, x + (lw + 1) * scale, y + 100, scale * 0.8);
  }
  measure(root);
  assign(root, 600, 60, 40);
}

// --- UI / SVG render ---
const svg = document.getElementById('svgRoot');
const tree = new RBTree();
const nodeCountEl = document.getElementById('nodeCount');
const blackHeightEl = document.getElementById('blackHeight');
const showColors = document.getElementById('showColors');

function clearSVG() { while (svg.firstChild) svg.removeChild(svg.firstChild); }

function draw() {
  clearSVG();
  if (!tree.root) {
    nodeCountEl.textContent = 0;
    blackHeightEl.textContent = 0;
    return;
  }
  computePositions(tree.root);
  const nodes = tree.toArray();
  nodes.forEach(n => { if (n.left) drawEdge(n, n.left); if (n.right) drawEdge(n, n.right); });
  nodes.forEach(n => drawNode(n));
  nodeCountEl.textContent = nodes.length;
  blackHeightEl.textContent = tree.blackHeight();
}

function drawEdge(p, c) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', p._x);
  line.setAttribute('y1', p._y + 22);
  line.setAttribute('x2', c._x);
  line.setAttribute('y2', c._y - 22);
  line.setAttribute('class', 'edge');
  svg.appendChild(line);
}

function drawNode(n) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `translate(${n._x},${n._y})`);
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', 22);
  const cls = n.color === 'RED' ? 'red' : 'black';
  circle.setAttribute('class', cls);
  if (showColors.checked) {
    circle.setAttribute('fill', n.color === 'RED' ? '#ef4444' : '#1e293b');
  } else {
    circle.setAttribute('fill', '#082032');
  }
  circle.setAttribute('stroke', '#0ea5e9');

  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  txt.textContent = n.key;
  txt.setAttribute('dy', '0.35em'); // centralização robusta
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('dominant-baseline', 'middle');
  txt.setAttribute('fill', '#f8fafc');
  txt.style.fontWeight = '600';

  g.appendChild(circle);
  g.appendChild(txt);

  g.style.cursor = 'pointer';
  g.addEventListener('click', (e) => {
    e.stopPropagation();
    alert(`Nó: ${n.key}\nCor: ${n.color}\nPai: ${n.parent ? n.parent.key : '—'}`);
  });

  svg.appendChild(g);
}

// --- Controles DOM ---
document.getElementById('insertBtn').onclick = () => {
  const v = parseInt(document.getElementById('keyInput').value);
  if (isNaN(v)) return alert('Digite um número válido');
  tree.insert(v);
  document.getElementById('keyInput').value = '';
  draw();
};

document.getElementById('removeBtn')?.addEventListener('click', () => {}); // segurança caso exista

document.getElementById('clearBtn').onclick = () => { tree.clear(); draw(); };
document.getElementById('randomBtn').onclick = () => { tree.insert(Math.floor(Math.random()*100)); draw(); };
document.getElementById('showColors').onchange = draw;

// botão de remover (nome no HTML era deleteBtn)
document.getElementById('deleteBtn').onclick = () => {
  const v = parseInt(document.getElementById('keyInput').value);
  if (isNaN(v)) return alert('Digite um número válido');
  tree.remove(v);
  document.getElementById('keyInput').value = '';
  draw();
};

// --- Pan & Zoom (zoom centralizado) ---
(function enablePanZoom() {
  let isDown = false, startX = 0, startY = 0;
  let viewBox = { x: 0, y: 0, w: 1200, h: 800 };
  function apply() { svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`); }
  const wrap = document.getElementById('canvasWrap');
  apply();

  wrap.addEventListener('wheel', e => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const mx = viewBox.x + (viewBox.w / 2);
    const my = viewBox.y + (viewBox.h / 2);
    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;
    viewBox.x = mx - newW / 2;
    viewBox.y = my - newH / 2;
    viewBox.w = newW;
    viewBox.h = newH;
    apply();
  }, { passive: false });

  wrap.addEventListener('mousedown', e => { isDown = true; startX = e.clientX; startY = e.clientY; });
  window.addEventListener('mouseup', () => isDown = false);
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    const dx = (e.clientX - startX) * (viewBox.w / svg.clientWidth);
    const dy = (e.clientY - startY) * (viewBox.h / svg.clientHeight);
    viewBox.x -= dx;
    viewBox.y -= dy;
    startX = e.clientX;
    startY = e.clientY;
    apply();
  });
})();

// demo inicial
[41, 38, 31, 12, 19, 8].forEach(v => tree.insert(v));
draw();
