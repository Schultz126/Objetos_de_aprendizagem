// --- AVL Tree ---
class AVLNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(n) { return n ? n.height : 0; }
  updateHeight(n) { n.height = 1 + Math.max(this.height(n.left), this.height(n.right)); }
  balance(n) { return n ? this.height(n.left) - this.height(n.right) : 0; }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  _insert(node, key) {
    if (!node) return new AVLNode(key);
    if (key < node.key) node.left = this._insert(node.left, key);
    else if (key > node.key) node.right = this._insert(node.right, key);
    else return node;

    this.updateHeight(node);
    const bf = this.balance(node);

    if (bf > 1 && key < node.left.key) return this.rotateRight(node);
    if (bf < -1 && key > node.right.key) return this.rotateLeft(node);
    if (bf > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (bf < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  insert(key) { this.root = this._insert(this.root, key); }

  _minValueNode(node) {
    let cur = node;
    while (cur.left) cur = cur.left;
    return cur;
  }

  _remove(node, key) {
    if (!node) return null;
    if (key < node.key) node.left = this._remove(node.left, key);
    else if (key > node.key) node.right = this._remove(node.right, key);
    else {
      if (!node.left || !node.right) node = node.left ? node.left : node.right;
      else {
        const succ = this._minValueNode(node.right);
        node.key = succ.key;
        node.right = this._remove(node.right, succ.key);
      }
    }
    if (!node) return node;

    this.updateHeight(node);
    const bf = this.balance(node);

    if (bf > 1 && this.balance(node.left) >= 0) return this.rotateRight(node);
    if (bf > 1 && this.balance(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (bf < -1 && this.balance(node.right) <= 0) return this.rotateLeft(node);
    if (bf < -1 && this.balance(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  remove(key) { this.root = this._remove(this.root, key); }

  toArray() {
    const arr = [];
    (function trav(n) {
      if (!n) return;
      arr.push(n);
      trav(n.left);
      trav(n.right);
    })(this.root);
    return arr;
  }
}

// --- Layout inteligente (sem sobreposição) ---
function computePositions(root) {
  if (!root) return;

  // calcular largura da subárvore (número de nós)
  function measure(node) {
    if (!node) return 0;
    const left = measure(node.left);
    const right = measure(node.right);
    node._width = Math.max(1, left + right + 1);
    return node._width;
  }

  function assign(node, x, y, scale) {
    if (!node) return;
    const leftW = node.left ? node.left._width : 0;
    const rightW = node.right ? node.right._width : 0;
    const total = leftW + rightW;

    node._x = x;
    node._y = y;

    if (node.left)
      assign(node.left, x - (rightW + 1) * scale, y + 100, scale * 0.8);
    if (node.right)
      assign(node.right, x + (leftW + 1) * scale, y + 100, scale * 0.8);
  }

  measure(root);
  assign(root, 600, 60, 40); // valor inicial
}

// --- Renderização ---
const svg = document.getElementById('svgRoot');
const tree = new AVLTree();
const showBalance = document.getElementById('showBalance');
const nodeCountEl = document.getElementById('nodeCount');
const treeHeightEl = document.getElementById('treeHeight');

function clearSVG() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function draw() {
  clearSVG();
  if (!tree.root) {
    updateStats();
    return;
  }
  computePositions(tree.root);

  const nodes = [];
  (function collect(n) {
    if (!n) return;
    nodes.push(n);
    collect(n.left);
    collect(n.right);
  })(tree.root);

  // Desenha arestas
  nodes.forEach(n => {
    if (n.left) drawEdge(n, n.left);
    if (n.right) drawEdge(n, n.right);
  });

  // Desenha nós
  nodes.forEach(n => drawNode(n));

  updateStats();
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
  g.setAttribute('class', 'node');
  g.setAttribute('transform', `translate(${n._x},${n._y})`);

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', 22);
  circle.setAttribute('fill', '#082032');
  circle.setAttribute('stroke', '#0ea5e9');

  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  txt.textContent = n.key;
  txt.setAttribute('fill', 'white');

  g.appendChild(circle);
  g.appendChild(txt);

  if (showBalance.checked) {
    const bal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bal.setAttribute('class', 'balance');
    bal.setAttribute('x', 36);
    bal.setAttribute('y', -18);
    bal.textContent = `h:${n.height} b:${tree.balance(n)}`;
    g.appendChild(bal);
  }

  g.style.cursor = 'pointer';
  g.addEventListener('click', e => {
    e.stopPropagation();
    alert(`Nó: ${n.key}\nAltura: ${n.height}\nFator de balanceamento: ${tree.balance(n)}`);
  });

  svg.appendChild(g);
}

function updateStats() {
  nodeCountEl.textContent = tree.toArray().length;
  treeHeightEl.textContent = tree.root ? tree.root.height : 0;
}

// --- Controles ---
document.getElementById('insertBtn').onclick = () => {
  const val = parseInt(document.getElementById('keyInput').value);
  if (isNaN(val)) return alert('Digite um número válido');
  tree.insert(val);
  document.getElementById('keyInput').value = '';
  draw();
};
document.getElementById('deleteBtn').onclick = () => {
  const val = parseInt(document.getElementById('keyInput').value);
  if (isNaN(val)) return alert('Digite um número válido');
  tree.remove(val);
  document.getElementById('keyInput').value = '';
  draw();
};
document.getElementById('randomBtn').onclick = () => {
  const v = Math.floor(Math.random() * 100);
  tree.insert(v);
  draw();
};
document.getElementById('clearBtn').onclick = () => {
  tree.root = null;
  draw();
};
showBalance.onchange = () => draw();

// --- Pan & Zoom (corrigido: zoom centralizado) ---
(function enablePanZoom() {
  let isDown = false, startX = 0, startY = 0;
  let viewBox = { x: 0, y: 0, w: 1200, h: 800 };

  function apply() {
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  }

  const wrap = document.getElementById('canvasWrap');
  apply();

  // Zoom suave e centralizado
  wrap.addEventListener('wheel', e => {
    e.preventDefault();

    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const mx = viewBox.x + (viewBox.w / 2); // centro horizontal atual
    const my = viewBox.y + (viewBox.h / 2); // centro vertical atual

    // Calcula novo tamanho
    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;

    // Reposiciona o viewBox de forma que o centro permaneça fixo
    viewBox.x = mx - newW / 2;
    viewBox.y = my - newH / 2;
    viewBox.w = newW;
    viewBox.h = newH;

    apply();
  });

  // Pan (arrastar)
  wrap.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.clientX;
    startY = e.clientY;
  });
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

// --- Árvore de exemplo inicial ---
[50, 20, 70, 10, 30, 60, 80, 5, 15, 25, 35].forEach(v => tree.insert(v));
draw();
