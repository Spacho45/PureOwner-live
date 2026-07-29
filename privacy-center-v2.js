/* PureOwner: apprentissage replie et politiques de confidentialite. */
(() => {
  "use strict";

  if (window.__pureOwnerPrivacyCenterV2) return;
  window.__pureOwnerPrivacyCenterV2 = true;

  const simplePolicy = {
    title: "Politique de confidentialité simplifiée",
    intro: "PureOwner respecte votre vie privée. Les données que vous autorisez sont utilisées uniquement pour fournir l'expérience demandée et ne sont pas conservées au-delà du temps nécessaire à ce traitement.",
    sections: [
      ["Données utilisées", "Selon la fonction choisie et avec votre autorisation, PureOwner peut lire votre identifiant ou pseudonyme, votre adresse de wallet et certaines informations de profil ou de paramétrage nécessaires à l'affichage."],
      ["Pourquoi", "Ces informations servent uniquement à générer un visuel personnalisé, afficher le résultat demandé et assurer le bon fonctionnement du service. Elles ne sont pas utilisées à des fins publicitaires, de profilage comportemental ou de marketing."],
      ["Conservation et partage", "PureOwner ne vend pas vos données. Elles sont traitées pendant la réalisation de l'action demandée puis ne sont pas stockées, sauf nécessité technique clairement indiquée ou obligation légale."],
      ["Vos droits", "Vous pouvez demander l'accès, la rectification, la suppression ou la limitation de l'usage de vos données."],
      ["Contact", "Pour toute question relative à la confidentialité, contactez PureOwner depuis les coordonnées ou le formulaire de contact publiés sur le site."]
    ]
  };

  const detailedPolicy = {
    title: "Politique de confidentialité détaillée",
    intro: "Cette politique décrit de façon transparente les traitements susceptibles d'intervenir lorsque PureOwner vous accompagne dans la recherche, la configuration ou la présentation d'une identité et d'actifs numériques.",
    sections: [
      ["Responsable du traitement", "PureOwner est responsable des traitements réalisés directement dans le cadre de ses services et de son accompagnement."],
      ["Données concernées", "Selon votre demande : coordonnées de contact, identifiant ou pseudonyme, adresse publique de wallet, préférences, informations de projet et éléments strictement nécessaires à la configuration ou à la création du résultat demandé."],
      ["Finalités et bases légales", "Les données servent à répondre à votre demande, exécuter un accompagnement convenu, sécuriser le service et respecter les obligations légales. Le traitement repose, selon le cas, sur votre consentement, l'exécution d'un contrat ou l'intérêt légitime de PureOwner à fournir et sécuriser ses services."],
      ["Durée de conservation", "Les données utilisées pour un affichage ou une génération ponctuelle ne sont pas conservées après le traitement. Les échanges liés à un accompagnement peuvent être conservés pendant la durée nécessaire à son exécution, puis archivés uniquement pendant les délais imposés par la loi."],
      ["Destinataires et prestataires", "PureOwner ne vend pas vos données. Un accès limité peut être accordé à des prestataires techniques indispensables à l'hébergement, la sécurité ou l'exécution du service. Ils n'interviennent que sur instruction et dans la limite de leur mission."],
      ["Wallets et blockchains publiques", "Une adresse de wallet et les opérations inscrites sur une blockchain publique peuvent être visibles et conservées durablement par le réseau. PureOwner recommande de ne jamais inscrire directement de données personnelles sensibles sur une blockchain. Une opération confirmée sur une blockchain ne peut généralement pas être supprimée par PureOwner."],
      ["Sécurité", "Des mesures raisonnables de limitation des accès, de chiffrement lorsqu'il est approprié et de minimisation des données sont appliquées. Aucun système ne pouvant garantir un risque nul, seules les informations strictement utiles doivent être communiquées."],
      ["Vos droits", "Dans les limites prévues par la réglementation, vous pouvez demander l'accès, la rectification, l'effacement, la limitation ou l'opposition au traitement, ainsi que la portabilité des données concernées. Vous pouvez également retirer votre consentement à tout moment pour les traitements qui en dépendent."],
      ["Contact", "Toute demande relative à la confidentialité peut être adressée à PureOwner au moyen des coordonnées ou du formulaire de contact publiés sur le site. Une réponse vous sera apportée dans les délais réglementaires."]
    ]
  };

  const findSection = (pattern) => Array.from(document.querySelectorAll("section"))
    .find((section) => pattern.test(section.textContent || ""));

  function closeLearningPanels() {
    const learning = document.querySelector("#learning, #apprendre, #learn, [data-section='learn']")
      || findSection(/centre d['’]apprentissage|learning center/i);

    if (!learning) return;
    learning.querySelectorAll("details").forEach((details) => {
      details.open = false;
      details.removeAttribute("open");
    });
  }

  function createDialog() {
    let dialog = document.getElementById("pureowner-privacy-dialog");
    if (dialog) return dialog;

    dialog = document.createElement("dialog");
    dialog.id = "pureowner-privacy-dialog";
    dialog.className = "po-privacy-dialog";
    dialog.setAttribute("aria-labelledby", "pureowner-privacy-title");
    dialog.innerHTML = `
      <div class="po-privacy-shell">
        <header class="po-privacy-head">
          <div>
            <p class="po-privacy-kicker">PureOwner · Vie privée</p>
            <h2 class="po-privacy-title" id="pureowner-privacy-title"></h2>
          </div>
          <button class="po-privacy-close" type="button" aria-label="Fermer" title="Fermer">×</button>
        </header>
        <div class="po-privacy-body"></div>
      </div>`;

    document.body.appendChild(dialog);
    dialog.querySelector(".po-privacy-close").addEventListener("click", () => closeDialog(dialog));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
    return dialog;
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    dialog.removeAttribute("data-fallback-open");
  }

  function openPolicy(mode) {
    const dialog = createDialog();
    const policy = mode === "detailed" ? detailedPolicy : simplePolicy;
    dialog.querySelector(".po-privacy-title").textContent = policy.title;
    dialog.querySelector(".po-privacy-body").innerHTML = `
      <p class="po-privacy-intro">${policy.intro}</p>
      ${policy.sections.map(([title, text]) => `
        <section class="po-privacy-section">
          <h3>${title}</h3>
          <p>${text}</p>
        </section>`).join("")}`;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("data-fallback-open", "true");
    dialog.querySelector(".po-privacy-close").focus();
  }

  function addSimplePolicyLink() {
    const footer = document.querySelector("footer") || document.body;
    if (document.querySelector("[data-privacy-mode='simple']")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "po-privacy-footer-link";
    button.dataset.privacyMode = "simple";
    button.textContent = "Confidentialité";
    button.addEventListener("click", () => openPolicy("simple"));
    footer.appendChild(button);
  }

  function addDetailedPolicyLink() {
    const accompaniment = findSection(/nous vous accompagnons/i);
    if (!accompaniment || accompaniment.querySelector("[data-privacy-mode='detailed']")) return;

    const note = document.createElement("div");
    note.className = "po-privacy-note";
    note.innerHTML = `
      <h3>Confidentialité et transparence</h3>
      <p>Notre accompagnement peut impliquer des informations de profil ou de wallet. Le cadre complet précise ce qui est utilisé, pourquoi et pendant combien de temps.</p>
      <button class="po-privacy-trigger" type="button" data-privacy-mode="detailed">Lire la politique détaillée</button>`;
    note.querySelector("button").addEventListener("click", () => openPolicy("detailed"));
    accompaniment.appendChild(note);
  }

  function init() {
    closeLearningPanels();
    addSimplePolicyLink();
    addDetailedPolicyLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
