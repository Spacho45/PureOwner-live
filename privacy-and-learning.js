(function () {
  "use strict";

  if (window.__pureOwnerPrivacyLearningReady) return;
  window.__pureOwnerPrivacyLearningReady = true;

  const policies = {
    simple: `
      <p class="privacy-intro">PureOwner respecte votre vie privée. Le site utilise uniquement les informations nécessaires pour fournir le service demandé et ne les exploite pas à des fins publicitaires.</p>
      <section>
        <h3>Données utilisées</h3>
        <p>Selon votre autorisation, le service peut lire votre identifiant ou pseudonyme, votre adresse de wallet et certaines informations de profil nécessaires à l'affichage.</p>
      </section>
      <section>
        <h3>Pourquoi</h3>
        <p>Ces données servent uniquement à personnaliser le résultat demandé et à assurer le bon fonctionnement du service.</p>
      </section>
      <section>
        <h3>Conservation et partage</h3>
        <p>PureOwner ne vend pas vos données. Les informations utilisées pour produire un résultat ne sont pas conservées au-delà du temps nécessaire, sauf obligation technique ou légale clairement indiquée.</p>
      </section>
      <section>
        <h3>Vos droits</h3>
        <p>Vous pouvez demander l'accès, la rectification, la suppression ou la limitation de l'utilisation de vos données via les coordonnées indiquées sur le site.</p>
      </section>`,
    detailed: `
      <p class="privacy-intro">Cette politique précise comment PureOwner traite les informations nécessaires à ses outils, à ses contenus pédagogiques et à son accompagnement.</p>
      <section>
        <h3>1. Données concernées</h3>
        <p>Selon le service utilisé et avec votre accord, PureOwner peut traiter un identifiant ou pseudonyme, une adresse de wallet publique, des informations de profil ou de configuration, ainsi que les informations que vous transmettez volontairement lors d'une demande d'accompagnement.</p>
      </section>
      <section>
        <h3>2. Finalités</h3>
        <p>Ces informations servent à fournir le résultat demandé, personnaliser un visuel ou une interface, répondre à une demande, sécuriser le service et améliorer son fonctionnement technique.</p>
      </section>
      <section>
        <h3>3. Ce que nous ne faisons pas</h3>
        <p>PureOwner n'utilise pas vos données pour de la publicité ciblée, du profilage comportemental ou leur revente. Aucune information personnelle sensible ne doit être inscrite directement sur une blockchain publique.</p>
      </section>
      <section>
        <h3>4. Base et durée du traitement</h3>
        <p>Le traitement repose sur votre demande, votre consentement lorsqu'il est requis, et l'intérêt légitime de sécuriser le service. Les données sont conservées uniquement pendant la durée nécessaire à la finalité annoncée. Les journaux techniques éventuels sont limités et supprimés selon les contraintes de sécurité et d'exploitation.</p>
      </section>
      <section>
        <h3>5. Destinataires et prestataires</h3>
        <p>Les données ne sont accessibles qu'aux personnes et prestataires techniques indispensables au fonctionnement du service. Elles ne sont jamais vendues. Un transfert peut uniquement intervenir lorsqu'il est nécessaire à l'exécution du service ou imposé par la loi.</p>
      </section>
      <section>
        <h3>6. Wallets et réseaux publics</h3>
        <p>Une adresse de wallet et les transactions associées peuvent être visibles publiquement. PureOwner recommande de ne jamais communiquer une phrase secrète, une clé privée ou toute donnée confidentielle. Vous restez responsable des autorisations signées avec votre wallet.</p>
      </section>
      <section>
        <h3>7. Sécurité</h3>
        <p>PureOwner applique des mesures raisonnables de minimisation, de contrôle d'accès et de sécurisation. Aucun système n'étant infaillible, seules les informations strictement nécessaires doivent être transmises.</p>
      </section>
      <section>
        <h3>8. Vos droits</h3>
        <p>Vous pouvez demander l'accès, la rectification, la suppression, la limitation ou l'opposition au traitement de vos données, ainsi que leur portabilité lorsque celle-ci s'applique. Pour exercer ces droits, utilisez les coordonnées indiquées sur le site.</p>
      </section>
      <section>
        <h3>9. Évolution de la politique</h3>
        <p>Cette politique peut évoluer avec les services de PureOwner. La version publiée sur le site est la version applicable.</p>
      </section>`
  };

  function normalizeText(value) {
    return (value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function closeLearningPanels() {
    const selectors = [
      "#learning details",
      "#learn details",
      "#apprentissage details",
      "#centre-apprentissage details",
      ".learning-center details",
      ".learning-hub details",
      ".learning-section details"
    ];
    document.querySelectorAll(selectors.join(",")).forEach((panel) => {
      panel.open = false;
      panel.removeAttribute("open");
    });

    document.querySelectorAll("section").forEach((section) => {
      const heading = section.querySelector("h1, h2, h3");
      const label = normalizeText(heading && heading.textContent);
      if (label.includes("centre d'apprentissage") || label.includes("infrastructure crypto")) {
        section.querySelectorAll("details").forEach((panel) => {
          panel.open = false;
          panel.removeAttribute("open");
        });
      }
    });
  }

  function buildModal() {
    let modal = document.getElementById("privacy-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "privacy-modal";
    modal.className = "privacy-modal";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="privacy-backdrop" data-privacy-close></div>
      <section class="privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
        <header class="privacy-dialog-header">
          <div>
            <span class="privacy-eyebrow">PUREOWNER · CONFIDENTIALITÉ</span>
            <h2 id="privacy-title">Vos données restent les vôtres.</h2>
          </div>
          <button class="privacy-close" type="button" data-privacy-close aria-label="Fermer">×</button>
        </header>
        <div class="privacy-tabs" role="tablist" aria-label="Niveau de détail">
          <button type="button" role="tab" data-privacy-tab="simple">Version simplifiée</button>
          <button type="button" role="tab" data-privacy-tab="detailed">Version détaillée</button>
        </div>
        <div class="privacy-content" data-privacy-content></div>
      </section>`;
    document.body.appendChild(modal);
    return modal;
  }

  function findAccompanimentSection() {
    return Array.from(document.querySelectorAll("section")).find((section) => {
      const heading = section.querySelector("h1, h2, h3");
      return normalizeText(heading && heading.textContent).includes("nous vous accompagnons");
    });
  }

  function ensureTriggers() {
    const footer = document.querySelector("footer");
    if (footer && !document.querySelector("[data-privacy-mode='simple']")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "privacy-footer-link";
      button.dataset.privacyMode = "simple";
      button.textContent = "Politique de confidentialité";
      footer.appendChild(button);
    }

    const section = findAccompanimentSection();
    if (section && !section.querySelector("[data-privacy-mode='detailed']")) {
      const block = document.createElement("div");
      block.className = "privacy-support-note";
      block.innerHTML = `
        <div>
          <span class="privacy-eyebrow">CONFIANCE & DONNÉES</span>
          <h3>Un accompagnement qui respecte votre autonomie.</h3>
          <p>Découvrez précisément les informations utilisées, leur durée de traitement et les droits dont vous disposez.</p>
        </div>
        <button type="button" class="privacy-detail-button" data-privacy-mode="detailed">Lire la politique détaillée</button>`;
      section.appendChild(block);
    }
  }

  function initPrivacy() {
    const modal = buildModal();
    if (!modal) return;
    const content = modal.querySelector("[data-privacy-content]");
    const tabs = Array.from(modal.querySelectorAll("[data-privacy-tab]"));
    // La modale V2 peut déjà être installée par privacy-center-v2.js.
    // Dans ce cas, elle possède sa propre structure et sa propre logique.
    if (!content || !tabs.length) return;
    let previousFocus = null;

    function setMode(mode) {
      const selected = mode === "detailed" ? "detailed" : "simple";
      content.innerHTML = policies[selected];
      tabs.forEach((tab) => {
        const active = tab.dataset.privacyTab === selected;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      modal.dataset.mode = selected;
    }

    function openModal(mode) {
      previousFocus = document.activeElement;
      setMode(mode);
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("privacy-open");
      modal.querySelector(".privacy-close").focus();
    }

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("privacy-open");
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-privacy-mode]");
      if (trigger) {
        event.preventDefault();
        openModal(trigger.dataset.privacyMode);
        return;
      }
      const tab = event.target.closest("[data-privacy-tab]");
      if (tab) setMode(tab.dataset.privacyTab);
      if (event.target.closest("[data-privacy-close]")) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    setMode("simple");
  }

  function init() {
    closeLearningPanels();
    ensureTriggers();
    initPrivacy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
