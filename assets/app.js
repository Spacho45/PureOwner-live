(function () {
  const config = window.BRAVEOWNER_CONFIG;
  const state = {
    allListings: [],
    filteredListings: [],
    source: "snapshot",
    page: 1,
    category: "all",
    query: "",
    sort: "listedAt-DESC"
  };

  const els = {
    menuButton: document.querySelector(".menu-button"),
    nav: document.querySelector("#site-nav"),
    categoryFilter: document.querySelector("#category-filter"),
    categoryCards: document.querySelector("#category-cards"),
    search: document.querySelector("#storefront-search"),
    sort: document.querySelector("#storefront-sort"),
    count: document.querySelector("#storefront-count"),
    source: document.querySelector("#storefront-source"),
    listings: document.querySelector("#storefront-listings"),
    pagination: document.querySelector("#storefront-pagination"),
    empty: document.querySelector("#storefront-empty"),
    snapshotDate: document.querySelector("#snapshot-date")
  };

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function normalizeListing(item) {
    const rawName = item.domainName || item.domainDisplayName || "";
    const baseName = rawName.replace(/\.brave$/i, "").toLowerCase();
    return {
      ...item,
      domainName: rawName.toLowerCase(),
      domainDisplayName: item.domainDisplayName || rawName,
      baseName,
      categories: categoriesFor(baseName)
    };
  }

  function categoriesFor(baseName) {
    const categories = ["all"];
    config.categories.forEach((category) => {
      if (category.id === "all") return;
      if (Array.isArray(category.seeds) && category.seeds.some((seed) => baseName.includes(seed))) {
        categories.push(category.id);
      }
      if (category.maxLength && baseName.length <= category.maxLength) {
        categories.push(category.id);
      }
    });
    if (!categories.includes("names") && /^[a-z]{4,12}$/.test(baseName)) {
      categories.push("names");
    }
    return Array.from(new Set(categories));
  }

  function absoluteUrl(url) {
    if (!url) return config.clientBase;
    if (/^https?:\/\//.test(url)) return url;
    return `${config.clientBase}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  function formatPrice(cents) {
    return cents === null || cents === undefined ? "Make an offer" : money.format(cents / 100);
  }

  async function fetchSnapshot() {
    const response = await fetch("data/storefront-snapshot.json");
    if (!response.ok) throw new Error("Local snapshot is missing");
    return response.json();
  }

  function sortListings(items) {
    const [key, direction] = state.sort.split("-");
    const sign = direction === "ASC" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (key === "price") {
        const av = a.price ?? Number.MAX_SAFE_INTEGER;
        const bv = b.price ?? Number.MAX_SAFE_INTEGER;
        return (av - bv) * sign;
      }
      return String(a.domainName).localeCompare(String(b.domainName)) * sign;
    });
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    state.filteredListings = sortListings(state.allListings.filter((item) => {
      const matchesCategory = state.category === "all" || item.categories.includes(state.category);
      const matchesQuery = query.length === 0 || item.domainName.includes(query);
      return matchesCategory && matchesQuery;
    }));
    state.page = Math.min(state.page, Math.max(1, Math.ceil(state.filteredListings.length / config.pageSize)));
    render();
  }

  function renderCategories() {
    els.categoryFilter.innerHTML = "";
    els.categoryCards.innerHTML = "";

    config.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.label;
      els.categoryFilter.appendChild(option);

      if (category.id === "all") return;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "category-card";
      card.innerHTML = `<h3>${category.label}</h3><p>${category.description}</p>`;
      card.addEventListener("click", () => {
        state.category = category.id;
        els.categoryFilter.value = category.id;
        applyFilters();
        document.querySelector("#marketplace").scrollIntoView({ behavior: "smooth" });
      });
      els.categoryCards.appendChild(card);
    });
  }

  function renderCard(item) {
    const card = document.createElement("article");
    card.className = "listing-card";

    const badges = [
      item.type || "web3",
      ...item.categories.filter((category) => category !== "all").slice(0, 2)
    ];
    if (item.hasOffers) badges.push("offers");
    if (item.hasLto) badges.push("lease");

    const buyUrl = item.price !== null && item.price !== undefined ? item.buyUrl : item.detailUrl;
    card.innerHTML = `
      <div>
        <h3>${item.domainDisplayName}</h3>
        <div class="badges">${badges.map((badge) => `<span class="badge">${badge}</span>`).join("")}</div>
      </div>
      <div class="price">${formatPrice(item.price)}</div>
      <div class="listing-actions">
        <a href="${absoluteUrl(buyUrl)}" target="_blank" rel="noopener">${item.price ? "Buy now" : "View"}</a>
        <a href="${absoluteUrl(item.detailUrl)}" target="_blank" rel="noopener">Details</a>
      </div>
    `;
    return card;
  }

  function renderPagination(totalPages) {
    els.pagination.innerHTML = "";
    if (totalPages <= 1) return;

    const addButton = (label, page, current = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      if (current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        state.page = page;
        render();
        document.querySelector("#marketplace").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      els.pagination.appendChild(button);
    };

    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - state.page) <= 1) {
        addButton(String(page), page, page === state.page);
      }
    }
  }

  function render() {
    const total = state.filteredListings.length;
    const totalPages = Math.max(1, Math.ceil(total / config.pageSize));
    const start = (state.page - 1) * config.pageSize;
    const current = state.filteredListings.slice(start, start + config.pageSize);

    els.count.textContent = `${total} domain${total === 1 ? "" : "s"} available`;
    els.source.textContent = state.source === "live" ? "Live API" : "Local snapshot";
    els.empty.hidden = total !== 0;
    els.listings.innerHTML = "";
    current.forEach((item) => els.listings.appendChild(renderCard(item)));
    renderPagination(totalPages);
  }

  function bindEvents() {
    els.menuButton.addEventListener("click", () => {
      const isOpen = els.nav.classList.toggle("is-open");
      els.menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    els.categoryFilter.addEventListener("change", () => {
      state.category = els.categoryFilter.value;
      state.page = 1;
      applyFilters();
    });

    els.search.addEventListener("input", () => {
      state.query = els.search.value;
      state.page = 1;
      applyFilters();
    });

    els.sort.addEventListener("change", () => {
      state.sort = els.sort.value;
      state.page = 1;
      applyFilters();
    });
  }

  async function init() {
    renderCategories();
    bindEvents();

    try {
      const data = await fetchSnapshot();
      state.source = "snapshot";
      state.allListings = (data.listings || []).map(normalizeListing);
      els.snapshotDate.textContent = data.snapshotAt ? new Date(data.snapshotAt).toLocaleString() : "unknown";
    } catch (error) {
      throw new Error(`Snapshot load failed: ${error.message}`);
    }

    applyFilters();
  }

  init().catch((error) => {
    els.count.textContent = "Unable to load domains";
    els.source.textContent = error.message;
    els.empty.hidden = false;
  });
})();
