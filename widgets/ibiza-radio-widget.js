(function () {
      if (window.__pureOwnerIbizaRadioLoaded) return;
      window.__pureOwnerIbizaRadioLoaded = true;

      const RADIO_WIDGET_CONFIG = {
        defaultRadioId: "ibiza-global-radio",
        inactivityDelay: 5000,
        persistNavigation: false,
        persistRootSelector: "[data-radio-persist-root]",
        persistExcludeSelector: ".widget-global-nav, [data-radio-no-persist]",
        soundeoUrl: "https://soundeo.com/",
        ibizaGlobalTvUrl: "https://player.restream.io/?token=6c890f7579574b4c9606ad540440232d",
        position: "bottom-right",
        theme: {
          accent: "#141414",
          live: "#ff3b30"
        },
        radios: [
          {
            id: "ibiza-global-radio",
            name: "Ibiza Global Radio",
            streamUrl: "https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3",
            fallbackStreams: [
              "https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3"
            ],
            officialUrl: "https://www.ibizaglobalradio.com/player-popup.html",
            logoUrl: "https://www.ibizaglobalradio.com/dist/img/favicon/apple-touch-icon.png",
            metadataUrl: "https://www.ibizaglobalradio.com/data/data.json",
            metadataParser: function (data) {
              const calendar = Array.isArray(data.calendar) ? data.calendar : [];
              const now = new Date();
              const currentShow = calendar.find(function (item) {
                return new Date(item.start) <= now && new Date(item.end) >= now;
              });
              const track = data.stream && data.stream.current_track ? data.stream.current_track : null;
              const historySources = [
                data.history,
                data.recent_tracks,
                data.last_tracks,
                data.tracks,
                data.stream && data.stream.history,
                data.stream && data.stream.recent_tracks,
                data.stream && data.stream.last_tracks
              ];
              const history = historySources.find(function (source) {
                return Array.isArray(source) && source.length;
              }) || [];
              return {
                show: currentShow && currentShow.title ? currentShow.title : "LIVE",
                title: track && track.title ? track.title : "En direct",
                artist: track && track.artist ? track.artist : "",
                history: history,
                officialUrl: "https://www.ibizaglobalradio.com/player-popup.html"
              };
            }
          }
        ]
      };

      const icons = {
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>',
        pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14"></path><path d="M16 5v14"></path></svg>',
        muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="m19 9-6 6"></path><path d="m13 9 6 6"></path></svg>',
        volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M18 6a8 8 0 0 1 0 12"></path></svg>',
        eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18"></path><path d="M10.6 10.6a3 3 0 0 0 3.8 3.8"></path><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-2.5 3.2"></path><path d="M6.4 6.5C3.6 8.4 2 12 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.1-.8"></path></svg>',
        pip: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><rect x="12" y="12" width="7" height="5" rx="1"></rect></svg>',
        refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-15.3 6.4"></path><path d="M3 12A9 9 0 0 1 18.3 5.6"></path><path d="M18 2v4h-4"></path><path d="M6 22v-4h4"></path></svg>',
        link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"></path></svg>',
        copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M5 15V7a2 2 0 0 1 2-2h8"></path></svg>',
        mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>',
        history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h10"></path><path d="M17 17l2 2 3-4"></path></svg>',
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
        star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 3.09 6.26 6.91 1-5 4.88 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.26l6.91-1L12 2z"></path></svg>'
      };

      const fallbackLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%23111111'/%3E%3Ccircle cx='60' cy='60' r='31' fill='none' stroke='white' stroke-width='8'/%3E%3Cpath d='M42 60h36M60 42v36' stroke='white' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E";

      let root = document.getElementById("premiumRadioWidget");
      if (!root) {
        root = document.createElement("div");
        root.id = "premiumRadioWidget";
        root.className = "radio-widget is-muted";
        root.dataset.position = RADIO_WIDGET_CONFIG.position;
        document.body.appendChild(root);
      }
      const radio = RADIO_WIDGET_CONFIG.radios.find(function (item) {
        return item.id === RADIO_WIDGET_CONFIG.defaultRadioId;
      }) || RADIO_WIDGET_CONFIG.radios[0];

      let streamIndex = 0;
      let idleTimer = null;
      let metadataTimer = null;
      let copyFeedbackTimer = null;
      let favoriteExportTimer = null;
      let favoriteMailTimer = null;
      let tvRefreshTimer = null;
      let trackHistory = [];
      let favoriteTracks = loadFavorites();
      let favoriteKeys = favoriteTracks.map(trackKey);
      let isPlaying = false;
      let hasStarted = false;

      const audio = new Audio();
      audio.preload = "none";

      root.dataset.position = RADIO_WIDGET_CONFIG.position;
      root.style.setProperty("--accent", RADIO_WIDGET_CONFIG.theme.accent);
      root.style.setProperty("--live", RADIO_WIDGET_CONFIG.theme.live);

      root.innerHTML = [
        '<button class="radio-mute" type="button" aria-label="Activer Ibiza Global Radio">',
          '<img src="' + radio.logoUrl + '" alt="">',
          '<span>MUTE</span>',
        '</button>',
        '<section class="radio-shell" aria-label="Lecteur radio flottant">',
          '<button class="radio-logo" type="button" data-favorite-current title="Favori du titre en cours" aria-label="Ajouter le titre en cours aux favoris">',
            '<img src="' + radio.logoUrl + '" alt="">',
          '</button>',
          '<div class="radio-head">',
            '<div class="radio-brand">',
              '<div class="radio-name-wrap">',
                '<div class="radio-kicker"><span class="radio-live-dot"></span><span data-live>LIVE</span></div>',
                '<div class="radio-name"><span data-radio-name>' + radio.name + '</span></div>',
              '</div>',
            '</div>',
            '<div class="radio-track">',
              '<div class="radio-track-title"><span data-track-title>En direct</span></div>',
              '<div class="radio-artist" data-artist>Ibiza Global Radio</div>',
              '<div class="radio-status"><strong data-status>En attente</strong><span data-detail>Aucun son sans clic utilisateur.</span></div>',
            '</div>',
          '</div>',
          '<div class="radio-compact-actions">',
            '<button class="radio-action radio-play" type="button" data-play aria-label="Lecture ou pause">' + icons.play + '</button>',
            '<div class="radio-volume-control" data-volume-control>',
              '<button class="radio-action" type="button" data-volume title="Volume" aria-label="Ouvrir le volume">' + icons.volume + '</button>',
              '<div class="radio-volume-slider" data-extended-volume-popover>',
                '<input type="range" min="0" max="100" value="100" data-volume-range aria-label="Volume du lecteur etendu">',
              '</div>',
            '</div>',
            '<button class="radio-action" type="button" data-history title="Derniers titres" aria-label="Afficher les derniers titres">' + icons.history + '</button>',
            '<button class="radio-action" type="button" data-copy-title title="Copier le titre" aria-label="Copier le titre en cours">' + icons.copy + '</button>',
            '<button class="radio-action" type="button" data-eye title="Masquer" aria-label="Masquer le lecteur">' + icons.eye + '</button>',
            '<button class="radio-action" type="button" data-tv title="Ibiza Global TV" aria-label="Ouvrir Ibiza Global TV">' + icons.pip + '</button>',
            '<div class="radio-meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div>',
          '</div>',
          '<div class="radio-tv-popover" data-tv-popover aria-label="Ibiza Global TV">',
            '<div class="radio-tv-head">',
              '<div class="radio-tv-label"><span>IBIZA GLOBAL TV</span><span class="radio-tv-live">LIVE</span></div>',
              '<div class="radio-tv-actions">',
                '<button class="radio-tv-button" type="button" data-tv-refresh title="Actualiser le flux" aria-label="Actualiser le flux Ibiza Global TV">' + icons.refresh + '</button>',
                '<button class="radio-tv-button" type="button" data-tv-open title="Ouvrir dans un nouvel onglet" aria-label="Ouvrir Ibiza Global TV dans un nouvel onglet">' + icons.link + '</button>',
              '</div>',
            '</div>',
            '<div class="radio-tv-frame" data-tv-frame></div>',
            '<div class="radio-tv-state" data-tv-state>Chaine en direct. Restream indiquera si la diffusion est hors ligne.</div>',
          '</div>',
          '<div class="radio-history-popover" data-history-popover>',
            '<div class="radio-history-head"><span>Derniers titres</span><div class="radio-history-head-actions"><button class="radio-history-export" type="button" data-mail-favorites title="Envoyer les favoris par mail" aria-label="Envoyer les favoris par mail">' + icons.mail + '<span>Mail</span></button><button class="radio-history-export" type="button" data-copy-favorites title="Copier tous les favoris" aria-label="Copier tous les favoris">' + icons.copy + '<span>Favoris</span></button><span data-history-count>0</span></div></div>',
            '<ul class="radio-history-list" data-history-list><li><div><div class="radio-history-title">Historique indisponible</div><div class="radio-history-artist">En attente des donnees radio</div></div></li></ul>',
          '</div>',
          '<div class="radio-orbit" aria-label="Lecteur radio reduit">',
            '<button class="radio-orbit-logo" type="button" data-favorite-current title="Favori du titre en cours" aria-label="Ajouter le titre en cours aux favoris">',
              '<img src="' + radio.logoUrl + '" alt="">',
            '</button>',
            '<button class="radio-orbit-dot is-volume" type="button" data-orbit-volume title="Volume" aria-label="Ouvrir le volume">' + icons.volume + '</button>',
            '<div class="radio-volume-popover" data-volume-popover>',
              '<div class="radio-volume-visual" aria-hidden="true"><span class="radio-volume-fader"></span></div>',
              '<input type="range" min="0" max="100" value="100" data-volume-range aria-label="Volume">',
            '</div>',
            '<button class="radio-orbit-dot is-eye" type="button" data-orbit-eye title="Afficher" aria-label="Afficher le lecteur">' + icons.eye + '</button>',
            '<button class="radio-orbit-dot is-play" type="button" data-orbit-play title="Lecture ou pause" aria-label="Lecture ou pause">' + icons.play + '</button>',
            '<button class="radio-orbit-dot is-copy" type="button" data-orbit-copy title="Copier le titre" aria-label="Copier le titre en cours">' + icons.copy + '</button>',
          '</div>',
        '</section>'
      ].join("");

      const muteButton = root.querySelector(".radio-mute");
      const favoriteCurrentButtons = root.querySelectorAll("[data-favorite-current]");
      const playButton = root.querySelector("[data-play]");
      const volumeControl = root.querySelector("[data-volume-control]");
      const volumeButton = root.querySelector("[data-volume]");
      const orbit = root.querySelector(".radio-orbit");
      const orbitPlayButton = root.querySelector("[data-orbit-play]");
      const orbitVolumeButton = root.querySelector("[data-orbit-volume]");
      const copyButton = root.querySelector("[data-copy-title]");
      const orbitCopyButton = root.querySelector("[data-orbit-copy]");
      const volumeRanges = root.querySelectorAll("[data-volume-range]");
      const tvButton = root.querySelector("[data-tv]");
      const tvFrame = root.querySelector("[data-tv-frame]");
      const tvRefreshButton = root.querySelector("[data-tv-refresh]");
      const tvOpenButton = root.querySelector("[data-tv-open]");
      const tvState = root.querySelector("[data-tv-state]");
      const historyButton = root.querySelector("[data-history]");
      const copyFavoritesButton = root.querySelector("[data-copy-favorites]");
      const mailFavoritesButton = root.querySelector("[data-mail-favorites]");
      const historyList = root.querySelector("[data-history-list]");
      const historyCount = root.querySelector("[data-history-count]");
      const eyeButton = root.querySelector("[data-eye]");
      const orbitEyeButtons = root.querySelectorAll("[data-orbit-eye]");
      const trackTitle = root.querySelector("[data-track-title]");
      const marqueeContainers = root.querySelectorAll(".radio-name, .radio-track-title");
      const artist = root.querySelector("[data-artist]");
      const status = root.querySelector("[data-status]");
      const detail = root.querySelector("[data-detail]");

      root.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
          image.src = fallbackLogo;
        }, { once: true });
      });

      marqueeContainers.forEach(setupMarquee);

      function setupMarquee(container) {
        const text = container.querySelector("span");
        if (!text) return;

        container.addEventListener("pointerenter", function () {
          if (root.classList.contains("is-hidden")) return;
          container.classList.remove("is-marquee");
          text.style.transform = "translateX(0)";
          const shift = Math.ceil(text.scrollWidth - container.clientWidth);
          if (shift <= 2) return;
          const duration = Math.min(7, Math.max(2.2, shift / 28));
          container.style.setProperty("--marquee-shift", shift + "px");
          container.style.setProperty("--marquee-duration", duration + "s");
          requestAnimationFrame(function () {
            container.classList.add("is-marquee");
          });
        });

        container.addEventListener("pointerleave", function () {
          container.classList.remove("is-marquee");
          text.style.transform = "translateX(0)";
        });

        container.addEventListener("animationend", function (event) {
          if (event.animationName !== "radioMarquee") return;
          container.classList.remove("is-marquee");
          text.style.transform = "translateX(0)";
        });
      }

      function setStatus(main, extra, error) {
        status.textContent = main;
        detail.textContent = extra || "";
        root.classList.toggle("is-error", Boolean(error));
      }

      function setIdleTimer() {
        window.clearTimeout(idleTimer);
        root.classList.remove("is-idle");
        if (!hasStarted || root.classList.contains("is-hidden")) return;
        idleTimer = window.setTimeout(function () {
          root.classList.add("is-idle");
        }, RADIO_WIDGET_CONFIG.inactivityDelay);
      }

      function reveal() {
        root.classList.remove("is-hidden", "is-idle");
        orbit.classList.remove("is-volume-open");
        volumeControl.classList.remove("is-volume-open");
        root.classList.remove("is-history-open", "is-tv-open");
        eyeButton.innerHTML = icons.eye;
        eyeButton.setAttribute("aria-label", "Masquer le lecteur");
        setIdleTimer();
      }

      function hidePanel() {
        root.classList.add("is-hidden");
        root.classList.remove("is-idle", "is-history-open", "is-tv-open");
        volumeControl.classList.remove("is-volume-open");
        eyeButton.innerHTML = icons.eyeOff;
        eyeButton.setAttribute("aria-label", "Afficher le lecteur");
        window.clearTimeout(idleTimer);
      }

      function setPlayingState(nextPlaying) {
        isPlaying = nextPlaying;
        root.classList.toggle("is-playing", isPlaying);
        playButton.innerHTML = isPlaying ? icons.pause : icons.play;
        orbitPlayButton.innerHTML = isPlaying ? icons.pause : icons.play;
        playButton.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Lancer la radio");
        orbitPlayButton.setAttribute("aria-label", isPlaying ? "Mettre en pause" : "Lancer la radio");
        setStatus(isPlaying ? "Lecture en direct" : "Pause", isPlaying ? "Flux officiel Ibiza Global Radio." : "Le flux est pret.");
      }

      function configureAudioSource() {
        const streams = [radio.streamUrl].concat(radio.fallbackStreams || []);
        audio.src = streams[streamIndex] || radio.streamUrl;
      }

      async function playRadio() {
        root.classList.remove("is-muted");
        hasStarted = true;
        reveal();
        configureAudioSource();
        setStatus("Connexion live", "Ouverture du flux officiel Ibiza Global Radio.");
        fetchMetadata();
        try {
          await audio.play();
          setPlayingState(true);
          updateMediaSession();
        } catch (error) {
          setPlayingState(false);
          setStatus("Lecture bloquee", "Clique sur lecture pour relancer le flux.", true);
        }
      }

      function pauseRadio() {
        audio.pause();
        setPlayingState(false);
      }

      function togglePlay() {
        setIdleTimer();
        if (audio.paused) {
          playRadio();
        } else {
          pauseRadio();
        }
      }

      function toggleExtendedVolume() {
        volumeControl.classList.toggle("is-volume-open");
        orbit.classList.remove("is-volume-open");
        setIdleTimer();
      }

      function setVolume(value) {
        const nextVolume = Math.max(0, Math.min(1, Number(value) / 100));
        const level = String(Math.round(nextVolume * 100));
        audio.volume = nextVolume;
        audio.muted = nextVolume === 0;
        orbit.style.setProperty("--volume-level", level);
        volumeControl.style.setProperty("--volume-level", level);
        volumeRanges.forEach(function (range) {
          if (range.value !== level) range.value = level;
        });
        volumeButton.innerHTML = audio.muted ? icons.muted : icons.volume;
        orbitVolumeButton.innerHTML = audio.muted ? icons.muted : icons.volume;
        volumeButton.setAttribute("aria-label", audio.muted ? "Volume coupe" : "Ouvrir le volume");
        orbitVolumeButton.setAttribute("aria-label", audio.muted ? "Retablir le son" : "Ouvrir le volume");
      }

      function toggleOrbitVolume() {
        orbit.classList.toggle("is-volume-open");
        volumeControl.classList.remove("is-volume-open");
        setIdleTimer();
      }

      function showCopyFeedback() {
        window.clearTimeout(copyFeedbackTimer);
        copyButton.classList.add("is-copied");
        orbitCopyButton.classList.add("is-copied");
        copyFeedbackTimer = window.setTimeout(function () {
          copyButton.classList.remove("is-copied");
          orbitCopyButton.classList.remove("is-copied");
        }, 3000);
      }

      function loadFavorites() {
        try {
          const saved = JSON.parse(localStorage.getItem("ibizaRadioFavoriteTracks") || "[]");
          if (!Array.isArray(saved)) return [];
          const entries = saved.map(function (item) {
            if (typeof item === "string") {
              const parts = item.split("|");
              return normalizeTrackEntry({
                title: parts[0] || "",
                artist: parts.slice(1).join("|") || ""
              });
            }
            return normalizeTrackEntry(item);
          }).filter(Boolean);
          return entries.filter(function (entry, index, array) {
            const key = trackKey(entry);
            return array.findIndex(function (item) {
              return trackKey(item) === key;
            }) === index;
          });
        } catch (error) {
          return [];
        }
      }

      function saveFavorites() {
        try {
          localStorage.setItem("ibizaRadioFavoriteTracks", JSON.stringify(favoriteTracks.slice(0, 120)));
        } catch (error) {
          return;
        }
      }

      function syncFavoriteKeys() {
        favoriteKeys = favoriteTracks.map(trackKey).filter(Boolean);
      }

      function trackKey(entry) {
        if (!entry) return "";
        return String((entry.title || "") + "|" + (entry.artist || "")).trim().toLowerCase();
      }

      function getCurrentTrackEntry() {
        return normalizeTrackEntry({
          title: trackTitle.textContent,
          artist: artist.textContent
        });
      }

      function isFavoriteEntry(entry) {
        const key = trackKey(entry);
        return Boolean(key && favoriteKeys.includes(key));
      }

      function updateCurrentFavoriteState() {
        const current = getCurrentTrackEntry();
        const isFavorite = isFavoriteEntry(current);
        root.classList.toggle("is-current-favorite", isFavorite);
        favoriteCurrentButtons.forEach(function (button) {
          button.setAttribute("aria-label", isFavorite ? "Retirer le titre en cours des favoris" : "Ajouter le titre en cours aux favoris");
          button.setAttribute("title", isFavorite ? "Retirer des favoris" : "Ajouter aux favoris");
        });
      }

      function toggleFavoriteEntry(entry) {
        const normalized = normalizeTrackEntry(entry);
        if (!normalized) return false;
        const key = trackKey(normalized);
        const existingIndex = favoriteKeys.indexOf(key);
        const nextFavorite = existingIndex === -1;
        if (nextFavorite) {
          favoriteTracks.unshift(normalized);
        } else {
          favoriteTracks.splice(existingIndex, 1);
        }
        favoriteTracks = favoriteTracks.filter(function (item, index, array) {
          const itemKey = trackKey(item);
          return itemKey && array.findIndex(function (candidate) {
            return trackKey(candidate) === itemKey;
          }) === index;
        });
        syncFavoriteKeys();
        saveFavorites();
        renderTrackHistory();
        updateCurrentFavoriteState();
        setStatus(nextFavorite ? "Titre favori" : "Favori retire", [normalized.title, normalized.artist].filter(Boolean).join(" - "));
        if (nextFavorite) {
          openSoundeoForTrack(normalized);
        }
        setIdleTimer();
        return nextFavorite;
      }

      function toggleCurrentFavorite() {
        const current = getCurrentTrackEntry();
        if (!current) {
          setStatus("Favori indisponible", "Aucun titre precis a taguer pour le moment.", true);
          setIdleTimer();
          return;
        }
        updateTrackHistory([]);
        toggleFavoriteEntry(current);
      }

      function normalizeTrackEntry(entry) {
        if (!entry) return null;
        const title = String(entry.title || entry.name || entry.track || entry.song || "").trim();
        const artistName = String(entry.artist || entry.artist_name || entry.author || "").trim();
        if (!title || title === "En direct") return null;
        return { title: title, artist: artistName };
      }

      function updateTrackHistory(entries) {
        const nextEntries = (Array.isArray(entries) ? entries : []).map(normalizeTrackEntry).filter(Boolean);
        const current = normalizeTrackEntry({
          title: trackTitle.textContent,
          artist: artist.textContent
        });
        if (current) nextEntries.unshift(current);

        const deduped = [];
        nextEntries.forEach(function (entry) {
          const key = (entry.title + "|" + entry.artist).toLowerCase();
          if (deduped.some(function (item) {
            return (item.title + "|" + item.artist).toLowerCase() === key;
          })) return;
          deduped.push(entry);
        });
        trackHistory = deduped.concat(trackHistory).filter(function (entry, index, array) {
          const key = (entry.title + "|" + entry.artist).toLowerCase();
          return array.findIndex(function (item) {
            return (item.title + "|" + item.artist).toLowerCase() === key;
          }) === index;
        }).slice(0, 5);
        renderTrackHistory();
      }

      function renderTrackHistory() {
        historyCount.textContent = String(trackHistory.length);
        if (!trackHistory.length) {
          historyList.innerHTML = '<li><div><div class="radio-history-title">Historique indisponible</div><div class="radio-history-artist">En attente des donnees radio</div></div></li>';
          return;
        }
        historyList.innerHTML = trackHistory.map(function (entry, index) {
          const isFavorite = isFavoriteEntry(entry);
          return [
            '<li>',
              '<div>',
                '<div class="radio-history-title">' + escapeHtml(entry.title) + '</div>',
                '<div class="radio-history-artist">' + escapeHtml(entry.artist || radio.name) + '</div>',
              '</div>',
              '<div class="radio-history-actions">',
                '<button class="radio-history-copy" type="button" data-history-soundeo="' + index + '" title="Ouvrir Soundeo et copier ce titre" aria-label="Ouvrir Soundeo et copier ce titre">' + icons.search + '</button>',
                '<button class="radio-history-favorite' + (isFavorite ? " is-favorite" : "") + '" type="button" data-history-favorite="' + index + '" title="' + (isFavorite ? "Retirer des favoris" : "Ajouter aux favoris") + '" aria-label="' + (isFavorite ? "Retirer ce titre des favoris" : "Ajouter ce titre aux favoris") + '">' + icons.star + '</button>',
              '</div>',
            '</li>'
          ].join("");
        }).join("");
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
          return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          }[char];
        });
      }

      function toggleHistory() {
        root.classList.remove("is-tv-open");
        root.classList.toggle("is-history-open");
        setIdleTimer();
      }

      function setTvState(message, loading) {
        tvState.textContent = message;
        tvRefreshButton.disabled = Boolean(loading);
      }

      function createTvIframe() {
        const iframe = document.createElement("iframe");
        iframe.src = RADIO_WIDGET_CONFIG.ibizaGlobalTvUrl;
        iframe.title = "Ibiza Global TV - diffusion en direct";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.addEventListener("load", function () {
          setTvState("Chaine en direct. Restream indiquera si la diffusion est hors ligne.", false);
        });
        return iframe;
      }

      function ensureTvIframe() {
        let iframe = tvFrame.querySelector("iframe");
        if (iframe) return iframe;
        iframe = createTvIframe();
        tvFrame.appendChild(iframe);
        return iframe;
      }

      function toggleTvPanel() {
        const nextOpen = !root.classList.contains("is-tv-open");
        const alreadyLoaded = Boolean(tvFrame.querySelector("iframe"));
        root.classList.toggle("is-tv-open", nextOpen);
        root.classList.remove("is-history-open");
        if (nextOpen) {
          ensureTvIframe();
          setTvState(alreadyLoaded ? "Chaine en direct. Restream indiquera si la diffusion est hors ligne." : "Chargement du lecteur Restream...", !alreadyLoaded);
        }
        setIdleTimer();
      }

      function refreshTvPlayer() {
        const iframe = ensureTvIframe();
        setTvState("Actualisation du flux...", true);
        window.clearTimeout(tvRefreshTimer);
        tvRefreshTimer = window.setTimeout(function () {
          setTvState("Chaine en direct. Restream indiquera si la diffusion est hors ligne.", false);
        }, 2400);
        iframe.src = RADIO_WIDGET_CONFIG.ibizaGlobalTvUrl;
        setIdleTimer();
      }

      function openTvPlayer() {
        window.open(RADIO_WIDGET_CONFIG.ibizaGlobalTvUrl, "_blank", "noopener,noreferrer");
        setTvState("Lecteur ouvert dans un nouvel onglet.", false);
        setIdleTimer();
      }

      async function copyTextValue(value) {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
          }
          setStatus("Titre copie", value);
          return true;
        } catch (error) {
          setStatus("Copie impossible", "Selectionne le titre manuellement.", true);
          return false;
        } finally {
          setIdleTimer();
        }
      }

      function openSoundeoForTrack(entry) {
        const value = formatTrackValue(entry);
        const soundeoTab = window.open(RADIO_WIDGET_CONFIG.soundeoUrl, "_blank", "noopener,noreferrer");
        copyTextValue(value).then(function (copied) {
          if (soundeoTab) {
            setStatus(copied ? "Soundeo ouvert" : "Soundeo ouvert", copied ? "Titre copie. Colle-le dans la recherche Soundeo." : "Copie impossible, colle le titre manuellement.");
          } else {
            setStatus(copied ? "Soundeo bloque" : "Soundeo bloque", copied ? "Titre copie. Autorise les pop-ups pour ouvrir Soundeo." : "Autorise les pop-ups puis copie le titre manuellement.", true);
          }
        });
      }

      function formatTrackValue(entry) {
        const normalized = normalizeTrackEntry(entry);
        if (!normalized) return "En direct";
        return [normalized.title, normalized.artist].filter(function (part) {
          return part && part !== radio.name && part !== "En direct";
        }).join(" - ") || normalized.title || "En direct";
      }

      async function copyCurrentTitle() {
        const copied = await copyTextValue(formatTrackValue({
          title: trackTitle.textContent,
          artist: artist.textContent
        }));
        if (copied) showCopyFeedback();
      }

      async function copyFavoriteTextList() {
        const lines = getFavoriteTextLines();
        if (!lines.length) {
          setStatus("Aucun favori", "Ajoute au moins un titre avant de copier la liste.", true);
          setIdleTimer();
          return;
        }
        const copied = await copyTextValue(lines.join("\n"));
        if (!copied) return;
        window.clearTimeout(favoriteExportTimer);
        copyFavoritesButton.classList.add("is-copied");
        favoriteExportTimer = window.setTimeout(function () {
          copyFavoritesButton.classList.remove("is-copied");
        }, 3000);
        setStatus("Favoris copies", lines.length + " titre" + (lines.length > 1 ? "s" : "") + " en texte brut.");
      }

      function getFavoriteTextLines() {
        return favoriteTracks.map(formatTrackValue).filter(function (value, index, array) {
          return value && value !== "En direct" && array.indexOf(value) === index;
        });
      }

      function mailFavoriteTextList() {
        const lines = getFavoriteTextLines();
        if (!lines.length) {
          setStatus("Aucun favori", "Ajoute au moins un titre avant de preparer le mail.", true);
          setIdleTimer();
          return;
        }
        const subject = "Mes favoris Ibiza Global Radio";
        const body = [
          "Voici les titres favoris reperes depuis le widget Ibiza Global Radio:",
          "",
          lines.join("\n"),
          "",
          "Tu peux les rechercher sur Spotify, Deezer ou Soundeo."
        ].join("\n");
        window.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.clearTimeout(favoriteMailTimer);
        mailFavoritesButton.classList.add("is-mailed");
        favoriteMailTimer = window.setTimeout(function () {
          mailFavoritesButton.classList.remove("is-mailed");
        }, 3000);
        setStatus("Mail prepare", lines.length + " favori" + (lines.length > 1 ? "s" : "") + " dans le message.");
        setIdleTimer();
      }

      async function fetchMetadata() {
        window.clearTimeout(metadataTimer);
        if (!radio.metadataUrl || !radio.metadataParser) return;
        try {
          const response = await fetch(radio.metadataUrl, { cache: "no-store" });
          if (!response.ok) throw new Error("metadata");
          const data = await response.json();
          const parsed = radio.metadataParser(data);
          trackTitle.textContent = parsed.title || parsed.show || "En direct";
          artist.textContent = parsed.artist || parsed.show || radio.name;
          updateTrackHistory(parsed.history || []);
          updateCurrentFavoriteState();
          if (parsed.officialUrl) {
            radio.officialUrl = parsed.officialUrl;
          }
        } catch (error) {
          trackTitle.textContent = "En direct";
          artist.textContent = radio.name;
          updateCurrentFavoriteState();
        } finally {
          metadataTimer = window.setTimeout(fetchMetadata, 30000);
        }
      }

      function updateMediaSession() {
        if (!("mediaSession" in navigator)) return;
        navigator.mediaSession.metadata = new MediaMetadata({
          title: trackTitle.textContent || radio.name,
          artist: artist.textContent || "En direct",
          album: radio.name,
          artwork: [
            { src: radio.logoUrl, sizes: "96x96", type: "image/png" },
            { src: radio.logoUrl, sizes: "192x192", type: "image/png" }
          ]
        });
        navigator.mediaSession.setActionHandler("play", playRadio);
        navigator.mediaSession.setActionHandler("pause", pauseRadio);
      }

      function initPersistentNavigation() {
        if (!RADIO_WIDGET_CONFIG.persistNavigation) return;

        document.addEventListener("click", function (event) {
          const link = event.target.closest("a[href]");
          if (!link || link.closest(RADIO_WIDGET_CONFIG.persistExcludeSelector || "")) return;
          if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          if (link.target && link.target !== "_self") return;
          if (link.hasAttribute("download")) return;

          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin) return;
          if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

          const currentRoot = document.querySelector(RADIO_WIDGET_CONFIG.persistRootSelector);
          if (!currentRoot) return;

          event.preventDefault();
          navigatePersistently(url.href, true);
        });

        window.addEventListener("popstate", function () {
          navigatePersistently(location.href, false);
        });
      }

      async function navigatePersistently(url, pushState) {
        const selector = RADIO_WIDGET_CONFIG.persistRootSelector;
        const currentRoot = document.querySelector(selector);
        if (!currentRoot) {
          location.href = url;
          return;
        }

        try {
          const response = await fetch(url, {
            headers: { "X-Requested-With": "RadioWidget" }
          });
          if (!response.ok) throw new Error("navigation");
          const html = await response.text();
          const nextDocument = new DOMParser().parseFromString(html, "text/html");
          const nextRoot = nextDocument.querySelector(selector);
          if (!nextRoot) throw new Error("missing-root");

          currentRoot.replaceWith(document.importNode(nextRoot, true));
          if (nextDocument.title) document.title = nextDocument.title;
          if (pushState) history.pushState({ radioWidget: true }, "", url);
          window.scrollTo(0, 0);
          document.dispatchEvent(new CustomEvent("radio-widget:navigation", {
            detail: { url: url }
          }));
        } catch (error) {
          location.href = url;
        }
      }

      muteButton.addEventListener("click", playRadio);
      playButton.addEventListener("click", togglePlay);
      orbitPlayButton.addEventListener("click", togglePlay);
      volumeButton.addEventListener("click", toggleExtendedVolume);
      historyButton.addEventListener("click", toggleHistory);
      copyButton.addEventListener("click", copyCurrentTitle);
      orbitCopyButton.addEventListener("click", copyCurrentTitle);
      favoriteCurrentButtons.forEach(function (button) {
        button.addEventListener("click", toggleCurrentFavorite);
      });
      copyFavoritesButton.addEventListener("click", copyFavoriteTextList);
      mailFavoritesButton.addEventListener("click", mailFavoriteTextList);
      historyList.addEventListener("click", function (event) {
        const soundeoTarget = event.target.closest("[data-history-soundeo]");
        const favoriteTarget = event.target.closest("[data-history-favorite]");
        if (soundeoTarget) {
          openSoundeoForTrack(trackHistory[Number(soundeoTarget.dataset.historySoundeo)]);
          return;
        }
        if (favoriteTarget) {
          toggleFavoriteEntry(trackHistory[Number(favoriteTarget.dataset.historyFavorite)]);
        }
      });
      orbitVolumeButton.addEventListener("click", toggleOrbitVolume);
      volumeRanges.forEach(function (range) {
        range.addEventListener("input", function (event) {
          setVolume(event.target.value);
        });
      });
      tvButton.addEventListener("click", toggleTvPanel);
      tvRefreshButton.addEventListener("click", refreshTvPlayer);
      tvOpenButton.addEventListener("click", openTvPlayer);
      eyeButton.addEventListener("click", function () {
        root.classList.contains("is-hidden") ? reveal() : hidePanel();
      });
      orbitEyeButtons.forEach(function (button) {
        button.addEventListener("click", reveal);
      });
      document.addEventListener("pointerdown", function (event) {
        if (!orbit.contains(event.target)) {
          orbit.classList.remove("is-volume-open");
        }
        if (!volumeControl.contains(event.target)) {
          volumeControl.classList.remove("is-volume-open");
        }
        if (!root.contains(event.target)) {
          root.classList.remove("is-history-open", "is-tv-open");
        }
      });
      root.addEventListener("pointermove", setIdleTimer);
      root.addEventListener("pointerdown", setIdleTimer);
      root.addEventListener("focusin", setIdleTimer);
      initPersistentNavigation();
      updateCurrentFavoriteState();

      audio.addEventListener("playing", function () { setPlayingState(true); });
      audio.addEventListener("pause", function () { setPlayingState(false); });
      audio.addEventListener("error", function () {
        streamIndex += 1;
        const streams = [radio.streamUrl].concat(radio.fallbackStreams || []);
        if (streamIndex < streams.length) {
          configureAudioSource();
          audio.play().catch(function () {
            setStatus("Flux indisponible", "Le flux secondaire n'a pas pu demarrer.", true);
          });
        } else {
          setPlayingState(false);
          setStatus("Flux indisponible", "Reessaie dans un instant ou ouvre le lien officiel.", true);
        }
      });

      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && hasStarted) fetchMetadata();
      });
    }());
