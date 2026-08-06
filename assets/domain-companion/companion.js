import { hasConsent, setConsent, loadState, saveState, clearState } from "./storage.mjs";
import { buildDomainOrientations, buildConstellation, constellationReady } from "./constellation.mjs";

const AXIS_LABELS = {
  social: "Vie sociale & privée",
  personal: "Navigation & IA",
  professional: "Présence professionnelle"
};

const ui = {
  open: false,
  generated: false,
  toast: "",
  toastTimer: null
};

let root;
let state;

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

function icon(name, size = 20) {
  const paths = {
    spark: '<path d="M12 2l1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>',
    chevron: '<path d="M7 10l5 5 5-5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12l4 4L19 6"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"/>',
    reset: '<path d="M4 7v5h5M5.8 16a7 7 0 101.4-8.2L4 12"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ""}</svg>`;
}

function profileValue(field) {
  const value = state.profile[field];
  return Array.isArray(value) ? value.join(", ") : String(value || "");
}

function selectionCount() {
  return ["social", "personal", "professional"].filter((key) => state.orientations[key]).length;
}

function profileHasContent() {
  return ["lastName", "firstName", "nickname", "activities", "occupations"].some((key) => profileValue(key).trim());
}

function identityName() {
  return [state.profile.firstName, state.profile.lastName].filter(Boolean).join(" ") || state.profile.nickname || "Votre identité";
}

function profileFormMarkup() {
  const fields = [
    ["lastName", "Nom", "Votre nom"],
    ["firstName", "Prénom", "Votre prénom"],
    ["nickname", "Surnom", "Le nom que vos proches utilisent"],
    ["activities", "Activités pratiquées", "Ex. musique, voile, photographie"],
    ["occupations", "Occupations dans la vie", "Ex. entrepreneur, parent, bénévole"]
  ];
  return `<section class="po-identity__section po-identity__profile" aria-labelledby="po-profile-title">
    <div class="po-identity__section-heading">
      <div><span class="po-identity__step">01</span><p>Votre matière première</p><h3 id="po-profile-title">Qui souhaitez-vous être en ligne&nbsp;?</h3></div>
      <span class="po-identity__privacy">${icon("lock", 16)} Données locales</span>
    </div>
    <form class="po-identity__form" data-form="profile">
      <div class="po-identity__fields">
        ${fields.map(([field, label, placeholder]) => `<label class="po-identity__field po-identity__field--${field}">
          <span>${escapeHtml(label)}</span>
          <input name="${field}" value="${escapeHtml(profileValue(field))}" placeholder="${escapeHtml(placeholder)}" autocomplete="off">
        </label>`).join("")}
      </div>
      <div class="po-identity__form-footer">
        <p>Quelques mots suffisent. Ils servent uniquement à composer vos orientations de noms.</p>
        <button class="po-identity__primary" type="submit">Composer mes trois présences ${icon("spark", 18)}</button>
      </div>
    </form>
  </section>`;
}

function choiceMarkup(axis, choice) {
  const selected = state.orientations[axis] === choice.id;
  return `<button class="po-identity__choice${selected ? " po-identity__choice--selected" : ""}" type="button" data-action="select-orientation" data-axis="${axis}" data-choice="${choice.id}" aria-pressed="${selected}">
    <span class="po-identity__choice-check">${selected ? icon("check", 16) : ""}</span>
    <span class="po-identity__choice-title">${escapeHtml(choice.title)}</span>
    <strong>${escapeHtml(choice.domain)}</strong>
    <small>${escapeHtml(choice.tone)}</small>
    <span class="po-identity__choice-preview">${escapeHtml(choice.preview)}</span>
  </button>`;
}

function orientationsMarkup() {
  if (!ui.generated && !profileHasContent()) {
    return `<section class="po-identity__section po-identity__waiting" aria-labelledby="po-orientations-title">
      <span class="po-identity__step">02</span>
      <div><p>Vos trois présences</p><h3 id="po-orientations-title">Renseignez d’abord les cinq repères ci-dessus.</h3><span>Le compagnon proposera ensuite quatre orientations par univers.</span></div>
    </section>`;
  }
  const orientations = buildDomainOrientations(state.profile);
  return `<section class="po-identity__section" aria-labelledby="po-orientations-title">
    <div class="po-identity__section-heading">
      <div><span class="po-identity__step">02</span><p>Vos trois présences</p><h3 id="po-orientations-title">Choisissez une orientation dans chaque colonne.</h3></div>
      <span class="po-identity__counter">${selectionCount()} / 3 sélectionnées</span>
    </div>
    <div class="po-identity__columns">
      ${Object.entries(orientations).map(([axis, column]) => `<article class="po-identity__column po-identity__column--${axis}">
        <header><span>${escapeHtml(column.eyebrow)}</span><h4>${escapeHtml(column.title)}</h4><p>${escapeHtml(column.description)}</p></header>
        <div class="po-identity__choices">${column.choices.map((choice) => choiceMarkup(axis, choice)).join("")}</div>
      </article>`).join("")}
    </div>
    <p class="po-identity__availability">Les noms sont des pistes de composition. Leur disponibilité reste à vérifier avant toute réservation.</p>
  </section>`;
}

function constellationMarkup() {
  const constellation = buildConstellation(state.profile, state.orientations);
  if (!constellation.ready) {
    return `<section class="po-identity__section po-identity__preview-waiting" aria-labelledby="po-constellation-title">
      <span class="po-identity__step">03</span>
      <div><p>Avant-goût</p><h3 id="po-constellation-title">Votre constellation apparaîtra après vos trois choix.</h3><span>Elle réunira vos espaces sans les confondre&nbsp;: privé, navigation et professionnel.</span></div>
    </section>`;
  }
  return `<section class="po-identity__section po-identity__constellation-section" aria-labelledby="po-constellation-title">
    <div class="po-identity__section-heading">
      <div><span class="po-identity__step">03</span><p>Avant-goût</p><h3 id="po-constellation-title">Voici ce que votre présence devrait consteller.</h3></div>
      <button class="po-identity__secondary" type="button" data-action="export">${icon("download", 17)} Exporter</button>
    </div>
    <div class="po-identity__constellation">
      <div class="po-identity__orbit" aria-hidden="true"></div>
      <div class="po-identity__core"><span>${escapeHtml((state.profile.firstName || state.profile.nickname || "P").slice(0, 1).toUpperCase())}</span><strong>${escapeHtml(constellation.identity)}</strong><small>Identité maîtresse</small></div>
      ${constellation.nodes.map((node) => `<article class="po-identity__node po-identity__node--${node.key}"><span>${escapeHtml(node.label)}</span><strong>${escapeHtml(node.choice.domain)}</strong><small>${escapeHtml(node.choice.title)}</small></article>`).join("")}
    </div>
    <div class="po-identity__outcomes">
      ${constellation.nodes.map((node) => `<article>
        <span>${escapeHtml(AXIS_LABELS[node.key])}</span>
        <h4>${escapeHtml(node.choice.domain)}</h4>
        <p>${escapeHtml(node.choice.preview)}</p>
        <ul>${node.key === "social"
          ? "<li>Profils et liens choisis</li><li>Règles de visibilité</li><li>Espaces communautaires</li>"
          : node.key === "personal"
            ? "<li>Préférences de navigation</li><li>Contexte destiné aux IA</li><li>Consentements et accès</li>"
            : "<li>Présentation et portfolio</li><li>Preuves et références</li><li>Contact professionnel</li>"}</ul>
      </article>`).join("")}
    </div>
  </section>`;
}

function drawerMarkup() {
  return `<div class="po-identity__intro">
      <div><p>Compagnon PureOwner</p><h2>Composez une identité, pas un profil de plateforme.</h2></div>
      <div class="po-identity__intro-actions">
        <button class="po-identity__ghost" type="button" data-action="reset">${icon("reset", 17)} Recommencer</button>
        <button class="po-identity__close" type="button" data-action="close" aria-label="Fermer le compagnon">${icon("close", 22)}</button>
      </div>
    </div>
    ${profileFormMarkup()}
    ${orientationsMarkup()}
    ${constellationMarkup()}
    <footer class="po-identity__footer">
      <span>${icon("lock", 16)} ${hasConsent() ? "Vos choix sont conservés sur cet appareil." : "Vos choix restent dans cette session."}</span>
      ${hasConsent() ? "" : '<button type="button" data-action="enable-memory">Mémoriser sur cet appareil</button>'}
      <small>PureOwner n’envoie aucune de ces informations à un serveur.</small>
    </footer>`;
}

function shellMarkup() {
  return `<button class="po-identity__bar" type="button" data-action="toggle" aria-expanded="false" aria-controls="po-identity-drawer">
      <span class="po-identity__mark">P</span>
      <span class="po-identity__bar-copy"><strong>Compagnon PureOwner</strong><small>Composer mon identité numérique</small></span>
      <span class="po-identity__bar-progress"><b>${selectionCount()}/3</b><small>présences</small></span>
      <span class="po-identity__bar-chevron">${icon("chevron", 19)}</span>
    </button>
    <aside class="po-identity__drawer" id="po-identity-drawer" aria-label="Compagnon d’identité PureOwner" aria-hidden="true" inert>
      <div class="po-identity__drawer-scroll"></div>
      <div class="po-identity__toast" role="status" hidden></div>
    </aside>`;
}

function render({ preserveScroll = false } = {}) {
  const drawer = root.querySelector(".po-identity__drawer");
  const scroll = root.querySelector(".po-identity__drawer-scroll");
  const previousScroll = scroll.scrollTop;
  root.classList.toggle("po-identity--open", ui.open);
  root.querySelector(".po-identity__bar").setAttribute("aria-expanded", String(ui.open));
  drawer.setAttribute("aria-hidden", String(!ui.open));
  if (ui.open) drawer.removeAttribute("inert"); else drawer.setAttribute("inert", "");
  scroll.innerHTML = drawerMarkup();
  scroll.scrollTop = preserveScroll ? previousScroll : 0;
  root.querySelector(".po-identity__bar-progress b").textContent = `${selectionCount()}/3`;
  const toast = root.querySelector(".po-identity__toast");
  toast.hidden = !ui.toast;
  toast.textContent = ui.toast;
}

function toast(message) {
  ui.toast = message;
  clearTimeout(ui.toastTimer);
  render({ preserveScroll: true });
  ui.toastTimer = setTimeout(() => {
    ui.toast = "";
    render({ preserveScroll: true });
  }, 2600);
}

function collectProfile(form) {
  const data = new FormData(form);
  ["lastName", "firstName", "nickname", "activities", "occupations"].forEach((field) => {
    state.profile[field] = String(data.get(field) || "").trim();
  });
  state.profile.activity = state.profile.activities;
  state.profile.passions = state.profile.occupations.split(",").map((item) => item.trim()).filter(Boolean);
}

async function persist() {
  await saveState(state);
}

function exportConstellation() {
  const payload = {
    exportedAt: new Date().toISOString(),
    source: "PureOwner — Compagnon d’identité",
    profile: state.profile,
    selections: state.orientations,
    constellation: buildConstellation(state.profile, state.orientations),
    note: "Les disponibilités des noms de domaine restent à vérifier."
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pureowner-constellation-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast("Votre constellation a été préparée.");
}

async function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "toggle") {
    ui.open = !ui.open;
    render();
    if (ui.open) requestAnimationFrame(() => root.querySelector("input")?.focus());
  } else if (action === "close") {
    ui.open = false;
    render();
    root.querySelector(".po-identity__bar")?.focus();
  } else if (action === "select-orientation") {
    state.orientations[target.dataset.axis] = target.dataset.choice;
    await persist();
    render({ preserveScroll: true });
    if (constellationReady(state.orientations)) toast("Votre constellation est prête à explorer.");
  } else if (action === "enable-memory") {
    await setConsent(true);
    await persist();
    render({ preserveScroll: true });
    toast("Mémoire locale activée sur cet appareil.");
  } else if (action === "export") {
    exportConstellation();
  } else if (action === "reset") {
    if (!window.confirm("Effacer le profil et les trois orientations du compagnon ?")) return;
    state = await clearState();
    state.profile = {};
    state.orientations = {};
    ui.generated = false;
    render();
    toast("Le compagnon est prêt à recommencer.");
  }
}

async function init() {
  if (document.querySelector(".po-identity")) return;
  state = await loadState();
  state.profile = state.profile || {};
  state.orientations = state.orientations || {};
  if (!state.profile.activities && state.profile.activity) state.profile.activities = state.profile.activity;
  if (!state.profile.occupations && state.profile.passions) state.profile.occupations = Array.isArray(state.profile.passions) ? state.profile.passions.join(", ") : state.profile.passions;
  ui.generated = profileHasContent();
  root = document.createElement("div");
  root.className = "po-identity";
  root.innerHTML = shellMarkup();
  document.body.append(root);
  root.addEventListener("click", (event) => void handleClick(event));
  root.addEventListener("submit", async (event) => {
    if (!event.target.matches('[data-form="profile"]')) return;
    event.preventDefault();
    collectProfile(event.target);
    ui.generated = true;
    await persist();
    render();
    requestAnimationFrame(() => root.querySelector(".po-identity__columns")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !ui.open) return;
    ui.open = false;
    render();
    root.querySelector(".po-identity__bar")?.focus();
  });
  render();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void init(), { once: true });
else void init();
