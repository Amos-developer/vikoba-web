const tableStates = new WeakMap();

const getDataRows = (tbody) => Array.from(tbody.rows).filter(
  (row) => !row.querySelector("td[colspan]"),
);

const pageButtons = (currentPage, totalPages) => {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

const render = (tbody, binding) => {
  const state = tableStates.get(tbody);
  if (!state) return;

  const pageSize = Number(binding.value?.pageSize || binding.value || 10);
  const table = tbody.closest("table");
  const headerRow = table?.tHead?.rows?.[0];
  if (headerRow && !headerRow.querySelector(".table-row-number-heading")) {
    const heading = document.createElement("th");
    heading.className = "table-row-number-heading";
    heading.scope = "col";
    heading.textContent = "No.";
    headerRow.prepend(heading);
  }

  const rows = getDataRows(tbody);
  rows.forEach((row, index) => {
    let numberCell = row.querySelector(":scope > .table-row-number");
    if (!numberCell) {
      numberCell = document.createElement("td");
      numberCell.className = "table-row-number";
      row.prepend(numberCell);
    }
    const number = String(index + 1);
    if (numberCell.textContent !== number) numberCell.textContent = number;
  });
  Array.from(tbody.rows).filter((row) => row.querySelector("td[colspan]")).forEach((row) => {
    const cell = row.querySelector("td[colspan]");
    if (!cell.dataset.paginationColspanAdjusted) {
      cell.colSpan += 1;
      cell.dataset.paginationColspanAdjusted = "true";
    }
  });
  const signature = rows.map((row) => row.textContent.trim()).join("|");

  if (state.signature !== signature) {
    state.page = 1;
    state.signature = signature;
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  state.page = Math.min(state.page, totalPages);
  const firstRecord = rows.length ? (state.page - 1) * pageSize + 1 : 0;
  const lastRecord = Math.min(state.page * pageSize, rows.length);

  rows.forEach((row, index) => {
    row.hidden = index < firstRecord - 1 || index >= lastRecord;
  });

  state.controls.hidden = rows.length <= pageSize;
  state.controls.innerHTML = "";
  if (rows.length <= pageSize) return;

  const summary = document.createElement("span");
  summary.className = "table-pagination-summary";
  summary.textContent = `Showing ${firstRecord}–${lastRecord} of ${rows.length}`;

  const actions = document.createElement("div");
  actions.className = "table-pagination-actions";
  const addButton = (label, page, disabled = false, active = false) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = disabled;
    button.className = active ? "active" : "";
    button.setAttribute("aria-label", label === "‹" ? "Previous page" : label === "›" ? "Next page" : `Page ${label}`);
    button.addEventListener("click", () => {
      state.page = page;
      render(tbody, binding);
    });
    actions.appendChild(button);
  };

  addButton("‹", state.page - 1, state.page === 1);
  const pages = pageButtons(state.page, totalPages);
  pages.forEach((page, index) => {
    if (index && page - pages[index - 1] > 1) {
      const gap = document.createElement("span");
      gap.textContent = "…";
      actions.appendChild(gap);
    }
    addButton(String(page), page, false, page === state.page);
  });
  addButton("›", state.page + 1, state.page === totalPages);
  state.controls.append(summary, actions);
};

const scheduleRender = (tbody, binding) => requestAnimationFrame(() => render(tbody, binding));

const attachPagination = (tbody) => {
  if (tableStates.has(tbody)) return;
  const controls = document.createElement("div");
  controls.className = "table-pagination";
  tbody.closest("table")?.insertAdjacentElement("afterend", controls);
  if (!controls.parentElement) return;

  const binding = { value: { pageSize: 10 } };
  const observer = new MutationObserver(() => scheduleRender(tbody, binding));
  observer.observe(tbody, { childList: true, subtree: true, characterData: true });
  tableStates.set(tbody, { page: 1, signature: "", controls, observer });
  scheduleRender(tbody, binding);
};

const detachPagination = (tbody) => {
  const state = tableStates.get(tbody);
  state?.observer?.disconnect();
  state?.controls.remove();
  tableStates.delete(tbody);
};

export const initializeTablePagination = (root = document.body) => {
  root.querySelectorAll("tbody").forEach(attachPagination);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("tbody")) attachPagination(node);
      node.querySelectorAll("tbody").forEach(attachPagination);
    }));
    mutations.forEach((mutation) => mutation.removedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("tbody")) detachPagination(node);
      node.querySelectorAll("tbody").forEach(detachPagination);
    }));
  });
  observer.observe(root, { childList: true, subtree: true });
  return observer;
};

export const paginate = {
  mounted(tbody, binding) {
    attachPagination(tbody);
    scheduleRender(tbody, binding);
  },
  updated: scheduleRender,
  unmounted(tbody) {
    detachPagination(tbody);
  },
};
