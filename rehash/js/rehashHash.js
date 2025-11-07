let tableSize = 7;
    let elements = [];
    const loadFactorLimit = 0.7;

    function hash(value, size) {
      return value % size;
    }

    function renderTable() {
      const container = document.getElementById("buckets");
      container.innerHTML = "";

      for (let i = 0; i < tableSize; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        const list = document.createElement("div");
        list.classList.add("elementList");

        const root = document.createElement("span");
        root.classList.add("root");
        root.textContent = i;

        list.appendChild(root);
        row.appendChild(list);
        container.appendChild(row);
      }

      updateLoadFactorDisplay();
    }

    function insertElement(value) {
      const index = hash(value, tableSize);
      const rows = document.getElementsByClassName("elementList");

      const newElem = document.createElement("span");
      newElem.textContent = value;
      newElem.classList.add("newElement");

      rows[index].appendChild(newElem);
    }

    function rehash() {
      const oldElements = [...elements];
      tableSize *= 2;
      elements = [];
      renderTable();

      oldElements.forEach(v => {
        elements.push(v);
        insertElement(v);
      });

      alert(`Rehash realizado! Novo tamanho da tabela: ${tableSize}`);
      updateLoadFactorDisplay();
    }

    function updateLoadFactorDisplay() {
      const loadFactor = elements.length / tableSize;
      const text = document.getElementById("loadFactorText");
      const bar = document.getElementById("loadFactorBar");

      // Atualiza texto
      text.textContent = `Fator de carga: ${loadFactor.toFixed(2)} (${elements.length} / ${tableSize})`;

      // Atualiza largura da barra
      const percentage = Math.min(loadFactor * 100, 100);
      bar.style.width = `${percentage}%`;

      // Define cor da barra conforme o nível de carga
      if (loadFactor > loadFactorLimit) {
        bar.style.backgroundColor = "red";
      } else if (loadFactor > 0.5) {
        bar.style.backgroundColor = "orange";
      } else {
        bar.style.backgroundColor = "green";
      }
    }

    document.querySelector("#insertButton").addEventListener("click", () => {
      let value = document.querySelector("#insertedNumber").value.trim();
      if (value === "") return alert("Insira um número");
      value = parseInt(value, 10);

      elements.push(value);
      insertElement(value);
      updateLoadFactorDisplay();

      const loadFactor = elements.length / tableSize;
      if (loadFactor > loadFactorLimit) {
        rehash();
      }
    });

    document.querySelector("#resetButton").addEventListener("click", () => {
      elements = [];
      tableSize = 7;
      renderTable();
    });

    // Inicialização
    renderTable();