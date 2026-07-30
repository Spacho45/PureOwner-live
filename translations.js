(function () {
  var STORAGE_KEY = "pureowner-language";
  var LANG_LABELS = { fr: "FR", en: "EN", es: "ES", de: "DE", it: "IT", pt: "PT" };
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "content"];
  var applying = false;
  var observer;

  function detectDeviceLanguage() {
    var supported = Object.keys(LANG_LABELS);
    var candidates = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "fr"]);
    for (var i = 0; i < candidates.length; i++) {
      var code = String(candidates[i] || "").slice(0, 2).toLowerCase();
      if (supported.indexOf(code) !== -1) return code;
    }
    return "fr";
  }

  var T = {
    "Découvrir": { en: "Discover", es: "Descubrir", de: "Entdecken", it: "Scoprire", pt: "Descobrir" },
    "Rareté": { en: "Scarcity", es: "Rareza", de: "Knappheit", it: "Rarità", pt: "Raridade" },
    "Apprendre": { en: "Learn", es: "Aprender", de: "Lernen", it: "Imparare", pt: "Aprender" },
    "Trouver mon nom": { en: "Find my name", es: "Encontrar mi nombre", de: "Meinen Namen finden", it: "Trova il mio nome", pt: "Encontrar meu nome" },
    "Trouver mon identité": { en: "Find my identity", es: "Encontrar mi identidad", de: "Meine Identität finden", it: "Trova la mia identità", pt: "Encontrar minha identidade" },
    "Le plus grand transfert de propriété numérique de l'histoire.": {
      en: "The greatest transfer of digital ownership in history.",
      es: "La mayor transferencia de propiedad digital de la historia.",
      de: "Der größte Transfer digitalen Eigentums der Geschichte.",
      it: "Il più grande trasferimento di proprietà digitale della storia.",
      pt: "A maior transferência de propriedade digital da história."
    },
    "Pendant plus de 30 ans, nous avons construit Internet sur des plateformes appartenant aux autres. Le Web3 introduit une nouvelle norme : posséder enfin son identité numérique.": {
      en: "For more than 30 years, we built the Internet on platforms owned by others. Web3 introduces a new norm: finally owning your digital identity.",
      es: "Durante más de 30 años, construimos Internet sobre plataformas que pertenecen a otros. Web3 introduce una nueva norma: por fin poseer tu identidad digital.",
      de: "Mehr als 30 Jahre lang haben wir das Internet auf Plattformen aufgebaut, die anderen gehören. Web3 führt eine neue Norm ein: die eigene digitale Identität endlich zu besitzen.",
      it: "Per oltre 30 anni abbiamo costruito Internet su piattaforme di altri. Il Web3 introduce una nuova norma: possedere finalmente la propria identità digitale.",
      pt: "Por mais de 30 anos, construímos a Internet em plataformas pertencentes a outros. O Web3 introduz uma nova norma: finalmente possuir sua identidade digital."
    },
    "Pendant plus de trente ans, Internet s'est construit autour de plateformes qui hébergent nos comptes, nos contenus et nos données. Aujourd'hui, une nouvelle approche permet à chacun de posséder directement certains actifs numériques, dont son identité.": {
      en: "For more than thirty years, the Internet was built around platforms that host our accounts, our content and our data. Today, a new approach lets everyone directly own certain digital assets, including their identity.",
      es: "Durante más de treinta años, Internet se construyó alrededor de plataformas que alojan nuestras cuentas, contenidos y datos. Hoy, un nuevo enfoque permite a cada persona poseer directamente ciertos activos digitales, incluida su identidad.",
      de: "Mehr als dreißig Jahre lang wurde das Internet um Plattformen herum aufgebaut, die unsere Konten, Inhalte und Daten hosten. Heute ermöglicht ein neuer Ansatz, bestimmte digitale Assets direkt zu besitzen, einschließlich der eigenen Identität.",
      it: "Per oltre trent'anni Internet si è costruito intorno a piattaforme che ospitano i nostri account, i nostri contenuti e i nostri dati. Oggi un nuovo approccio permette a ciascuno di possedere direttamente alcuni asset digitali, compresa la propria identità.",
      pt: "Por mais de trinta anos, a Internet foi construída em torno de plataformas que hospedam nossas contas, conteúdos e dados. Hoje, uma nova abordagem permite que cada pessoa possua diretamente certos ativos digitais, incluindo sua identidade."
    },
    "Comment en est-on arrivé là ?": { en: "How did we get here?", es: "¿Cómo llegamos hasta aquí?", de: "Wie sind wir hier angekommen?", it: "Come siamo arrivati fin qui?", pt: "Como chegamos até aqui?" },
    "Internet évolue par étapes. Chaque étape a déplacé un peu plus la frontière entre utiliser et posséder.": {
      en: "The Internet evolves in stages. Each stage has moved the line between using and owning.",
      es: "Internet evoluciona por etapas. Cada etapa desplazó un poco más la frontera entre usar y poseer.",
      de: "Das Internet entwickelt sich in Etappen. Jede Etappe hat die Grenze zwischen Nutzen und Besitzen verschoben.",
      it: "Internet evolve per tappe. Ogni tappa ha spostato il confine tra usare e possedere.",
      pt: "A Internet evolui por etapas. Cada etapa deslocou um pouco mais a fronteira entre usar e possuir."
    },
    "Lecture": { en: "Reading", es: "Lectura", de: "Lesen", it: "Lettura", pt: "Leitura" },
    "Internet sert d'abord à consulter des sites.": {
      en: "At first, the Internet is used to browse websites.",
      es: "Al principio, Internet sirve para consultar sitios.",
      de: "Zunächst dient das Internet dazu, Websites zu besuchen.",
      it: "All'inizio Internet serve a consultare siti.",
      pt: "No início, a Internet serve para consultar sites."
    },
    "Plateformes": { en: "Platforms", es: "Plataformas", de: "Plattformen", it: "Piattaforme", pt: "Plataformas" },
    "Comptes, publicité, mots de passe et centralisation structurent l'usage.": {
      en: "Accounts, advertising, passwords and centralization shape how people use it.",
      es: "Cuentas, publicidad, contraseñas y centralización estructuran el uso.",
      de: "Konten, Werbung, Passwörter und Zentralisierung prägen die Nutzung.",
      it: "Account, pubblicità, password e centralizzazione strutturano l'uso.",
      pt: "Contas, publicidade, senhas e centralização estruturam o uso."
    },
    "Bitcoin": { en: "Bitcoin", es: "Bitcoin", de: "Bitcoin", it: "Bitcoin", pt: "Bitcoin" },
    "La propriété numérique devient possible sans intermédiaire.": {
      en: "Digital ownership becomes possible without an intermediary.",
      es: "La propiedad digital se vuelve posible sin intermediario.",
      de: "Digitales Eigentum wird ohne Vermittler möglich.",
      it: "La proprietà digitale diventa possibile senza intermediari.",
      pt: "A propriedade digital se torna possível sem intermediário."
    },
    "Ethereum": { en: "Ethereum", es: "Ethereum", de: "Ethereum", it: "Ethereum", pt: "Ethereum" },
    "Les actifs deviennent programmables.": {
      en: "Assets become programmable.",
      es: "Los activos se vuelven programables.",
      de: "Assets werden programmierbar.",
      it: "Gli asset diventano programmabili.",
      pt: "Os ativos se tornam programáveis."
    },
    "NFT": { en: "NFT", es: "NFT", de: "NFT", it: "NFT", pt: "NFT" },
    "Un objet numérique peut être unique et certifié.": {
      en: "A digital object can be unique and certified.",
      es: "Un objeto digital puede ser único y certificado.",
      de: "Ein digitales Objekt kann einzigartig und zertifiziert sein.",
      it: "Un oggetto digitale può essere unico e certificato.",
      pt: "Um objeto digital pode ser único e certificado."
    },
    "Depuis 2021": { en: "Since 2021", es: "Desde 2021", de: "Seit 2021", it: "Dal 2021", pt: "Desde 2021" },
    "Domaines Web3": { en: "Web3 domains", es: "Dominios Web3", de: "Web3-Domains", it: "Domini Web3", pt: "Domínios Web3" },
    "Nom, adresse, wallet, connexion et site deviennent une identité.": {
      en: "Name, address, wallet, login and site become an identity.",
      es: "Nombre, dirección, wallet, conexión y sitio se convierten en una identidad.",
      de: "Name, Adresse, Wallet, Login und Website werden zu einer Identität.",
      it: "Nome, indirizzo, wallet, login e sito diventano un'identità.",
      pt: "Nome, endereço, wallet, login e site se tornam uma identidade."
    },
    "Aujourd'hui": { en: "Today", es: "Hoy", de: "Heute", it: "Oggi", pt: "Hoje" },
    "La transition devient simple, compréhensible et accompagnée.": {
      en: "The transition becomes simple, understandable and guided.",
      es: "La transición se vuelve simple, comprensible y acompañada.",
      de: "Der Übergang wird einfach, verständlich und begleitet.",
      it: "La transizione diventa semplice, comprensibile e accompagnata.",
      pt: "A transição se torna simples, compreensível e acompanhada."
    },
    "Trouver son identité.": { en: "Find your identity.", es: "Encontrar tu identidad.", de: "Die eigene Identität finden.", it: "Trovare la propria identità.", pt: "Encontrar sua identidade." },
    "Les Trois Torrents.": { en: "The Three Torrents.", es: "Los Tres Torrentes.", de: "Die drei Ströme.", it: "I Tre Torrenti.", pt: "Os Três Torrentes." },
    "Bitcoin, les noms de domaine et les NFT ont longtemps avancé séparément. Aujourd'hui, leurs idées se rejoignent.": {
      en: "Bitcoin, domain names and NFTs long moved separately. Today, their ideas are converging.",
      es: "Bitcoin, los nombres de dominio y los NFT avanzaron durante mucho tiempo por separado. Hoy, sus ideas convergen.",
      de: "Bitcoin, Domainnamen und NFTs entwickelten sich lange getrennt. Heute laufen ihre Ideen zusammen.",
      it: "Bitcoin, nomi di dominio e NFT hanno avanzato a lungo separatamente. Oggi le loro idee convergono.",
      pt: "Bitcoin, nomes de domínio e NFTs avançaram por muito tempo separadamente. Hoje, suas ideias convergem."
    },
    "Internet des plateformes": { en: "Internet of platforms", es: "Internet de plataformas", de: "Internet der Plattformen", it: "Internet delle piattaforme", pt: "Internet das plataformas" },
    "La révolution Bitcoin": { en: "The Bitcoin revolution", es: "La revolución Bitcoin", de: "Die Bitcoin-Revolution", it: "La rivoluzione Bitcoin", pt: "A revolução Bitcoin" },
    "Les domaines Web3": { en: "Web3 domains", es: "Los dominios Web3", de: "Web3-Domains", it: "I domini Web3", pt: "Domínios Web3" },
    "Qu'est-ce que le Web3 change vraiment ?": { en: "What does Web3 really change?", es: "¿Qué cambia realmente Web3?", de: "Was verändert Web3 wirklich?", it: "Cosa cambia davvero il Web3?", pt: "O que o Web3 realmente muda?" },
    "Pas besoin de commencer par la blockchain. Le Web3 devient concret quand il sert à quelque chose.": {
      en: "No need to start with blockchain. Web3 becomes concrete when it is useful.",
      es: "No hace falta empezar por la blockchain. Web3 se vuelve concreto cuando sirve para algo.",
      de: "Man muss nicht mit Blockchain beginnen. Web3 wird konkret, wenn es nützlich ist.",
      it: "Non serve iniziare dalla blockchain. Il Web3 diventa concreto quando serve a qualcosa.",
      pt: "Não é preciso começar pela blockchain. O Web3 fica concreto quando serve para algo."
    },
    "On vend l'usage. Pas la technologie.": { en: "Sell the use. Not the technology.", es: "Vender el uso. No la tecnología.", de: "Den Nutzen verkaufen. Nicht die Technologie.", it: "Vendere l'uso. Non la tecnologia.", pt: "Vender o uso. Não a tecnologia." },
    "Un nom n'existe qu'une seule fois. Une fois enregistré, personne ne pourra recréer exactement le même.": {
      en: "A name exists only once. Once registered, nobody can recreate exactly the same one.",
      es: "Un nombre existe una sola vez. Una vez registrado, nadie podrá recrear exactamente el mismo.",
      de: "Ein Name existiert nur einmal. Sobald er registriert ist, kann niemand exakt denselben neu erstellen.",
      it: "Un nome esiste una sola volta. Una volta registrato, nessuno potrà ricreare esattamente lo stesso.",
      pt: "Um nome existe apenas uma vez. Depois de registrado, ninguém poderá recriar exatamente o mesmo."
    },
    "Trouvez votre identité.": { en: "Find your identity.", es: "Encuentra tu identidad.", de: "Finden Sie Ihre Identität.", it: "Trova la tua identità.", pt: "Encontre sua identidade." },
    "PureOwner devient une plateforme.": { en: "PureOwner becomes a platform.", es: "PureOwner se convierte en una plataforma.", de: "PureOwner wird zur Plattform.", it: "PureOwner diventa una piattaforma.", pt: "PureOwner se torna uma plataforma." },
    "Centre d'apprentissage.": { en: "Learning center.", es: "Centro de aprendizaje.", de: "Lernzentrum.", it: "Centro di apprendimento.", pt: "Centro de aprendizagem." },
    "Nous vous accompagnons.": { en: "We guide you.", es: "Le acompañamos.", de: "Wir begleiten Sie.", it: "Ti accompagniamo.", pt: "Nós acompanhamos você." },
    "L'histoire devient plus simple quand on la raconte dans l'ordre.": {
      en: "The story becomes simpler when told in order.",
      es: "La historia se vuelve más simple cuando se cuenta en orden.",
      de: "Die Geschichte wird einfacher, wenn man sie der Reihe nach erzählt.",
      it: "La storia diventa più semplice quando la si racconta in ordine.",
      pt: "A história fica mais simples quando é contada em ordem."
    },
    "Demain, chacun possédera aussi son identité numérique.": {
      en: "Tomorrow, everyone will also own their digital identity.",
      es: "Mañana, cada persona también poseerá su identidad digital.",
      de: "Morgen wird jeder auch seine digitale Identität besitzen.",
      it: "Domani ognuno possiederà anche la propria identità digitale.",
      pt: "Amanhã, todos também possuirão sua identidade digital."
    },
    "Imaginez huit milliards de personnes, chacune libre de créer plusieurs identités selon ses usages.": {
      en: "Imagine eight billion people, each free to create several identities for different uses.",
      es: "Imagine ocho mil millones de personas, cada una libre de crear varias identidades según sus usos.",
      de: "Stellen Sie sich acht Milliarden Menschen vor, die jeweils mehrere Identitäten für unterschiedliche Zwecke schaffen können.",
      it: "Immaginate otto miliardi di persone, ognuna libera di creare più identità in base ai propri usi.",
      pt: "Imagine oito mil milhões de pessoas, cada uma livre para criar várias identidades conforme os seus usos."
    },
    "Imaginez": { en: "Imagine", es: "Imagine", de: "Stellen Sie sich vor", it: "Immaginate", pt: "Imagine" },
    "huit milliards de personnes": { en: "eight billion people", es: "ocho mil millones de personas", de: "acht Milliarden Menschen", it: "otto miliardi di persone", pt: "oito mil milhões de pessoas" },
    ", chacune libre de créer plusieurs identités selon ses usages.": {
      en: ", each free to create several identities for different uses.",
      es: ", cada una libre de crear varias identidades según sus usos.",
      de: ", die jeweils mehrere Identitäten für unterschiedliche Zwecke schaffen können.",
      it: ", ognuna libera di creare più identità in base ai propri usi.",
      pt: ", cada uma livre para criar várias identidades conforme os seus usos."
    },
    "Visible": { en: "Visible", es: "Visible", de: "Sichtbar", it: "Visibile", pt: "Visível" },
    "Personnel": { en: "Personal", es: "Personal", de: "Persönlich", it: "Personale", pt: "Pessoal" },
    "Confidentiel": { en: "Confidential", es: "Confidencial", de: "Vertraulich", it: "Riservato", pt: "Confidencial" },
    "Professionnel": { en: "Professional", es: "Profesional", de: "Beruflich", it: "Professionale", pt: "Profissional" },
    "Identité active": { en: "Active identity", es: "Identidad activa", de: "Aktive Identität", it: "Identità attiva", pt: "Identidade ativa" },
    "Une identité publique": { en: "A public identity", es: "Una identidad pública", de: "Eine öffentliche Identität", it: "Un'identità pubblica", pt: "Uma identidade pública" },
    "Une identité privée": { en: "A private identity", es: "Una identidad privada", de: "Eine private Identität", it: "Un'identità privata", pt: "Uma identidade privada" },
    "Une identité de santé": { en: "A health identity", es: "Una identidad sanitaria", de: "Eine Gesundheitsidentität", it: "Un'identità sanitaria", pt: "Uma identidade de saúde" },
    "Une identité comptable": { en: "An accounting identity", es: "Una identidad contable", de: "Eine Buchhaltungsidentität", it: "Un'identità contabile", pt: "Uma identidade contabilística" },
    "Chaque identité pourrait disposer de sa propre carte et de son QR code. Sur votre téléphone, vous afficheriez simplement celle qui correspond à la situation.": {
      en: "Each identity could have its own card and QR code. On your phone, you would simply display the one suited to the situation.",
      es: "Cada identidad podría tener su propia tarjeta y código QR. En su teléfono, solo mostraría la que corresponda a la situación.",
      de: "Jede Identität könnte über eine eigene Karte und einen QR-Code verfügen. Auf Ihrem Telefon würden Sie einfach die zur Situation passende anzeigen.",
      it: "Ogni identità potrebbe avere la propria carta e il proprio codice QR. Sul telefono basterebbe mostrare quella adatta alla situazione.",
      pt: "Cada identidade poderia ter o seu próprio cartão e código QR. No telefone, bastaria mostrar a que corresponde à situação."
    },
    "Le QR code ouvrirait uniquement l'accès autorisé : vos données sensibles ne seraient pas inscrites directement dedans.": {
      en: "The QR code would only open the authorized access: your sensitive data would not be stored directly in it.",
      es: "El código QR solo abriría el acceso autorizado: sus datos sensibles no se almacenarían directamente en él.",
      de: "Der QR-Code würde nur den autorisierten Zugang öffnen: Ihre sensiblen Daten wären nicht direkt darin gespeichert.",
      it: "Il codice QR aprirebbe solo l'accesso autorizzato: i dati sensibili non sarebbero memorizzati direttamente al suo interno.",
      pt: "O código QR abriria apenas o acesso autorizado: os seus dados sensíveis não seriam guardados diretamente nele."
    },
    "Vous déciderez quelle facette de votre identité présenter, à qui et quand vous le souhaiterez.": {
      en: "You will decide which facet of your identity to present, to whom and whenever you choose.",
      es: "Usted decidirá qué faceta de su identidad presentar, a quién y cuándo lo desee.",
      de: "Sie entscheiden, welche Facette Ihrer Identität Sie wem und wann zeigen möchten.",
      it: "Sarete voi a decidere quale aspetto della vostra identità mostrare, a chi e quando vorrete.",
      pt: "Decidirá que faceta da sua identidade apresentar, a quem e quando quiser."
    },
    "Propriété": { en: "Ownership", es: "Propiedad", de: "Eigentum", it: "Proprietà", pt: "Propriedade" },
    "Web2": { en: "Web2", es: "Web2", de: "Web2", it: "Web2", pt: "Web2" },
    "Noms": { en: "Names", es: "Nombres", de: "Namen", it: "Nomi", pt: "Nomes" },
    "Réserver": { en: "Reserve", es: "Reservar", de: "Reservieren", it: "Prenota", pt: "Reservar" },
    "Et si votre nom sur Internet vous appartenait vraiment ?": {
      en: "What if your name on the Internet truly belonged to you?",
      es: "¿Y si tu nombre en Internet te perteneciera de verdad?",
      de: "Was wäre, wenn Ihr Name im Internet wirklich Ihnen gehören würde?",
      it: "E se il tuo nome su Internet ti appartenesse davvero?",
      pt: "E se o seu nome na Internet realmente pertencesse a você?"
    },
    "Comme une maison, une marque ou un terrain, une identité numérique peut se posséder, se transmettre et se revendre.": {
      en: "Like a house, a brand or a plot of land, a digital identity can be owned, passed on and resold.",
      es: "Como una casa, una marca o un terreno, una identidad digital puede poseerse, transmitirse y revenderse.",
      de: "Wie ein Haus, eine Marke oder ein Grundstück kann eine digitale Identität besessen, weitergegeben und wiederverkauft werden.",
      it: "Come una casa, un marchio o un terreno, un'identità digitale può essere posseduta, trasmessa e rivenduta.",
      pt: "Como uma casa, uma marca ou um terreno, uma identidade digital pode ser possuída, transmitida e revendida."
    },
    "Un nom. Une adresse. Un actif.": { en: "One name. One address. One asset.", es: "Un nombre. Una dirección. Un activo.", de: "Ein Name. Eine Adresse. Ein Asset.", it: "Un nome. Un indirizzo. Un asset.", pt: "Um nome. Um endereço. Um ativo." },
    "Chercher mon nom": { en: "Search my name", es: "Buscar mi nombre", de: "Meinen Namen suchen", it: "Cerca il mio nome", pt: "Buscar meu nome" },
    "Comprendre en 30 secondes": { en: "Understand in 30 seconds", es: "Entender en 30 segundos", de: "In 30 Sekunden verstehen", it: "Capire in 30 secondi", pt: "Entender em 30 segundos" },
    "Identité numérique": { en: "Digital identity", es: "Identidad digital", de: "Digitale Identität", it: "Identità digitale", pt: "Identidade digital" },
    "votre.nom.brave": { en: "your.name.brave", es: "tu.nombre.brave", de: "ihr.name.brave", it: "tuo.nome.brave", pt: "seu.nome.brave" },
    "posséder plutôt que louer": { en: "own instead of rent", es: "poseer en lugar de alquilar", de: "besitzen statt mieten", it: "possedere invece di affittare", pt: "possuir em vez de alugar" },
    "Conserver": { en: "Keep", es: "Conservar", de: "Behalten", it: "Conservare", pt: "Guardar" },
    "Transmettre": { en: "Pass on", es: "Transmitir", de: "Weitergeben", it: "Trasmettere", pt: "Transmitir" },
    "Revendre": { en: "Resell", es: "Revender", de: "Weiterverkaufen", it: "Rivendere", pt: "Revender" },
    "Dans la vraie vie, tout le monde comprend la propriété.": {
      en: "In real life, everyone understands ownership.",
      es: "En la vida real, todo el mundo entiende la propiedad.",
      de: "Im echten Leben versteht jeder Eigentum.",
      it: "Nella vita reale, tutti capiscono la proprietà.",
      pt: "Na vida real, todos entendem a propriedade."
    },
    "Une maison, une voiture, une marque, un terrain, une entreprise : chacun comprend l'idée de posséder.": {
      en: "A house, a car, a brand, land, a company: everyone understands the idea of owning.",
      es: "Una casa, un coche, una marca, un terreno, una empresa: todos entienden la idea de poseer.",
      de: "Ein Haus, ein Auto, eine Marke, ein Grundstück, ein Unternehmen: Jeder versteht die Idee des Besitzens.",
      it: "Una casa, un'auto, un marchio, un terreno, un'impresa: tutti capiscono l'idea di possedere.",
      pt: "Uma casa, um carro, uma marca, um terreno, uma empresa: todos entendem a ideia de possuir."
    },
    "Une maison": { en: "A house", es: "Una casa", de: "Ein Haus", it: "Una casa", pt: "Uma casa" },
    "Une voiture": { en: "A car", es: "Un coche", de: "Ein Auto", it: "Un'auto", pt: "Um carro" },
    "Une marque": { en: "A brand", es: "Una marca", de: "Eine Marke", it: "Un marchio", pt: "Uma marca" },
    "Un terrain": { en: "Land", es: "Un terreno", de: "Ein Grundstück", it: "Un terreno", pt: "Um terreno" },
    "Une entreprise": { en: "A company", es: "Una empresa", de: "Ein Unternehmen", it: "Un'impresa", pt: "Uma empresa" },
    "Internet est presque la seule exception.": { en: "The Internet is almost the only exception.", es: "Internet es casi la única excepción.", de: "Das Internet ist fast die einzige Ausnahme.", it: "Internet è quasi l'unica eccezione.", pt: "A Internet é quase a única exceção." },
    "Le Web2 nous a quand même fait accepter de drôles d'habitudes.": {
      en: "Web2 still made us accept some strange habits.",
      es: "Web2 nos hizo aceptar hábitos bastante extraños.",
      de: "Web2 hat uns trotzdem einige seltsame Gewohnheiten akzeptieren lassen.",
      it: "Il Web2 ci ha comunque fatto accettare abitudini curiose.",
      pt: "O Web2 nos fez aceitar hábitos bem estranhos."
    },
    "Le lecteur sourit, puis réalise que c'est vrai.": { en: "You smile, then realize it is true.", es: "Sonríes y luego te das cuenta de que es verdad.", de: "Man lächelt und merkt dann, dass es stimmt.", it: "Sorridi, poi capisci che è vero.", pt: "Você sorri e depois percebe que é verdade." },
    "Louer son nom de domaine tous les ans.": { en: "Rent your domain name every year.", es: "Alquilar tu dominio cada año.", de: "Den eigenen Domainnamen jedes Jahr mieten.", it: "Affittare il proprio dominio ogni anno.", pt: "Alugar seu domínio todos os anos." },
    "Créer un compte différent pour chaque service.": { en: "Create a different account for every service.", es: "Crear una cuenta distinta para cada servicio.", de: "Für jeden Dienst ein anderes Konto erstellen.", it: "Creare un account diverso per ogni servizio.", pt: "Criar uma conta diferente para cada serviço." },
    "Confier ses données à des plateformes gratuites... qui ne vivent évidemment pas d'amour et d'eau fraîche.": {
      en: "Hand your data to free platforms... which obviously do not live on love and fresh water.",
      es: "Confiar tus datos a plataformas gratuitas... que obviamente no viven de amor y agua fresca.",
      de: "Seine Daten kostenlosen Plattformen anvertrauen... die natürlich nicht von Liebe und frischem Wasser leben.",
      it: "Affidare i propri dati a piattaforme gratuite... che ovviamente non vivono d'amore e acqua fresca.",
      pt: "Confiar seus dados a plataformas gratuitas... que obviamente não vivem de amor e água fresca."
    },
    "Mémoriser 47 mots de passe.": { en: "Memorize 47 passwords.", es: "Memorizar 47 contraseñas.", de: "47 Passwörter merken.", it: "Memorizzare 47 password.", pt: "Memorizar 47 senhas." },
    "Perdre un compte parce qu'un robot a mal dormi.": { en: "Lose an account because an algorithm had a bad night.", es: "Perder una cuenta porque un robot durmió mal.", de: "Ein Konto verlieren, weil ein Algorithmus schlecht geschlafen hat.", it: "Perdere un account perché un robot ha dormito male.", pt: "Perder uma conta porque um robô dormiu mal." },
    "Lire des CGU que personne n'a jamais vraiment lues.": { en: "Read terms nobody has ever truly read.", es: "Leer condiciones que nadie ha leído de verdad.", de: "AGB lesen, die nie wirklich jemand gelesen hat.", it: "Leggere condizioni che nessuno ha mai letto davvero.", pt: "Ler termos que ninguém realmente leu." },
    "Voir l'étape suivante": { en: "See the next step", es: "Ver el siguiente paso", de: "Den nächsten Schritt sehen", it: "Vedere il passo successivo", pt: "Ver o próximo passo" },
    "Le Web3 ne complique pas Internet. Il remet simplement la propriété au centre.": {
      en: "Web3 does not make the Internet more complicated. It simply puts ownership back at the center.",
      es: "Web3 no complica Internet. Simplemente vuelve a poner la propiedad en el centro.",
      de: "Web3 macht das Internet nicht komplizierter. Es stellt Eigentum einfach wieder in den Mittelpunkt.",
      it: "Il Web3 non complica Internet. Rimette semplicemente la proprietà al centro.",
      pt: "O Web3 não complica a Internet. Ele simplesmente recoloca a propriedade no centro."
    },
    "Votre nom devient votre actif. Votre identité devient portable. Votre présence numérique ne dépend plus d'une seule plateforme.": {
      en: "Your name becomes your asset. Your identity becomes portable. Your digital presence no longer depends on a single platform.",
      es: "Tu nombre se convierte en tu activo. Tu identidad se vuelve portable. Tu presencia digital ya no depende de una sola plataforma.",
      de: "Ihr Name wird zu Ihrem Asset. Ihre Identität wird portabel. Ihre digitale Präsenz hängt nicht mehr von einer einzigen Plattform ab.",
      it: "Il tuo nome diventa il tuo asset. La tua identità diventa portabile. La tua presenza digitale non dipende più da una sola piattaforma.",
      pt: "Seu nome se torna seu ativo. Sua identidade se torna portátil. Sua presença digital deixa de depender de uma única plataforma."
    },
    "Ce n'est pas une révolution à comprendre. C'est un standard à adopter.": { en: "It is not a revolution to understand. It is a standard to adopt.", es: "No es una revolución que entender. Es un estándar que adoptar.", de: "Es ist keine Revolution, die man verstehen muss. Es ist ein Standard, den man übernimmt.", it: "Non è una rivoluzione da capire. È uno standard da adottare.", pt: "Não é uma revolução para entender. É um padrão para adotar." },
    "Je loue ma place": { en: "I rent my place", es: "Alquilo mi lugar", de: "Ich miete meinen Platz", it: "Affitto il mio posto", pt: "Eu alugo meu lugar" },
    "Je crée un compte.": { en: "I create an account.", es: "Creo una cuenta.", de: "Ich erstelle ein Konto.", it: "Creo un account.", pt: "Eu crio uma conta." },
    "Je donne mes données.": { en: "I give my data.", es: "Entrego mis datos.", de: "Ich gebe meine Daten ab.", it: "Do i miei dati.", pt: "Eu entrego meus dados." },
    "Je dépends d'une plateforme.": { en: "I depend on a platform.", es: "Dependo de una plataforma.", de: "Ich hänge von einer Plattform ab.", it: "Dipendo da una piattaforma.", pt: "Eu dependo de uma plataforma." },
    "Je recommence ailleurs.": { en: "I start again somewhere else.", es: "Vuelvo a empezar en otro lugar.", de: "Ich fange woanders wieder an.", it: "Ricomincio altrove.", pt: "Eu recomeço em outro lugar." },
    "Je possède mon nom": { en: "I own my name", es: "Poseo mi nombre", de: "Ich besitze meinen Namen", it: "Possiedo il mio nome", pt: "Eu possuo meu nome" },
    "Je possède mon nom.": { en: "I own my name.", es: "Poseo mi nombre.", de: "Ich besitze meinen Namen.", it: "Possiedo il mio nome.", pt: "Eu possuo meu nome." },
    "Je contrôle mes accès.": { en: "I control my access.", es: "Controlo mis accesos.", de: "Ich kontrolliere meine Zugänge.", it: "Controllo i miei accessi.", pt: "Eu controlo meus acessos." },
    "Je l'utilise partout.": { en: "I use it everywhere.", es: "Lo uso en todas partes.", de: "Ich nutze ihn überall.", it: "Lo uso ovunque.", pt: "Eu uso em todos os lugares." },
    "Je peux le transmettre.": { en: "I can pass it on.", es: "Puedo transmitirlo.", de: "Ich kann ihn weitergeben.", it: "Posso trasmetterlo.", pt: "Eu posso transmiti-lo." },
    "Internet avait des comptes. Il aura des propriétaires.": { en: "The Internet had accounts. It will have owners.", es: "Internet tenía cuentas. Tendrá propietarios.", de: "Das Internet hatte Konten. Es wird Eigentümer haben.", it: "Internet aveva account. Avrà proprietari.", pt: "A Internet tinha contas. Terá proprietários." },
    "Un nom numérique fonctionne comme une adresse.": { en: "A digital name works like an address.", es: "Un nombre digital funciona como una dirección.", de: "Ein digitaler Name funktioniert wie eine Adresse.", it: "Un nome digitale funziona come un indirizzo.", pt: "Um nome digital funciona como um endereço." },
    "Il est unique. Il peut prendre de la valeur avec l'usage. Il peut être conservé, transmis ou vendu.": {
      en: "It is unique. It can gain value through use. It can be kept, passed on or sold.",
      es: "Es único. Puede ganar valor con el uso. Puede conservarse, transmitirse o venderse.",
      de: "Er ist einzigartig. Er kann durch Nutzung an Wert gewinnen. Er kann behalten, weitergegeben oder verkauft werden.",
      it: "È unico. Può acquisire valore con l'uso. Può essere conservato, trasmesso o venduto.",
      pt: "É único. Pode ganhar valor com o uso. Pode ser guardado, transmitido ou vendido."
    },
    "Il n'existe qu'un seul marie.brave, un seul studio.brave, un seul paris.brave.": { en: "There is only one marie.brave, one studio.brave, one paris.brave.", es: "Solo existe un marie.brave, un studio.brave, un paris.brave.", de: "Es gibt nur ein marie.brave, ein studio.brave, ein paris.brave.", it: "Esiste un solo marie.brave, un solo studio.brave, un solo paris.brave.", pt: "Existe apenas um marie.brave, um studio.brave, um paris.brave." },
    "Pourquoi regarder maintenant ?": { en: "Why look now?", es: "¿Por qué mirar ahora?", de: "Warum jetzt hinschauen?", it: "Perché guardare ora?", pt: "Por que olhar agora?" },
    "Parce qu'un nom unique ne se duplique pas.": { en: "Because a unique name cannot be duplicated.", es: "Porque un nombre único no se duplica.", de: "Weil ein einzigartiger Name nicht dupliziert wird.", it: "Perché un nome unico non si duplica.", pt: "Porque um nome único não se duplica." },
    "Parce que les meilleurs noms partent toujours en premier.": { en: "Because the best names always go first.", es: "Porque los mejores nombres siempre se van primero.", de: "Weil die besten Namen immer zuerst vergeben sind.", it: "Perché i nomi migliori vanno sempre via per primi.", pt: "Porque os melhores nomes sempre acabam primeiro." },
    "Parce qu'un standard paraît évident seulement après son adoption.": { en: "Because a standard only feels obvious after it is adopted.", es: "Porque un estándar parece evidente solo después de adoptarse.", de: "Weil ein Standard erst nach seiner Einführung offensichtlich wirkt.", it: "Perché uno standard sembra ovvio solo dopo la sua adozione.", pt: "Porque um padrão só parece óbvio depois de adotado." },
    "Commencez par ce qui vous ressemble.": { en: "Start with what feels like you.", es: "Empieza por lo que se parece a ti.", de: "Beginnen Sie mit dem, was zu Ihnen passt.", it: "Inizia da ciò che ti assomiglia.", pt: "Comece pelo que combina com você." },
    "Votre identité ne devrait pas expirer.": { en: "Your identity should not expire.", es: "Tu identidad no debería caducar.", de: "Ihre Identität sollte nicht ablaufen.", it: "La tua identità non dovrebbe scadere.", pt: "Sua identidade não deveria expirar." },
    "Votre prénom": { en: "Your first name", es: "Tu nombre", de: "Ihr Vorname", it: "Il tuo nome", pt: "Seu nome" },
    "Votre nom": { en: "Your last name", es: "Tu apellido", de: "Ihr Nachname", it: "Il tuo cognome", pt: "Seu sobrenome" },
    "Votre surnom": { en: "Your nickname", es: "Tu apodo", de: "Ihr Spitzname", it: "Il tuo soprannome", pt: "Seu apelido" },
    "Votre métier": { en: "Your profession", es: "Tu oficio", de: "Ihr Beruf", it: "La tua professione", pt: "Sua profissão" },
    "Votre société": { en: "Your company", es: "Tu empresa", de: "Ihr Unternehmen", it: "La tua società", pt: "Sua empresa" },
    "Votre ville": { en: "Your city", es: "Tu ciudad", de: "Ihre Stadt", it: "La tua città", pt: "Sua cidade" },
    "Votre passion": { en: "Your passion", es: "Tu pasión", de: "Ihre Leidenschaft", it: "La tua passione", pt: "Sua paixão" },
    "Un cadeau pour un proche": { en: "A gift for someone close", es: "Un regalo para alguien cercano", de: "Ein Geschenk für einen nahestehenden Menschen", it: "Un regalo per una persona cara", pt: "Um presente para alguém próximo" },
    "Disponible": { en: "Available", es: "Disponible", de: "Verfügbar", it: "Disponibile", pt: "Disponível" },
    "Déjà réservé": { en: "Already reserved", es: "Ya reservado", de: "Bereits reserviert", it: "Già prenotato", pt: "Já reservado" },
    "À surveiller": { en: "Watch", es: "Vigilar", de: "Beobachten", it: "Da monitorare", pt: "Monitorar" },
    "Un nom peut aussi devenir un actif.": { en: "A name can also become an asset.", es: "Un nombre también puede convertirse en un activo.", de: "Ein Name kann auch zu einem Asset werden.", it: "Un nome può anche diventare un asset.", pt: "Um nome também pode se tornar um ativo." },
    "Vous pouvez le garder, l'utiliser, l'offrir, le transmettre ou le proposer à la vente sur PureOwner.": {
      en: "You can keep it, use it, gift it, pass it on or list it for sale on PureOwner.",
      es: "Puedes conservarlo, usarlo, regalarlo, transmitirlo o proponerlo a la venta en PureOwner.",
      de: "Sie können ihn behalten, nutzen, verschenken, weitergeben oder auf PureOwner zum Verkauf anbieten.",
      it: "Puoi conservarlo, usarlo, regalarlo, trasmetterlo o proporlo in vendita su PureOwner.",
      pt: "Você pode guardar, usar, oferecer, transmitir ou colocar à venda na PureOwner."
    },
    "Voir les noms disponibles": { en: "See available names", es: "Ver nombres disponibles", de: "Verfügbare Namen ansehen", it: "Vedi i nomi disponibili", pt: "Ver nomes disponíveis" },
    "Proposer un nom à la vente": { en: "List a name for sale", es: "Proponer un nombre a la venta", de: "Einen Namen zum Verkauf anbieten", it: "Proporre un nome in vendita", pt: "Colocar um nome à venda" },
    "Chercher un nom": { en: "Search a name", es: "Buscar un nombre", de: "Einen Namen suchen", it: "Cerca un nome", pt: "Buscar um nome" },
    "Le Web2 nous a habitués à louer notre place. Le Web3 nous permet de l'acheter.": {
      en: "Web2 taught us to rent our place. Web3 lets us buy it.",
      es: "Web2 nos acostumbró a alquilar nuestro lugar. Web3 nos permite comprarlo.",
      de: "Web2 hat uns daran gewöhnt, unseren Platz zu mieten. Web3 erlaubt uns, ihn zu kaufen.",
      it: "Il Web2 ci ha abituati ad affittare il nostro posto. Il Web3 ci permette di comprarlo.",
      pt: "O Web2 nos acostumou a alugar nosso lugar. O Web3 nos permite comprá-lo."
    },
    "Demain, posséder son nom numérique semblera normal.": { en: "Tomorrow, owning your digital name will feel normal.", es: "Mañana, poseer tu nombre digital parecerá normal.", de: "Morgen wird es normal erscheinen, den eigenen digitalen Namen zu besitzen.", it: "Domani possedere il proprio nome digitale sembrerà normale.", pt: "Amanhã, possuir seu nome digital parecerá normal." },
    "Comme réserver un nom de domaine, protéger une marque ou acheter une adresse importante.": {
      en: "Like reserving a domain name, protecting a brand or buying an important address.",
      es: "Como reservar un dominio, proteger una marca o comprar una dirección importante.",
      de: "Wie einen Domainnamen reservieren, eine Marke schützen oder eine wichtige Adresse kaufen.",
      it: "Come prenotare un dominio, proteggere un marchio o acquistare un indirizzo importante.",
      pt: "Como reservar um domínio, proteger uma marca ou comprar um endereço importante."
    },
    "PureOwner vous aide à prendre place dans l'Internet des propriétaires.": {
      en: "PureOwner helps you take your place in the Internet of owners.",
      es: "PureOwner te ayuda a ocupar tu lugar en el Internet de los propietarios.",
      de: "PureOwner hilft Ihnen, Ihren Platz im Internet der Eigentümer einzunehmen.",
      it: "PureOwner ti aiuta a prendere posto nell'Internet dei proprietari.",
      pt: "A PureOwner ajuda você a ocupar seu lugar na Internet dos proprietários."
    },
    "Noms disponibles": { en: "Available names", es: "Nombres disponibles", de: "Verfügbare Namen", it: "Nomi disponibili", pt: "Nomes disponíveis" },
    "Comprendre": { en: "Understand", es: "Entender", de: "Verstehen", it: "Capire", pt: "Entender" },
    "L'évolution": { en: "Evolution", es: "La evolución", de: "Entwicklung", it: "L'evoluzione", pt: "A evolução" },
    "Web2 / Web3": { en: "Web2 / Web3", es: "Web2 / Web3", de: "Web2 / Web3", it: "Web2 / Web3", pt: "Web2 / Web3" },
    "Extensions": { en: "Extensions", es: "Extensiones", de: "Erweiterungen", it: "Estensioni", pt: "Extensões" },
    "Marketplace": { en: "Marketplace", es: "Marketplace", de: "Marketplace", it: "Marketplace", pt: "Marketplace" },
    "Réserver mon nom": { en: "Reserve my name", es: "Reservar mi nombre", de: "Meinen Namen reservieren", it: "Prenota il mio nome", pt: "Reservar meu nome" },
    "Réserver mon nom →": { en: "Reserve my name →", es: "Reservar mi nombre →", de: "Meinen Namen reservieren →", it: "Prenota il mio nome →", pt: "Reservar meu nome →" },
    "Comprendre pourquoi": { en: "Understand why", es: "Entender por qué", de: "Verstehen warum", it: "Capire perché", pt: "Entender por quê" },
    "Votre premier pas dans le Web3": { en: "Your first step into Web3", es: "Tu primer paso en Web3", de: "Ihr erster Schritt ins Web3", it: "Il tuo primo passo nel Web3", pt: "Seu primeiro passo no Web3" },
    "Trouvez le parfait": { en: "Find the perfect", es: "Encuentra el", de: "Finden Sie den perfekten", it: "Trova il perfetto", pt: "Encontre o" },
    "avant qu'il ne parte.": { en: "before it is gone.", es: "perfecto antes de que se vaya.", de: "bevor er weg ist.", it: "prima che sparisca.", pt: "perfeito antes que acabe." },
    "Combinaison de caractères donnant accès à du contenu digital. Il en impose donc un effet de rareté de part ses combinaisons elles-même limitées par leur longueur et le sens.": {
      en: "A character combination that gives access to digital content. Its length and meaning create scarcity because the combinations themselves are limited.",
      es: "Una combinación de caracteres que da acceso a contenido digital. Su longitud y sentido crean escasez porque las combinaciones son limitadas.",
      de: "Eine Zeichenkombination, die Zugang zu digitalen Inhalten gibt. Länge und Bedeutung erzeugen Knappheit, weil die Kombinationen begrenzt sind.",
      it: "Una combinazione di caratteri che dà accesso a contenuti digitali. Lunghezza e significato creano scarsità perché le combinazioni sono limitate.",
      pt: "Uma combinação de caracteres que dá acesso a conteúdo digital. Seu comprimento e significado criam escassez porque as combinações são limitadas."
    },
    "Identité souveraine · vous possédez, vous décidez, vous transmettez": {
      en: "Sovereign identity · you own, you decide, you pass it on",
      es: "Identidad soberana · posees, decides y transmites",
      de: "Souveräne Identität · Sie besitzen, entscheiden und übertragen",
      it: "Identità sovrana · possiedi, decidi, trasmetti",
      pt: "Identidade soberana · você possui, decide e transmite"
    },
    "Ce qui est en train de se passer": { en: "What is happening now", es: "Lo que está ocurriendo", de: "Was gerade passiert", it: "Cosa sta accadendo", pt: "O que está acontecendo" },
    "Nous vivons le plus grand": { en: "We are living through the greatest", es: "Estamos viviendo la mayor", de: "Wir erleben den größten", it: "Stiamo vivendo il più grande", pt: "Estamos vivendo a maior" },
    "transfert de propriété numérique": { en: "transfer of digital ownership", es: "transferencia de propiedad digital", de: "Transfer digitalen Eigentums", it: "trasferimento di proprietà digitale", pt: "transferência de propriedade digital" },
    "depuis la création d'Internet.": { en: "since the creation of the Internet.", es: "desde la creación de Internet.", de: "seit der Entstehung des Internets.", it: "dalla nascita di Internet.", pt: "desde a criação da Internet." },
    "Un système basé sur l'exploitation de ses utilisateurs n'avait un sens que pour sa conception sans quoi le web n'aurait aucune utilité. Il est maintenant venu me moment de le rendre utilisable pour ce pour quoi il. été crée : CONNECTER DES HUMAINS ET NON DES DONNES": {
      en: "A system based on exploiting its users only made sense by design; otherwise the web would have no usefulness. Now the time has come to make it usable for what it was created for: CONNECTING HUMANS, NOT DATA.",
      es: "Un sistema basado en explotar a sus usuarios solo tenía sentido por diseño; de lo contrario la web no tendría utilidad. Ahora ha llegado el momento de usarla para lo que fue creada: CONECTAR HUMANOS, NO DATOS.",
      de: "Ein System, das auf der Ausbeutung seiner Nutzer beruht, ergab nur durch sein Design Sinn; sonst hätte das Web keinen Nutzen. Jetzt ist es Zeit, es für seinen eigentlichen Zweck nutzbar zu machen: MENSCHEN VERBINDEN, NICHT DATEN.",
      it: "Un sistema basato sullo sfruttamento degli utenti aveva senso solo per come era stato progettato; altrimenti il web non avrebbe utilità. Ora è il momento di renderlo utile per ciò per cui è nato: CONNETTERE PERSONE, NON DATI.",
      pt: "Um sistema baseado na exploração dos usuários só fazia sentido pelo seu desenho; caso contrário a web não teria utilidade. Agora chegou a hora de torná-la útil para o que foi criada: CONECTAR HUMANOS, NÃO DADOS."
    },
    "Web 1": { en: "Web 1", es: "Web 1", de: "Web 1", it: "Web 1", pt: "Web 1" },
    "on consulte": { en: "we browse", es: "consultamos", de: "wir lesen", it: "si consulta", pt: "consultamos" },
    "Web 2": { en: "Web 2", es: "Web 2", de: "Web 2", it: "Web 2", pt: "Web 2" },
    "on utilise": { en: "we use", es: "usamos", de: "wir nutzen", it: "si usa", pt: "usamos" },
    "Web 3": { en: "Web 3", es: "Web 3", de: "Web 3", it: "Web 3", pt: "Web 3" },
    "on possède": { en: "we own", es: "poseemos", de: "wir besitzen", it: "si possiede", pt: "possuímos" },
    "transmettre": { en: "pass on", es: "transmitir", de: "weitergeben", it: "trasmettere", pt: "transmitir" },
    "Le contraste": { en: "The contrast", es: "El contraste", de: "Der Kontrast", it: "Il contrasto", pt: "O contraste" },
    "Le contraste fondamental": { en: "The fundamental contrast", es: "El contraste fundamental", de: "Der grundlegende Kontrast", it: "Il contrasto fondamentale", pt: "O contraste fundamental" },
    "Hier": { en: "Yesterday", es: "Ayer", de: "Gestern", it: "Ieri", pt: "Ontem" },
    "Aujourd'hui": { en: "Today", es: "Hoy", de: "Heute", it: "Oggi", pt: "Hoje" },
    "La différence réside entre le fait de mettre à dispotion des services dans le but de récupérer vos données et mettre à disposition les applications ne visant pas vos données au service de vos données": {
      en: "The difference lies between offering services in order to extract your data, and offering applications that do not target your data but serve your data.",
      es: "La diferencia está entre ofrecer servicios para recuperar tus datos y ofrecer aplicaciones que no buscan tus datos, sino que los ponen a tu servicio.",
      de: "Der Unterschied liegt zwischen Diensten, die Ihre Daten abschöpfen sollen, und Anwendungen, die nicht auf Ihre Daten zielen, sondern Ihren Daten dienen.",
      it: "La differenza sta tra mettere a disposizione servizi per recuperare i tuoi dati e offrire applicazioni che non prendono di mira i dati, ma li servono.",
      pt: "A diferença está entre oferecer serviços para capturar seus dados e oferecer aplicações que não miram seus dados, mas trabalham a favor deles."
    },
    "Le même besoin — posséder son nom — mais deux logiques radicalement opposées.": {
      en: "The same need, owning your name, but two radically opposed logics.",
      es: "La misma necesidad, poseer tu nombre, pero dos lógicas radicalmente opuestas.",
      de: "Dasselbe Bedürfnis, den eigenen Namen zu besitzen, aber zwei radikal gegensätzliche Logiken.",
      it: "Lo stesso bisogno, possedere il proprio nome, ma due logiche radicalmente opposte.",
      pt: "A mesma necessidade, possuir seu nome, mas duas lógicas radicalmente opostas."
    },
    "Le Web3, concrètement — vous": { en: "Web3, concretely: you", es: "Web3, concretamente: tú", de: "Web3 konkret: Sie", it: "Web3, concretamente: tu", pt: "Web3, na prática: você" },
    "possédez": { en: "own", es: "posees", de: "besitzen", it: "possiedi", pt: "possui" },
    "accédez": { en: "access", es: "accedes", de: "zugreifen", it: "accedi", pt: "acessa" },
    "interagissez": { en: "interact", es: "interactúas", de: "interagieren", it: "interagisci", pt: "interage" },
    "transmettez": { en: "pass on", es: "transmites", de: "weitergeben", it: "trasmetti", pt: "transmite" },
    "Hier · Web2": { en: "Before · Web2", es: "Antes · Web2", de: "Früher · Web2", it: "Prima · Web2", pt: "Antes · Web2" },
    "Aujourd'hui · Web3": { en: "Today · Web3", es: "Hoy · Web3", de: "Heute · Web3", it: "Oggi · Web3", pt: "Hoje · Web3" },
    "La location": { en: "Rental", es: "Alquiler", de: "Miete", it: "Affitto", pt: "Aluguel" },
    "La propriété": { en: "Ownership", es: "Propiedad", de: "Eigentum", it: "Proprietà", pt: "Propriedade" },
    "Vous utilisez un compte créé par une plateforme.": { en: "You use an account created by a platform.", es: "Usas una cuenta creada por una plataforma.", de: "Sie nutzen ein von einer Plattform erstelltes Konto.", it: "Usi un account creato da una piattaforma.", pt: "Você usa uma conta criada por uma plataforma." },
    "Vos données sont stockées et contrôlées par des entreprises.": { en: "Your data is stored and controlled by companies.", es: "Tus datos son almacenados y controlados por empresas.", de: "Ihre Daten werden von Unternehmen gespeichert und kontrolliert.", it: "I tuoi dati sono archiviati e controllati da aziende.", pt: "Seus dados são armazenados e controlados por empresas." },
    "Les services dépendent d'intermédiaires (banques, plateformes, réseaux sociaux).": { en: "Services depend on intermediaries: banks, platforms and social networks.", es: "Los servicios dependen de intermediarios: bancos, plataformas y redes sociales.", de: "Dienste hängen von Vermittlern ab: Banken, Plattformen und sozialen Netzwerken.", it: "I servizi dipendono da intermediari: banche, piattaforme e social network.", pt: "Os serviços dependem de intermediários: bancos, plataformas e redes sociais." },
    "Votre présence numérique est fragmentée entre de multiples comptes et mots de passe.": { en: "Your digital presence is fragmented across many accounts and passwords.", es: "Tu presencia digital está fragmentada entre múltiples cuentas y contraseñas.", de: "Ihre digitale Präsenz ist auf viele Konten und Passwörter verteilt.", it: "La tua presenza digitale è frammentata tra molti account e password.", pt: "Sua presença digital fica fragmentada entre muitas contas e senhas." },
    "Vous louez votre place sur Internet au travers des plateformes.": { en: "You rent your place on the Internet through platforms.", es: "Alquilas tu lugar en Internet a través de plataformas.", de: "Sie mieten Ihren Platz im Internet über Plattformen.", it: "Affitti il tuo spazio su Internet attraverso le piattaforme.", pt: "Você aluga seu lugar na Internet por meio das plataformas." },
    "Vous possédez une identité numérique qui vous appartient.": { en: "You own a digital identity that belongs to you.", es: "Posees una identidad digital que te pertenece.", de: "Sie besitzen eine digitale Identität, die Ihnen gehört.", it: "Possiedi un'identità digitale che ti appartiene.", pt: "Você possui uma identidade digital que pertence a você." },
    "Vous choisissez quelles données partager et conservez le contrôle de vos accès.": { en: "You choose which data to share and keep control of your access.", es: "Eliges qué datos compartir y conservas el control de tus accesos.", de: "Sie wählen, welche Daten Sie teilen, und behalten die Kontrolle über Ihre Zugänge.", it: "Scegli quali dati condividere e mantieni il controllo dei tuoi accessi.", pt: "Você escolhe quais dados compartilhar e mantém o controle dos seus acessos." },
    "Les échanges peuvent s'effectuer directement entre utilisateurs grâce à la blockchain.": { en: "Exchanges can happen directly between users thanks to the blockchain.", es: "Los intercambios pueden realizarse directamente entre usuarios gracias a la blockchain.", de: "Austausch kann dank Blockchain direkt zwischen Nutzern stattfinden.", it: "Gli scambi possono avvenire direttamente tra utenti grazie alla blockchain.", pt: "As trocas podem acontecer diretamente entre usuários graças à blockchain." },
    "Une identité numérique unique peut vous suivre d'un service à l'autre.": { en: "A unique digital identity can follow you from one service to another.", es: "Una identidad digital única puede acompañarte de un servicio a otro.", de: "Eine einzigartige digitale Identität kann Sie von Dienst zu Dienst begleiten.", it: "Un'identità digitale unica può seguirti da un servizio all'altro.", pt: "Uma identidade digital única pode acompanhar você de um serviço a outro." },
    "Vous possédez votre propre espace numérique et les actifs qui y sont associés.": { en: "You own your own digital space and the assets attached to it.", es: "Posees tu propio espacio digital y los activos asociados.", de: "Sie besitzen Ihren eigenen digitalen Raum und die damit verbundenen Assets.", it: "Possiedi il tuo spazio digitale e gli asset associati.", pt: "Você possui seu próprio espaço digital e os ativos associados." },
    "L'immobilier des actifs numériques": { en: "Real estate for digital assets", es: "El inmobiliario de los activos digitales", de: "Immobilienlogik für digitale Assets", it: "Il settore immobiliare degli asset digitali", pt: "O imobiliário dos ativos digitais" },
    "Personne n'attend qu'un autre achète sa": { en: "No one waits for someone else to buy their", es: "Nadie espera a que otra persona compre su", de: "Niemand wartet, bis jemand anderes sein", it: "Nessuno aspetta che qualcun altro compri la sua", pt: "Ninguém espera que outra pessoa compre sua" },
    "maison": { en: "house", es: "casa", de: "Haus", it: "casa", pt: "casa" },
    "avant de chercher un logement.": { en: "before looking for a home.", es: "antes de buscar vivienda.", de: "kauft, bevor er ein Zuhause sucht.", it: "prima di cercare una casa.", pt: "antes de procurar moradia." },
    "Personne ne laisserait volontairement son nom être déposé comme marque par un tiers.": { en: "No one would willingly let a third party register their name as a trademark.", es: "Nadie dejaría voluntariamente que un tercero registrara su nombre como marca.", de: "Niemand würde freiwillig zulassen, dass ein Dritter seinen Namen als Marke anmeldet.", it: "Nessuno lascerebbe volontariamente che un terzo registri il proprio nome come marchio.", pt: "Ninguém deixaria voluntariamente um terceiro registrar seu nome como marca." },
    "Demain, il sera tout aussi naturel de posséder son prénom numérique.": { en: "Tomorrow, owning your digital first name will feel just as natural.", es: "Mañana será igual de natural poseer tu nombre digital.", de: "Morgen wird es genauso selbstverständlich sein, den eigenen digitalen Vornamen zu besitzen.", it: "Domani sarà altrettanto naturale possedere il proprio nome digitale.", pt: "Amanhã será igualmente natural possuir seu primeiro nome digital." },
    "Un nom Web3 fonctionne comme un bien immobilier, plus particulièrement un terrain : il est unique, il vous appartient, et sa valeur grandit avec son usage. La seule différence, c'est qu'il n'en existe qu'un seul exemplaire — et qu'une fois pris, il l'est définitivement.": {
      en: "A Web3 name works like real estate, more specifically like land: it is unique, it belongs to you, and its value grows with its use. The only difference is that there is only one copy, and once taken, it is taken for good.",
      es: "Un nombre Web3 funciona como un bien inmobiliario, más concretamente como un terreno: es único, te pertenece y su valor crece con su uso. La única diferencia es que solo existe un ejemplar, y una vez tomado, lo está definitivamente.",
      de: "Ein Web3-Name funktioniert wie Immobilien, genauer wie ein Grundstück: Er ist einzigartig, gehört Ihnen, und sein Wert wächst mit der Nutzung. Der einzige Unterschied: Es gibt ihn nur einmal, und wenn er vergeben ist, ist er endgültig vergeben.",
      it: "Un nome Web3 funziona come un bene immobiliare, più precisamente come un terreno: è unico, ti appartiene e il suo valore cresce con l'uso. L'unica differenza è che ne esiste un solo esemplare, e una volta preso lo è definitivamente.",
      pt: "Um nome Web3 funciona como um bem imobiliário, mais especificamente como um terreno: é único, pertence a você e seu valor cresce com o uso. A única diferença é que existe um único exemplar, e uma vez tomado, fica tomado definitivamente."
    },
    "Pourquoi maintenant": { en: "Why now", es: "Por qué ahora", de: "Warum jetzt", it: "Perché ora", pt: "Por que agora" },
    "Agir": { en: "Acting", es: "Actuar", de: "Jetzt handeln", it: "Agire", pt: "Agir" },
    "tôt": { en: "early", es: "pronto", de: "früh", it: "presto", pt: "cedo" },
    "est essentiel": { en: "is essential", es: "es esencial", de: "ist entscheidend", it: "è essenziale", pt: "é essencial" },
    "Chaque nom est unique. La cible potentielle : Population mondiale x Nombre d'identités/personnes": {
      en: "Each name is unique. The potential target: world population x number of identities/people",
      es: "Cada nombre es único. El objetivo potencial: población mundial x número de identidades/personas",
      de: "Jeder Name ist einzigartig. Die potenzielle Zielgruppe: Weltbevölkerung x Anzahl der Identitäten/Personen",
      it: "Ogni nome è unico. Il target potenziale: popolazione mondiale x numero di identità/persone",
      pt: "Cada nome é único. O público potencial: população mundial x número de identidades/pessoas"
    },
    "Le premier arrivé": { en: "Scarcity effect", es: "Efecto de escasez", de: "Knappheitseffekt", it: "Effetto scarsità", pt: "Efeito de escassez" },
    "Un bien immatériel": { en: "An intangible asset", es: "Un bien inmaterial", de: "Ein immaterieller Vermögenswert", it: "Un bene immateriale", pt: "Um bem imaterial" },
    "Une identité unifiée": { en: "A unified identity", es: "Una identidad unificada", de: "Eine einheitliche Identität", it: "Un'identità unificata", pt: "Uma identidade unificada" },
    "Une protection": { en: "Protection", es: "Protección", de: "Schutz", it: "Protezione", pt: "Proteção" },
    "Un nom ne peut appartenir qu'à une seule personne. Le réserver tôt, c'est le sécuriser pour des décennies.": { en: "A name can belong to only one person. Reserving it early secures it for decades.", es: "Un nombre solo puede pertenecer a una persona. Reservarlo pronto es protegerlo durante décadas.", de: "Ein Name kann nur einer Person gehören. Früh reserviert ist er für Jahrzehnte gesichert.", it: "Un nome può appartenere a una sola persona. Prenotarlo presto significa proteggerlo per decenni.", pt: "Um nome só pode pertencer a uma pessoa. Reservá-lo cedo é protegê-lo por décadas." },
    "Acquis une fois, sans reconduction annuelle pour de nombreuses extensions — un patrimoine qui se transmet.": { en: "Acquired once, with no annual renewal for many extensions: an asset that can be passed on.", es: "Adquirido una vez, sin renovación anual para muchas extensiones: un patrimonio transmisible.", de: "Einmal erworben, bei vielen Erweiterungen ohne jährliche Verlängerung: ein übertragbares Vermögen.", it: "Acquisito una volta, senza rinnovo annuale per molte estensioni: un patrimonio trasmissibile.", pt: "Adquirido uma vez, sem renovação anual para muitas extensões: um patrimônio transmissível." },
    "Adresse de paiement, identifiant de connexion, site web : un seul nom pour toute votre vie numérique.": { en: "Payment address, login ID, website: one name for your entire digital life.", es: "Dirección de pago, identificador de conexión, sitio web: un solo nombre para toda tu vida digital.", de: "Zahlungsadresse, Login-ID, Website: ein Name für Ihr gesamtes digitales Leben.", it: "Indirizzo di pagamento, login, sito web: un solo nome per tutta la tua vita digitale.", pt: "Endereço de pagamento, login, site: um único nome para toda a sua vida digital." },
    "Protégez votre nom avant qu'un tiers ne le réserve — comme on protège une marque ou un bien.": { en: "Protect your name before a third party reserves it, just as you protect a brand or an asset.", es: "Protege tu nombre antes de que un tercero lo reserve, como se protege una marca o un bien.", de: "Schützen Sie Ihren Namen, bevor ein Dritter ihn reserviert, wie man eine Marke oder ein Gut schützt.", it: "Proteggi il tuo nome prima che un terzo lo prenoti, come si protegge un marchio o un bene.", pt: "Proteja seu nome antes que um terceiro o reserve, como se protege uma marca ou um bem." },
    "Pourquoi .brave": { en: "Why .brave", es: "Por qué .brave", de: "Warum .brave", it: "Perché .brave", pt: "Por que .brave" },
    "Une extension": { en: "An extension", es: "Una extensión", de: "Eine Erweiterung", it: "Un'estensione", pt: "Uma extensão" },
    "rare": { en: "rare", es: "rara", de: "seltene", it: "rara", pt: "rara" },
    "lisible, native.": { en: "readable, native.", es: "legible, nativa.", de: "lesbar, nativ.", it: "leggibile, nativa.", pt: "legível, nativa." },
    ".brave est une porte d'entrée claire vers l'identité Web3 : un nom que l'on peut porter, offrir, transmettre et utiliser comme repère numérique.": { en: ".brave is a clear entry point into Web3 identity: a name you can carry, gift, pass on and use as a digital landmark.", es: ".brave es una puerta de entrada clara a la identidad Web3: un nombre que puedes llevar, regalar, transmitir y usar como referencia digital.", de: ".brave ist ein klarer Einstieg in die Web3-Identität: ein Name, den man tragen, verschenken, weitergeben und als digitalen Bezugspunkt nutzen kann.", it: ".brave è una porta d'ingresso chiara verso l'identità Web3: un nome da portare, regalare, trasmettere e usare come riferimento digitale.", pt: ".brave é uma porta de entrada clara para a identidade Web3: um nome para usar, oferecer, transmitir e usar como referência digital." },
    "Prénom.brave": { en: "FirstName.brave", es: "Nombre.brave", de: "Vorname.brave", it: "Nome.brave", pt: "Nome.brave" },
    "Identité personnelle": { en: "Personal identity", es: "Identidad personal", de: "Persönliche Identität", it: "Identità personale", pt: "Identidade pessoal" },
    "chaque domaine est unique, une seule personne n'aura votre prénom": { en: "each domain is unique; only one person will have your first name", es: "cada dominio es único; solo una persona tendrá tu nombre", de: "jede Domain ist einzigartig; nur eine Person wird Ihren Vornamen haben", it: "ogni dominio è unico; solo una persona avrà il tuo nome", pt: "cada domínio é único; apenas uma pessoa terá seu primeiro nome" },
    "Surnom.brave": { en: "Nickname.brave", es: "Apodo.brave", de: "Spitzname.brave", it: "Soprannome.brave", pt: "Apelido.brave" },
    "Pseudonyme & réseau": { en: "Pseudonym & network", es: "Pseudónimo y red", de: "Pseudonym & Netzwerk", it: "Pseudonimo e rete", pt: "Pseudônimo e rede" },
    "Un handle lisible pour les communautés, les créateurs et les profils sociaux.": { en: "A readable handle for communities, creators and social profiles.", es: "Un handle legible para comunidades, creadores y perfiles sociales.", de: "Ein lesbarer Handle für Communities, Creator und soziale Profile.", it: "Un handle leggibile per community, creator e profili social.", pt: "Um identificador legível para comunidades, criadores e perfis sociais." },
    "Cadeau.brave": { en: "Gift.brave", es: "Regalo.brave", de: "Geschenk.brave", it: "Regalo.brave", pt: "Presente.brave" },
    "Gift from a third person": { en: "Gift from a third person", es: "Regalo de un tercero", de: "Geschenk von einer dritten Person", it: "Regalo da una terza persona", pt: "Presente de uma terceira pessoa" },
    "Offrir un nom .brave, c'est offrir une adresse personnelle durable et symbolique.": { en: "Giving a .brave name means offering a lasting and symbolic personal address.", es: "Regalar un nombre .brave es ofrecer una dirección personal duradera y simbólica.", de: "Einen .brave-Namen zu schenken heißt, eine dauerhafte und symbolische persönliche Adresse zu schenken.", it: "Regalare un nome .brave significa offrire un indirizzo personale duraturo e simbolico.", pt: "Oferecer um nome .brave é oferecer um endereço pessoal duradouro e simbólico." },
    "Fun.brave": { en: "Fun.brave", es: "Fun.brave", de: "Fun.brave", it: "Fun.brave", pt: "Fun.brave" },
    "Mémorable & partageable": { en: "Memorable & shareable", es: "Memorable y compartible", de: "Einprägsam & teilbar", it: "Memorabile e condivisibile", pt: "Memorável e compartilhável" },
    "Les noms courts, affectifs ou drôles sont faciles à retenir et difficiles à remplacer.": { en: "Short, affectionate or funny names are easy to remember and hard to replace.", es: "Los nombres cortos, afectivos o divertidos son fáciles de recordar y difíciles de reemplazar.", de: "Kurze, emotionale oder lustige Namen sind leicht zu merken und schwer zu ersetzen.", it: "I nomi brevi, affettuosi o divertenti sono facili da ricordare e difficili da sostituire.", pt: "Nomes curtos, afetivos ou divertidos são fáceis de lembrar e difíceis de substituir." },
    "Métier.brave": { en: "Profession.brave", es: "Oficio.brave", de: "Beruf.brave", it: "Professione.brave", pt: "Profissao.brave" },
    "Valeur professionnelle": { en: "Professional value", es: "Valor profesional", de: "Beruflicher Wert", it: "Valore professionale", pt: "Valor profissional" },
    "Certains noms décrivent une activité ou un statut : leur rareté peut créer de la valeur.": { en: "Some names describe an activity or status: their scarcity can create value.", es: "Algunos nombres describen una actividad o un estatus: su rareza puede crear valor.", de: "Manche Namen beschreiben eine Tätigkeit oder einen Status: Ihre Knappheit kann Wert schaffen.", it: "Alcuni nomi descrivono un'attività o uno status: la loro rarità può creare valore.", pt: "Alguns nomes descrevem uma atividade ou status: sua raridade pode criar valor." },
    "Rare.brave": { en: "Rare.brave", es: "Raro.brave", de: "Selten.brave", it: "Raro.brave", pt: "Raro.brave" },
    "Navigateur & identité native": { en: "Browser & native identity", es: "Navegador e identidad nativa", de: "Browser & native Identität", it: "Browser e identità nativa", pt: "Navegador e identidade nativa" },
    "Un .brave est unique. Une fois réservé, le même nom n'est plus disponible pour les autres.": { en: "A .brave is unique. Once reserved, the same name is no longer available to others.", es: "Un .brave es único. Una vez reservado, el mismo nombre deja de estar disponible para los demás.", de: "Ein .brave ist einzigartig. Sobald er reserviert ist, steht derselbe Name anderen nicht mehr zur Verfügung.", it: "Un .brave è unico. Una volta prenotato, lo stesso nome non è più disponibile per gli altri.", pt: "Um .brave é único. Depois de reservado, o mesmo nome não fica mais disponível para os outros." },
    "Marketplace .brave": { en: ".brave Marketplace", es: "Marketplace .brave", de: ".brave Marketplace", it: "Marketplace .brave", pt: "Marketplace .brave" },
    "Réservez votre": { en: "Reserve your", es: "Reserva tu", de: "Reservieren Sie Ihr", it: "Prenota il tuo", pt: "Reserve seu" },
    "Prénoms, surnoms, noms fun, cadeaux numériques : chaque .brave ci-dessous est disponible maintenant. Cherchez le vôtre et sécurisez-le avant quelqu'un d'autre.": {
      en: "First names, nicknames, fun names and digital gifts: every .brave below is available now. Find yours and secure it before someone else does.",
      es: "Nombres, apodos, nombres divertidos y regalos digitales: cada .brave de abajo está disponible ahora. Busca el tuyo y protégelo antes que otra persona.",
      de: "Vornamen, Spitznamen, Fun-Namen und digitale Geschenke: Jeder unten aufgeführte .brave ist jetzt verfügbar. Finden und sichern Sie Ihren, bevor es jemand anderes tut.",
      it: "Nomi, soprannomi, nomi divertenti e regali digitali: ogni .brave qui sotto è disponibile ora. Trova il tuo e mettilo al sicuro prima di qualcun altro.",
      pt: "Nomes, apelidos, nomes divertidos e presentes digitais: cada .brave abaixo está disponível agora. Encontre o seu e proteja-o antes de outra pessoa."
    },
    "Prénoms": { en: "First names", es: "Nombres", de: "Vornamen", it: "Nomi", pt: "Nomes" },
    "Surnoms": { en: "Nicknames", es: "Apodos", de: "Spitznamen", it: "Soprannomi", pt: "Apelidos" },
    "Fun & amour": { en: "Fun & love", es: "Diversión y amor", de: "Fun & Liebe", it: "Fun e amore", pt: "Diversão e amor" },
    "Premium": { en: "Premium", es: "Premium", de: "Premium", it: "Premium", pt: "Premium" },
    "Pour posséder son identité civile ou offrir une adresse personnelle.": { en: "To own your civil identity or gift a personal address.", es: "Para poseer tu identidad civil u ofrecer una dirección personal.", de: "Um die bürgerliche Identität zu besitzen oder eine persönliche Adresse zu schenken.", it: "Per possedere la propria identità civile o offrire un indirizzo personale.", pt: "Para possuir sua identidade civil ou oferecer um endereço pessoal." },
    "Pour les pseudos, handles et identités sociales qui collent à la peau.": { en: "For pseudonyms, handles and social identities that fit perfectly.", es: "Para pseudónimos, handles e identidades sociales que encajan contigo.", de: "Für Pseudonyme, Handles und soziale Identitäten, die zu Ihnen passen.", it: "Per pseudonimi, handle e identità sociali che ti calzano addosso.", pt: "Para pseudônimos, handles e identidades sociais que combinam com você." },
    "Pour les noms mémorables, affectifs, drôles ou faciles à partager.": { en: "For memorable, affectionate, funny or easy-to-share names.", es: "Para nombres memorables, afectivos, divertidos o fáciles de compartir.", de: "Für einprägsame, emotionale, lustige oder leicht teilbare Namen.", it: "Per nomi memorabili, affettuosi, divertenti o facili da condividere.", pt: "Para nomes memoráveis, afetivos, divertidos ou fáceis de compartilhar." },
    "Pour les noms courts, rares, métier ou fortement monétisables.": { en: "For short, rare, professional or highly monetizable names.", es: "Para nombres cortos, raros, profesionales o muy monetizables.", de: "Für kurze, seltene, berufliche oder stark monetarisierbare Namen.", it: "Per nomi brevi, rari, professionali o molto monetizzabili.", pt: "Para nomes curtos, raros, profissionais ou altamente monetizáveis." },
    "Catégorie": { en: "Category", es: "Categoría", de: "Kategorie", it: "Categoria", pt: "Categoria" },
    "Tous les .brave": { en: "All .brave", es: "Todos los .brave", de: "Alle .brave", it: "Tutti i .brave", pt: "Todos os .brave" },
    "Fun": { en: "Fun", es: "Fun", de: "Fun", it: "Fun", pt: "Fun" },
    "Cadeau": { en: "Gift", es: "Regalo", de: "Geschenk", it: "Regalo", pt: "Presente" },
    "Premium / pro": { en: "Premium / pro", es: "Premium / pro", de: "Premium / pro", it: "Premium / pro", pt: "Premium / pro" },
    "Chargement de la collection…": { en: "Loading collection…", es: "Cargando la colección…", de: "Kollektion wird geladen…", it: "Caricamento della collezione…", pt: "Carregando coleção…" },
    "Chargement de la collection": { en: "Loading collection", es: "Cargando la colección", de: "Kollektion wird geladen", it: "Caricamento della collezione", pt: "Carregando coleção" },
    "Rechercher un .brave…": { en: "Search for a .brave…", es: "Buscar un .brave…", de: "Nach einem .brave suchen…", it: "Cerca un .brave…", pt: "Pesquisar um .brave…" },
    "Rechercher un nom .brave": { en: "Search for a .brave name", es: "Buscar un nombre .brave", de: "Nach einem .brave-Namen suchen", it: "Cerca un nome .brave", pt: "Pesquisar um nome .brave" },
    "Trier les noms de domaine": { en: "Sort domain names", es: "Ordenar nombres de dominio", de: "Domainnamen sortieren", it: "Ordina i nomi di dominio", pt: "Ordenar nomes de domínio" },
    "Les plus récents": { en: "Most recent", es: "Más recientes", de: "Neueste zuerst", it: "Più recenti", pt: "Mais recentes" },
    "Prix : croissant": { en: "Price: low to high", es: "Precio: ascendente", de: "Preis: aufsteigend", it: "Prezzo: crescente", pt: "Preço: crescente" },
    "Prix : décroissant": { en: "Price: high to low", es: "Precio: descendente", de: "Preis: absteigend", it: "Prezzo: decrescente", pt: "Preço: decrescente" },
    "Nom : A → Z": { en: "Name: A → Z", es: "Nombre: A → Z", de: "Name: A → Z", it: "Nome: A → Z", pt: "Nome: A → Z" },
    "Nom : Z → A": { en: "Name: Z → A", es: "Nombre: Z → A", de: "Name: Z → A", it: "Nome: Z → A", pt: "Nome: Z → A" },
    "Aucun nom listé pour l'instant": { en: "No names listed yet", es: "No hay nombres listados por ahora", de: "Noch keine Namen gelistet", it: "Nessun nome elencato per ora", pt: "Nenhum nome listado por enquanto" },
    "Aucun nom .brave ne correspond à ce filtre. Essayez une autre catégorie ou une recherche plus courte.": { en: "No .brave name matches this filter. Try another category or a shorter search.", es: "Ningún .brave coincide con este filtro. Prueba otra categoría o una búsqueda más corta.", de: "Kein .brave-Name passt zu diesem Filter. Versuchen Sie eine andere Kategorie oder eine kürzere Suche.", it: "Nessun nome .brave corrisponde a questo filtro. Prova un'altra categoria o una ricerca più breve.", pt: "Nenhum nome .brave corresponde a este filtro. Tente outra categoria ou uma busca mais curta." },
    "Acheter": { en: "Buy", es: "Comprar", de: "Kaufen", it: "Acquistare", pt: "Comprar" },
    "Faire une offre": { en: "Make an offer", es: "Hacer una oferta", de: "Angebot machen", it: "Fai un'offerta", pt: "Fazer uma oferta" },
    "Offres dès": { en: "Offers from", es: "Ofertas desde", de: "Angebote ab", it: "Offerte da", pt: "Ofertas a partir de" },
    "Prénom": { en: "First name", es: "Nombre", de: "Vorname", it: "Nome", pt: "Nome" },
    "Web3": { en: "Web3", es: "Web3", de: "Web3", it: "Web3", pt: "Web3" },
    "La référence de la propriété numérique": { en: "The reference for digital ownership", es: "La referencia de la propiedad digital", de: "Die Referenz für digitales Eigentum", it: "Il riferimento per la proprietà digitale", pt: "A referência da propriedade digital" },
    "Accueil": { en: "Home", es: "Inicio", de: "Startseite", it: "Home", pt: "Início" },
    "La transition": { en: "The transition", es: "La transición", de: "Der Übergang", it: "La transizione", pt: "A transição" },
    "Trouvez le nom": { en: "Find the name", es: "Encuentra el nombre", de: "Finden Sie den Namen", it: "Trova il nome", pt: "Encontre o nome" },
    ".brave": { en: ".brave", es: ".brave", de: ".brave", it: ".brave", pt: ".brave" },
    "à posséder.": { en: "to own.", es: "para poseer.", de: "zum Besitzen.", it: "da possedere.", pt: "para possuir." },
    "Les bons noms deviennent rares dès que tout le monde comprend leur valeur. PureOwner rassemble des prénoms, surnoms, noms fun et idées cadeaux en .brave pour aider chacun à prendre pied dans le Web3 avant qu'il ne soit trop tard.": {
      en: "Good names become rare as soon as everyone understands their value. PureOwner gathers first names, nicknames, fun names and gift ideas in .brave to help everyone step into Web3 before it is too late.",
      es: "Los buenos nombres se vuelven raros cuando todos entienden su valor. PureOwner reúne nombres, apodos, nombres divertidos e ideas de regalo en .brave para ayudar a todos a entrar en Web3 antes de que sea tarde.",
      de: "Gute Namen werden knapp, sobald alle ihren Wert verstehen. PureOwner bündelt Vornamen, Spitznamen, Fun-Namen und Geschenkideen in .brave, damit jeder rechtzeitig ins Web3 einsteigen kann.",
      it: "I buoni nomi diventano rari appena tutti ne capiscono il valore. PureOwner raccoglie nomi, soprannomi, nomi divertenti e idee regalo in .brave per aiutare tutti a entrare nel Web3 prima che sia troppo tardi.",
      pt: "Bons nomes ficam raros assim que todos entendem seu valor. A PureOwner reúne nomes, apelidos, nomes divertidos e ideias de presente em .brave para ajudar todos a entrar no Web3 antes que seja tarde."
    },
    "Pourquoi agir maintenant ?": { en: "Why act now?", es: "¿Por qué actuar ahora?", de: "Warum jetzt handeln?", it: "Perché agire ora?", pt: "Por que agir agora?" },
    "Pas parce qu'un domaine Web3 est déjà indispensable. Parce qu'il permet de réserver une identité cohérente pendant que ses usages se construisent.": {
      en: "Not because a Web3 domain is already essential. Because it lets you reserve a coherent identity while its uses are still being built.",
      es: "No porque un dominio Web3 ya sea indispensable, sino porque permite reservar una identidad coherente mientras se desarrollan sus usos.",
      de: "Nicht weil eine Web3-Domain bereits unverzichtbar ist, sondern weil sie eine stimmige Identität sichert, während ihre Anwendungen entstehen.",
      it: "Non perché un dominio Web3 sia già indispensabile, ma perché permette di riservare un'identità coerente mentre i suoi usi si sviluppano.",
      pt: "Não porque um domínio Web3 já seja indispensável, mas porque permite reservar uma identidade coerente enquanto seus usos se desenvolvem."
    },
    "L'utilité se construit. La disponibilité, elle, ne revient pas.": { en: "Utility is built. Availability does not return.", es: "La utilidad se construye. La disponibilidad no vuelve.", de: "Nutzen entsteht. Verfügbarkeit kehrt nicht zurück.", it: "L'utilità si costruisce. La disponibilità non torna.", pt: "A utilidade se constrói. A disponibilidade não volta." },
    "Une application peut évoluer, un wallet recevoir de nouvelles fonctions et un standard gagner de nouveaux partenaires. Mais lorsqu'un nom unique est pris, il faut le racheter, en changer ou y renoncer.": {
      en: "An app can evolve, a wallet can gain new features and a standard can attract new partners. But once a unique name is taken, you must buy it back, choose another or give it up.",
      es: "Una aplicación puede evolucionar, un wallet ganar funciones y un estándar sumar socios. Pero cuando un nombre único está ocupado, hay que recomprarlo, cambiarlo o renunciar a él.",
      de: "Eine App kann sich entwickeln, ein Wallet neue Funktionen erhalten und ein Standard neue Partner gewinnen. Ist ein eindeutiger Name vergeben, muss man ihn zurückkaufen, ändern oder aufgeben.",
      it: "Un'app può evolvere, un wallet acquisire funzioni e uno standard nuovi partner. Ma quando un nome unico è preso, bisogna ricomprarlo, cambiarlo o rinunciarvi.",
      pt: "Um aplicativo pode evoluir, uma wallet ganhar funções e um padrão novos parceiros. Mas, quando um nome único é ocupado, é preciso recomprá-lo, mudá-lo ou desistir dele."
    },
    "Les usages restent fragmentés. Un domaine Web3 ne remplace pas encore partout un domaine classique.": { en: "Uses remain fragmented. A Web3 domain does not yet replace a traditional domain everywhere.", es: "Los usos siguen fragmentados. Un dominio Web3 aún no sustituye en todas partes a uno clásico.", de: "Die Anwendungen bleiben fragmentiert. Eine Web3-Domain ersetzt noch nicht überall eine klassische Domain.", it: "Gli usi restano frammentati. Un dominio Web3 non sostituisce ancora ovunque un dominio classico.", pt: "Os usos continuam fragmentados. Um domínio Web3 ainda não substitui um domínio clássico em toda parte." },
    "L'incertitude est réelle.": { en: "The uncertainty is real.", es: "La incertidumbre es real.", de: "Die Unsicherheit ist real.", it: "L'incertezza è reale.", pt: "A incerteza é real." },
    "Ce qui converge": { en: "What is converging", es: "Lo que converge", de: "Was zusammenläuft", it: "Ciò che converge", pt: "O que converge" },
    "Wallets, paiements, connexions, preuves numériques et agents d'IA ont tous besoin d'identifiants simples.": { en: "Wallets, payments, logins, digital proofs and AI agents all need simple identifiers.", es: "Wallets, pagos, conexiones, pruebas digitales y agentes de IA necesitan identificadores simples.", de: "Wallets, Zahlungen, Logins, digitale Nachweise und KI-Agenten brauchen einfache Kennungen.", it: "Wallet, pagamenti, accessi, prove digitali e agenti IA richiedono identificativi semplici.", pt: "Wallets, pagamentos, conexões, provas digitais e agentes de IA precisam de identificadores simples." },
    "Le nom rend la technique humaine.": { en: "The name makes technology human.", es: "El nombre humaniza la tecnología.", de: "Der Name macht Technik menschlich.", it: "Il nome rende umana la tecnologia.", pt: "O nome torna a tecnologia humana." },
    "Ce qui ne change pas": { en: "What does not change", es: "Lo que no cambia", de: "Was sich nicht ändert", it: "Ciò che non cambia", pt: "O que não muda" },
    "Un nom court, évident et mémorisable reste une ressource rare.": { en: "A short, obvious and memorable name remains a scarce resource.", es: "Un nombre corto, evidente y memorable sigue siendo un recurso escaso.", de: "Ein kurzer, klarer und einprägsamer Name bleibt eine knappe Ressource.", it: "Un nome breve, evidente e memorabile resta una risorsa rara.", pt: "Um nome curto, óbvio e memorável continua sendo um recurso raro." },
    "Il n'existe qu'une seule fois.": { en: "It exists only once.", es: "Solo existe una vez.", de: "Er existiert nur einmal.", it: "Esiste una sola volta.", pt: "Ele existe apenas uma vez." },
    "Le coût de l'anticipation face au coût du retard": { en: "The cost of anticipation versus the cost of delay", es: "El coste de anticiparse frente al coste de esperar", de: "Die Kosten der Vorsorge gegenüber den Kosten des Wartens", it: "Il costo dell'anticipo rispetto al costo del ritardo", pt: "O custo da antecipação frente ao custo da espera" },
    "Anticiper": { en: "Anticipate", es: "Anticiparse", de: "Vorsorgen", it: "Anticipare", pt: "Antecipar" },
    "Réserver aujourd'hui un nom que vous seriez prêt à conserver et réellement utiliser.": { en: "Reserve today a name you would be willing to keep and actually use.", es: "Reservar hoy un nombre que estaría dispuesto a conservar y utilizar.", de: "Heute einen Namen sichern, den Sie behalten und wirklich nutzen würden.", it: "Riservare oggi un nome che si è pronti a conservare e usare davvero.", pt: "Reservar hoje um nome que você estaria disposto a manter e realmente usar." },
    "Attendre": { en: "Wait", es: "Esperar", de: "Warten", it: "Aspettare", pt: "Esperar" },
    "Accepter demain un autre nom, négocier un rachat ou laisser un tiers représenter votre identité.": { en: "Accept another name tomorrow, negotiate a buyback or let a third party represent your identity.", es: "Aceptar mañana otro nombre, negociar una recompra o dejar que un tercero represente su identidad.", de: "Später einen anderen Namen akzeptieren, einen Rückkauf verhandeln oder einem Dritten die eigene Identität überlassen.", it: "Accettare domani un altro nome, negoziare un riacquisto o lasciare che un terzo rappresenti la propria identità.", pt: "Aceitar outro nome amanhã, negociar uma recompra ou deixar um terceiro representar sua identidade." },
    "Acheter tôt ne signifie pas acheter aveuglément.": { en: "Buying early does not mean buying blindly.", es: "Comprar pronto no significa comprar a ciegas.", de: "Früh zu kaufen heißt nicht, blind zu kaufen.", it: "Comprare presto non significa comprare alla cieca.", pt: "Comprar cedo não significa comprar às cegas." },
    "La bonne stratégie n'est pas de collectionner. Elle consiste à sécuriser quelques noms essentiels, sur une infrastructure crédible.": { en: "The right strategy is not to collect. It is to secure a few essential names on credible infrastructure.", es: "La estrategia correcta no es coleccionar, sino asegurar unos pocos nombres esenciales sobre una infraestructura creíble.", de: "Die richtige Strategie ist nicht das Sammeln, sondern einige wesentliche Namen auf glaubwürdiger Infrastruktur zu sichern.", it: "La strategia giusta non è collezionare, ma proteggere pochi nomi essenziali su un'infrastruttura credibile.", pt: "A estratégia certa não é colecionar, mas garantir alguns nomes essenciais em uma infraestrutura confiável." },
    "Votre pseudonyme": { en: "Your username", es: "Tu seudónimo", de: "Ihr Pseudonym", it: "Il tuo pseudonimo", pt: "Seu pseudônimo" },
    "Votre marque": { en: "Your brand", es: "Tu marca", de: "Ihre Marke", it: "Il tuo marchio", pt: "Sua marca" },
    "Votre projet": { en: "Your project", es: "Tu proyecto", de: "Ihr Projekt", it: "Il tuo progetto", pt: "Seu projeto" },
    "On ne l'acquiert pas uniquement pour ce qu'il permet aujourd'hui.": { en: "You do not acquire it only for what it enables today.", es: "No se adquiere solo por lo que permite hoy.", de: "Man erwirbt ihn nicht nur für das, was er heute ermöglicht.", it: "Non lo si acquista solo per ciò che permette oggi.", pt: "Ele não é adquirido apenas pelo que permite hoje." },
    "On le réserve pour ne pas avoir à demander demain la permission d'utiliser son propre nom.": { en: "You reserve it so you do not have to ask permission to use your own name tomorrow.", es: "Se reserva para no tener que pedir mañana permiso para usar el propio nombre.", de: "Man sichert ihn, um morgen nicht um Erlaubnis bitten zu müssen, den eigenen Namen zu verwenden.", it: "Lo si riserva per non dover chiedere domani il permesso di usare il proprio nome.", pt: "Ele é reservado para que amanhã você não precise pedir permissão para usar o próprio nome." },
    "Comprendre les infrastructures, maîtriser ses outils et construire son identité numérique, chapitre après chapitre.": { en: "Understand the infrastructure, master your tools and build your digital identity, chapter by chapter.", es: "Comprender la infraestructura, dominar las herramientas y construir la identidad digital, capítulo a capítulo.", de: "Infrastruktur verstehen, Werkzeuge beherrschen und die digitale Identität Kapitel für Kapitel aufbauen.", it: "Comprendere l'infrastruttura, padroneggiare gli strumenti e costruire la propria identità digitale, capitolo dopo capitolo.", pt: "Compreender a infraestrutura, dominar as ferramentas e construir sua identidade digital, capítulo por capítulo." },
    "Infrastructure crypto": { en: "Crypto infrastructure", es: "Infraestructura cripto", de: "Krypto-Infrastruktur", it: "Infrastruttura cripto", pt: "Infraestrutura cripto" },
    "Comprendre les fondations avant les usages.": { en: "Understand the foundations before the uses.", es: "Comprender los fundamentos antes que los usos.", de: "Die Grundlagen vor den Anwendungen verstehen.", it: "Comprendere le fondamenta prima degli usi.", pt: "Compreender os fundamentos antes dos usos." },
    "Pourquoi Bitcoin ?": { en: "Why Bitcoin?", es: "¿Por qué Bitcoin?", de: "Warum Bitcoin?", it: "Perché Bitcoin?", pt: "Por que Bitcoin?" },
    "10 chapitres": { en: "10 chapters", es: "10 capítulos", de: "10 Kapitel", it: "10 capitoli", pt: "10 capítulos" },
    "Le livre blanc expliqué simplement : du problème des tiers de confiance à la création d'un réseau pair-à-pair capable d'échanger de la valeur sur Internet.": { en: "The white paper explained simply: from the trusted-third-party problem to a peer-to-peer network able to exchange value online.", es: "El libro blanco explicado de forma sencilla: del problema de los terceros de confianza a una red entre pares capaz de intercambiar valor en Internet.", de: "Das Whitepaper einfach erklärt: vom Problem vertrauenswürdiger Dritter zu einem Peer-to-Peer-Netzwerk für den Austausch von Werten im Internet.", it: "Il white paper spiegato semplicemente: dal problema dei terzi fidati a una rete peer-to-peer capace di scambiare valore su Internet.", pt: "O white paper explicado de forma simples: do problema dos terceiros de confiança a uma rede peer-to-peer capaz de trocar valor na Internet." },
    "Le problème identifié": { en: "The identified problem", es: "El problema identificado", de: "Das erkannte Problem", it: "Il problema identificato", pt: "O problema identificado" },
    "L'objectif": { en: "The objective", es: "El objetivo", de: "Das Ziel", it: "L'obiettivo", pt: "O objetivo" },
    "La double dépense": { en: "Double spending", es: "El doble gasto", de: "Doppelausgabe", it: "La doppia spesa", pt: "O gasto duplo" },
    "Le problème de la double dépense": { en: "The double-spending problem", es: "El problema del doble gasto", de: "Das Problem der Doppelausgabe", it: "Il problema della doppia spesa", pt: "O problema do gasto duplo" },
    "La solution proposée": { en: "The proposed solution", es: "La solución propuesta", de: "Die vorgeschlagene Lösung", it: "La soluzione proposta", pt: "A solução proposta" },
    "Les nœuds": { en: "Nodes", es: "Los nodos", de: "Die Knoten", it: "I nodi", pt: "Os nós" },
    "L'incitation économique": { en: "The economic incentive", es: "El incentivo económico", de: "Der wirtschaftliche Anreiz", it: "L'incentivo economico", pt: "O incentivo econômico" },
    "La confidentialité": { en: "Privacy", es: "La privacidad", de: "Datenschutz", it: "La riservatezza", pt: "A privacidade" },
    "La sécurité": { en: "Security", es: "La seguridad", de: "Sicherheit", it: "La sicurezza", pt: "A segurança" },
    "Ce que le livre blanc ne dit jamais": { en: "What the white paper never says", es: "Lo que el libro blanco nunca dice", de: "Was das Whitepaper nie sagt", it: "Ciò che il white paper non dice mai", pt: "O que o white paper nunca diz" },
    "Identité numérique": { en: "Digital identity", es: "Identidad digital", de: "Digitale Identität", it: "Identità digitale", pt: "Identidade digital" },
    "Wallet, domaines Web3 et preuves portables.": { en: "Wallets, Web3 domains and portable proofs.", es: "Wallets, dominios Web3 y pruebas portátiles.", de: "Wallets, Web3-Domains und portable Nachweise.", it: "Wallet, domini Web3 e prove portatili.", pt: "Wallets, domínios Web3 e provas portáteis." },
    "Comprendre un wallet": { en: "Understand a wallet", es: "Comprender un wallet", de: "Ein Wallet verstehen", it: "Capire un wallet", pt: "Entender uma wallet" },
    "Protéger sa phrase secrète": { en: "Protect your recovery phrase", es: "Proteger la frase secreta", de: "Die Wiederherstellungsphrase schützen", it: "Proteggere la frase segreta", pt: "Proteger a frase secreta" },
    "Choisir un domaine Web3": { en: "Choose a Web3 domain", es: "Elegir un dominio Web3", de: "Eine Web3-Domain wählen", it: "Scegliere un dominio Web3", pt: "Escolher um domínio Web3" },
    "Utiliser des preuves vérifiables": { en: "Use verifiable proofs", es: "Usar pruebas verificables", de: "Überprüfbare Nachweise nutzen", it: "Usare prove verificabili", pt: "Usar provas verificáveis" },
    "Créer et publier": { en: "Create and publish", es: "Crear y publicar", de: "Erstellen und veröffentlichen", it: "Creare e pubblicare", pt: "Criar e publicar" },
    "Transformer son nom en présence numérique.": { en: "Turn your name into a digital presence.", es: "Convertir el nombre en presencia digital.", de: "Den Namen in eine digitale Präsenz verwandeln.", it: "Trasformare il nome in una presenza digitale.", pt: "Transformar seu nome em presença digital." },
    "Créer son profil": { en: "Create your profile", es: "Crear el perfil", de: "Ein Profil erstellen", it: "Creare il profilo", pt: "Criar seu perfil" },
    "Publier un site": { en: "Publish a website", es: "Publicar un sitio", de: "Eine Website veröffentlichen", it: "Pubblicare un sito", pt: "Publicar um site" },
    "Relier DNS et IPFS": { en: "Connect DNS and IPFS", es: "Conectar DNS e IPFS", de: "DNS und IPFS verbinden", it: "Collegare DNS e IPFS", pt: "Conectar DNS e IPFS" },
    "Recevoir des paiements": { en: "Receive payments", es: "Recibir pagos", de: "Zahlungen empfangen", it: "Ricevere pagamenti", pt: "Receber pagamentos" },
    "Sécurité et autonomie": { en: "Security and autonomy", es: "Seguridad y autonomía", de: "Sicherheit und Autonomie", it: "Sicurezza e autonomia", pt: "Segurança e autonomia" },
    "Conserver le contrôle sans sacrifier la simplicité.": { en: "Keep control without sacrificing simplicity.", es: "Mantener el control sin sacrificar la sencillez.", de: "Kontrolle behalten, ohne Einfachheit zu opfern.", it: "Mantenere il controllo senza sacrificare la semplicità.", pt: "Manter o controle sem sacrificar a simplicidade." },
    "Éviter le phishing": { en: "Avoid phishing", es: "Evitar el phishing", de: "Phishing vermeiden", it: "Evitare il phishing", pt: "Evitar phishing" },
    "Sauvegarder ses accès": { en: "Back up your access", es: "Guardar los accesos", de: "Zugänge sichern", it: "Salvare gli accessi", pt: "Fazer backup dos acessos" },
    "Choisir un hardware wallet": { en: "Choose a hardware wallet", es: "Elegir un hardware wallet", de: "Eine Hardware-Wallet wählen", it: "Scegliere un hardware wallet", pt: "Escolher uma hardware wallet" },
    "Contrôler les autorisations": { en: "Control permissions", es: "Controlar los permisos", de: "Berechtigungen kontrollieren", it: "Controllare le autorizzazioni", pt: "Controlar as permissões" },
    "Agrandir le chapitre": { en: "Enlarge chapter", es: "Ampliar capítulo", de: "Kapitel vergrößern", it: "Ingrandisci capitolo", pt: "Ampliar capítulo" },
    "Chapitre précédent": { en: "Previous chapter", es: "Capítulo anterior", de: "Vorheriges Kapitel", it: "Capitolo precedente", pt: "Capítulo anterior" },
    "Chapitre suivant": { en: "Next chapter", es: "Capítulo siguiente", de: "Nächstes Kapitel", it: "Capitolo successivo", pt: "Próximo capítulo" },
    "Fermer": { en: "Close", es: "Cerrar", de: "Schließen", it: "Chiudi", pt: "Fechar" },
    "PureOwner · Privacy": { en: "PureOwner · Privacy", es: "PureOwner · Privacidad", de: "PureOwner · Datenschutz", it: "PureOwner · Privacy", pt: "PureOwner · Privacidade" },
    "En bref": { en: "At a glance", es: "En resumen", de: "Kurz gesagt", it: "In breve", pt: "Em resumo" },
    "Politique détaillée": { en: "Detailed policy", es: "Política detallada", de: "Ausführliche Richtlinie", it: "Informativa dettagliata", pt: "Política detalhada" },
    "Une confidentialité lisible.": { en: "Privacy made clear.", es: "Una privacidad comprensible.", de: "Datenschutz verständlich erklärt.", it: "Una privacy chiara.", pt: "Privacidade clara." },
    "PureOwner respecte votre vie privée. Les données autorisées servent uniquement à produire le service demandé et ne sont pas revendues.": {
      en: "PureOwner respects your privacy. Authorized data is used only to provide the requested service and is never sold.",
      es: "PureOwner respeta su privacidad. Los datos autorizados se utilizan únicamente para prestar el servicio solicitado y nunca se venden.",
      de: "PureOwner respektiert Ihre Privatsphäre. Freigegebene Daten werden nur für den angeforderten Dienst verwendet und niemals verkauft.",
      it: "PureOwner rispetta la tua privacy. I dati autorizzati vengono utilizzati solo per fornire il servizio richiesto e non vengono mai venduti.",
      pt: "A PureOwner respeita a sua privacidade. Os dados autorizados são utilizados apenas para prestar o serviço solicitado e nunca são vendidos."
    },
    "Données utilisées": { en: "Data used", es: "Datos utilizados", de: "Verwendete Daten", it: "Dati utilizzati", pt: "Dados utilizados" },
    "Identifiant ou pseudonyme, adresse de wallet et paramètres strictement nécessaires à l’affichage, uniquement avec votre autorisation.": {
      en: "Identifier or pseudonym, wallet address and display settings that are strictly necessary, only with your permission.",
      es: "Identificador o seudónimo, dirección de wallet y parámetros estrictamente necesarios para la visualización, solo con su autorización.",
      de: "Kennung oder Pseudonym, Wallet-Adresse und für die Anzeige unbedingt erforderliche Einstellungen, nur mit Ihrer Zustimmung.",
      it: "Identificativo o pseudonimo, indirizzo wallet e impostazioni strettamente necessarie alla visualizzazione, solo con la tua autorizzazione.",
      pt: "Identificador ou pseudónimo, endereço de wallet e definições estritamente necessárias à apresentação, apenas com a sua autorização."
    },
    "Finalité": { en: "Purpose", es: "Finalidad", de: "Zweck", it: "Finalità", pt: "Finalidade" },
    "Générer un visuel personnalisé, afficher le résultat demandé et assurer le bon fonctionnement de l’application.": { en: "Create a personalized visual, display the requested result and ensure the application works properly.", es: "Generar un visual personalizado, mostrar el resultado solicitado y garantizar el correcto funcionamiento de la aplicación.", de: "Eine personalisierte Darstellung erzeugen, das gewünschte Ergebnis anzeigen und den ordnungsgemäßen Betrieb der Anwendung sicherstellen.", it: "Generare un contenuto visivo personalizzato, mostrare il risultato richiesto e garantire il corretto funzionamento dell'applicazione.", pt: "Gerar um visual personalizado, apresentar o resultado solicitado e assegurar o bom funcionamento da aplicação." },
    "Ce que nous ne faisons pas": { en: "What we do not do", es: "Lo que no hacemos", de: "Was wir nicht tun", it: "Cosa non facciamo", pt: "O que não fazemos" },
    "Aucun marketing comportemental, aucune publicité ciblée et aucune vente de données.": { en: "No behavioral marketing, targeted advertising or data sales.", es: "Sin marketing conductual, publicidad dirigida ni venta de datos.", de: "Kein verhaltensbasiertes Marketing, keine zielgerichtete Werbung und kein Datenverkauf.", it: "Nessun marketing comportamentale, pubblicità mirata o vendita di dati.", pt: "Sem marketing comportamental, publicidade direcionada ou venda de dados." },
    "Conservation": { en: "Retention", es: "Conservación", de: "Speicherung", it: "Conservazione", pt: "Conservação" },
    "Les données utilisées pour produire un visuel ne sont pas conservées après sa génération.": { en: "Data used to produce a visual is not retained after it is generated.", es: "Los datos utilizados para producir un visual no se conservan después de generarlo.", de: "Daten zur Erstellung einer Darstellung werden nach der Generierung nicht gespeichert.", it: "I dati utilizzati per produrre un contenuto visivo non vengono conservati dopo la generazione.", pt: "Os dados utilizados para produzir um visual não são conservados após a sua geração." },
    "Partage": { en: "Sharing", es: "Compartición", de: "Weitergabe", it: "Condivisione", pt: "Partilha" },
    "Aucun partage, sauf avec un prestataire technique strictement nécessaire au fonctionnement du service.": { en: "No sharing except with a technical provider strictly required to operate the service.", es: "No se comparten datos, salvo con un proveedor técnico estrictamente necesario para el funcionamiento del servicio.", de: "Keine Weitergabe, außer an einen technischen Anbieter, der für den Betrieb des Dienstes zwingend erforderlich ist.", it: "Nessuna condivisione, salvo con un fornitore tecnico strettamente necessario al funzionamento del servizio.", pt: "Sem partilha, exceto com um prestador técnico estritamente necessário ao funcionamento do serviço." },
    "Vos droits": { en: "Your rights", es: "Sus derechos", de: "Ihre Rechte", it: "I tuoi diritti", pt: "Os seus direitos" },
    "Vous pouvez demander l’accès, la rectification, la suppression ou la limitation de l’usage de vos données.": { en: "You may request access, correction, deletion or restriction of the use of your data.", es: "Puede solicitar el acceso, la rectificación, la supresión o la limitación del uso de sus datos.", de: "Sie können Auskunft, Berichtigung, Löschung oder Einschränkung der Nutzung Ihrer Daten verlangen.", it: "Puoi richiedere l'accesso, la rettifica, la cancellazione o la limitazione dell'uso dei tuoi dati.", pt: "Pode solicitar o acesso, a retificação, a eliminação ou a limitação da utilização dos seus dados." },
    "Pour toute question : contact@pureowner.com": { en: "Questions: contact@pureowner.com", es: "Preguntas: contact@pureowner.com", de: "Fragen: contact@pureowner.com", it: "Domande: contact@pureowner.com", pt: "Questões: contact@pureowner.com" },
    "Contact": { en: "Contact", es: "Contacto", de: "Kontakt", it: "Contatti", pt: "Contacto" },
    "Politique de confidentialité.": { en: "Privacy policy.", es: "Política de privacidad.", de: "Datenschutzerklärung.", it: "Informativa sulla privacy.", pt: "Política de privacidade." },
    "Cette politique décrit de manière transparente comment PureOwner traite les données lorsque vous consultez le site ou utilisez un service activé.": { en: "This policy transparently explains how PureOwner handles data when you browse the site or use an enabled service.", es: "Esta política explica de forma transparente cómo trata PureOwner los datos cuando visita el sitio o utiliza un servicio activado.", de: "Diese Richtlinie erläutert transparent, wie PureOwner Daten beim Besuch der Website oder bei der Nutzung eines aktivierten Dienstes verarbeitet.", it: "Questa informativa spiega in modo trasparente come PureOwner tratta i dati quando visiti il sito o utilizzi un servizio attivato.", pt: "Esta política explica de forma transparente como a PureOwner trata os dados quando consulta o site ou utiliza um serviço ativado." },
    "Responsable": { en: "Controller", es: "Responsable", de: "Verantwortlicher", it: "Titolare", pt: "Responsável" },
    "PureOwner est responsable des traitements décrits ici. Contact : contact@pureowner.com.": { en: "PureOwner is responsible for the processing described here. Contact: contact@pureowner.com.", es: "PureOwner es responsable de los tratamientos aquí descritos. Contacto: contact@pureowner.com.", de: "PureOwner ist für die hier beschriebenen Verarbeitungen verantwortlich. Kontakt: contact@pureowner.com.", it: "PureOwner è titolare dei trattamenti descritti. Contatto: contact@pureowner.com.", pt: "A PureOwner é responsável pelos tratamentos aqui descritos. Contacto: contact@pureowner.com." },
    "Données concernées": { en: "Data categories", es: "Datos afectados", de: "Betroffene Daten", it: "Dati interessati", pt: "Dados abrangidos" },
    "Selon le service utilisé : pseudonyme, adresse de wallet, informations de profil, préférences d’affichage, messages adressés au support et données techniques de sécurité.": { en: "Depending on the service: pseudonym, wallet address, profile information, display preferences, support messages and technical security data.", es: "Según el servicio: seudónimo, dirección de wallet, información de perfil, preferencias de visualización, mensajes de soporte y datos técnicos de seguridad.", de: "Je nach Dienst: Pseudonym, Wallet-Adresse, Profilinformationen, Anzeigeeinstellungen, Supportnachrichten und technische Sicherheitsdaten.", it: "A seconda del servizio: pseudonimo, indirizzo wallet, informazioni del profilo, preferenze di visualizzazione, messaggi al supporto e dati tecnici di sicurezza.", pt: "Consoante o serviço: pseudónimo, endereço de wallet, informações de perfil, preferências de apresentação, mensagens ao suporte e dados técnicos de segurança." },
    "Finalités et bases": { en: "Purposes and legal grounds", es: "Finalidades y bases", de: "Zwecke und Grundlagen", it: "Finalità e basi", pt: "Finalidades e fundamentos" },
    "Exécuter le service demandé, personnaliser l’affichage avec votre accord, sécuriser le site, répondre à vos demandes et respecter nos obligations légales.": { en: "Provide the requested service, personalize the display with your consent, secure the site, respond to requests and meet legal obligations.", es: "Prestar el servicio solicitado, personalizar la visualización con su consentimiento, proteger el sitio, responder a sus solicitudes y cumplir nuestras obligaciones legales.", de: "Den angeforderten Dienst erbringen, die Anzeige mit Ihrer Zustimmung personalisieren, die Website sichern, Anfragen beantworten und gesetzliche Pflichten erfüllen.", it: "Fornire il servizio richiesto, personalizzare la visualizzazione con il tuo consenso, proteggere il sito, rispondere alle richieste e rispettare gli obblighi di legge.", pt: "Prestar o serviço solicitado, personalizar a apresentação com o seu consentimento, proteger o site, responder aos pedidos e cumprir as obrigações legais." },
    "Minimisation": { en: "Data minimization", es: "Minimización", de: "Datenminimierung", it: "Minimizzazione", pt: "Minimização" },
    "Nous limitons chaque traitement aux données strictement nécessaires. Les données sensibles ne doivent jamais être inscrites directement sur une blockchain publique.": { en: "We limit each processing operation to strictly necessary data. Sensitive data must never be written directly to a public blockchain.", es: "Limitamos cada tratamiento a los datos estrictamente necesarios. Los datos sensibles nunca deben registrarse directamente en una blockchain pública.", de: "Wir beschränken jede Verarbeitung auf unbedingt erforderliche Daten. Sensible Daten dürfen niemals direkt in eine öffentliche Blockchain geschrieben werden.", it: "Limitiamo ogni trattamento ai dati strettamente necessari. I dati sensibili non devono mai essere registrati direttamente su una blockchain pubblica.", pt: "Limitamos cada tratamento aos dados estritamente necessários. Os dados sensíveis nunca devem ser registados diretamente numa blockchain pública." },
    "Durées": { en: "Retention periods", es: "Plazos", de: "Speicherdauer", it: "Durata", pt: "Prazos" },
    "Les données de génération ne sont pas stockées. Les échanges avec le support et journaux techniques ne sont conservés que pendant la durée nécessaire à leur finalité ou aux obligations applicables.": { en: "Generation data is not stored. Support exchanges and technical logs are kept only as long as required for their purpose or applicable obligations.", es: "Los datos de generación no se almacenan. Los intercambios con soporte y los registros técnicos solo se conservan durante el tiempo necesario para su finalidad o las obligaciones aplicables.", de: "Generierungsdaten werden nicht gespeichert. Supportkommunikation und technische Protokolle werden nur so lange aufbewahrt, wie es für ihren Zweck oder geltende Pflichten erforderlich ist.", it: "I dati di generazione non vengono archiviati. Le comunicazioni con il supporto e i log tecnici vengono conservati solo per il tempo necessario alla loro finalità o agli obblighi applicabili.", pt: "Os dados de geração não são armazenados. As comunicações com o suporte e os registos técnicos são conservados apenas durante o período necessário à sua finalidade ou às obrigações aplicáveis." },
    "Destinataires": { en: "Recipients", es: "Destinatarios", de: "Empfänger", it: "Destinatari", pt: "Destinatários" },
    "PureOwner ne vend aucune donnée. Des prestataires d’hébergement, de sécurité ou d’infrastructure peuvent intervenir uniquement pour fournir le service et selon nos instructions.": { en: "PureOwner does not sell data. Hosting, security or infrastructure providers may process it only to deliver the service and under our instructions.", es: "PureOwner no vende datos. Los proveedores de alojamiento, seguridad o infraestructura solo pueden intervenir para prestar el servicio y siguiendo nuestras instrucciones.", de: "PureOwner verkauft keine Daten. Hosting-, Sicherheits- oder Infrastrukturanbieter dürfen sie nur zur Erbringung des Dienstes und nach unseren Weisungen verarbeiten.", it: "PureOwner non vende dati. I fornitori di hosting, sicurezza o infrastruttura possono trattarli solo per erogare il servizio e secondo le nostre istruzioni.", pt: "A PureOwner não vende dados. Os prestadores de alojamento, segurança ou infraestrutura só podem intervir para prestar o serviço e segundo as nossas instruções." },
    "Transferts": { en: "Transfers", es: "Transferencias", de: "Übermittlungen", it: "Trasferimenti", pt: "Transferências" },
    "Lorsqu’un prestataire traite des données hors de votre pays, les garanties contractuelles et réglementaires appropriées sont appliquées.": { en: "When a provider processes data outside your country, appropriate contractual and regulatory safeguards apply.", es: "Cuando un proveedor trata datos fuera de su país, se aplican las garantías contractuales y normativas adecuadas.", de: "Wenn ein Anbieter Daten außerhalb Ihres Landes verarbeitet, gelten geeignete vertragliche und regulatorische Schutzmaßnahmen.", it: "Quando un fornitore tratta dati fuori dal tuo Paese, si applicano adeguate garanzie contrattuali e normative.", pt: "Quando um prestador trata dados fora do seu país, são aplicadas garantias contratuais e regulamentares adequadas." },
    "Sécurité": { en: "Security", es: "Seguridad", de: "Sicherheit", it: "Sicurezza", pt: "Segurança" },
    "Nous privilégions le chiffrement, la limitation des accès, la minimisation et les preuves cryptographiques afin de réduire l’exposition des informations.": { en: "We favor encryption, restricted access, minimization and cryptographic proofs to reduce information exposure.", es: "Priorizamos el cifrado, la limitación de acceso, la minimización y las pruebas criptográficas para reducir la exposición de la información.", de: "Wir setzen auf Verschlüsselung, eingeschränkte Zugriffe, Datenminimierung und kryptografische Nachweise, um die Offenlegung von Informationen zu verringern.", it: "Privilegiamo cifratura, accessi limitati, minimizzazione e prove crittografiche per ridurre l'esposizione delle informazioni.", pt: "Privilegiamos a encriptação, a limitação de acessos, a minimização e as provas criptográficas para reduzir a exposição das informações." },
    "Cookies et préférences": { en: "Cookies and preferences", es: "Cookies y preferencias", de: "Cookies und Einstellungen", it: "Cookie e preferenze", pt: "Cookies e preferências" },
    "Le site peut mémoriser des préférences fonctionnelles, comme la langue. Aucun suivi publicitaire n’est activé sans consentement explicite.": { en: "The site may remember functional preferences such as language. No advertising tracking is enabled without explicit consent.", es: "El sitio puede recordar preferencias funcionales como el idioma. No se activa ningún seguimiento publicitario sin consentimiento explícito.", de: "Die Website kann funktionale Einstellungen wie die Sprache speichern. Ohne ausdrückliche Zustimmung wird kein Werbetracking aktiviert.", it: "Il sito può ricordare preferenze funzionali come la lingua. Nessun tracciamento pubblicitario viene attivato senza consenso esplicito.", pt: "O site pode memorizar preferências funcionais, como o idioma. Nenhum rastreio publicitário é ativado sem consentimento explícito." },
    "Vous pouvez demander accès, rectification, effacement, limitation, opposition ou portabilité, et retirer votre consentement. Vous pouvez également saisir l’autorité de contrôle compétente.": { en: "You may request access, correction, erasure, restriction, objection or portability, and withdraw consent. You may also contact the competent supervisory authority.", es: "Puede solicitar acceso, rectificación, supresión, limitación, oposición o portabilidad y retirar su consentimiento. También puede acudir a la autoridad de control competente.", de: "Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch oder Datenübertragbarkeit verlangen und Ihre Einwilligung widerrufen. Außerdem können Sie sich an die zuständige Aufsichtsbehörde wenden.", it: "Puoi richiedere accesso, rettifica, cancellazione, limitazione, opposizione o portabilità e revocare il consenso. Puoi inoltre rivolgerti all'autorità di controllo competente.", pt: "Pode solicitar acesso, retificação, apagamento, limitação, oposição ou portabilidade e retirar o consentimento. Pode também contactar a autoridade de controlo competente." },
    "Mises à jour": { en: "Updates", es: "Actualizaciones", de: "Aktualisierungen", it: "Aggiornamenti", pt: "Atualizações" },
    "Cette politique peut évoluer avec les services PureOwner. La version publiée sur le site est la version applicable.": { en: "This policy may evolve with PureOwner services. The version published on the site applies.", es: "Esta política puede evolucionar con los servicios de PureOwner. Se aplica la versión publicada en el sitio.", de: "Diese Richtlinie kann sich mit den PureOwner-Diensten weiterentwickeln. Es gilt die auf der Website veröffentlichte Fassung.", it: "Questa informativa può evolvere con i servizi PureOwner. Si applica la versione pubblicata sul sito.", pt: "Esta política pode evoluir com os serviços da PureOwner. Aplica-se a versão publicada no site." },
    "Écrivez à contact@pureowner.com pour exercer vos droits ou poser une question relative à la confidentialité.": { en: "Email contact@pureowner.com to exercise your rights or ask a privacy question.", es: "Escriba a contact@pureowner.com para ejercer sus derechos o hacer una pregunta sobre privacidad.", de: "Schreiben Sie an contact@pureowner.com, um Ihre Rechte auszuüben oder eine Datenschutzfrage zu stellen.", it: "Scrivi a contact@pureowner.com per esercitare i tuoi diritti o porre una domanda sulla privacy.", pt: "Escreva para contact@pureowner.com para exercer os seus direitos ou colocar uma questão de privacidade." }
  };

  Object.assign(T, {
    "Vers le plus grand transfert de propriété de l'histoire.": {
      en: "Towards the greatest transfer of ownership in history.",
      es: "Hacia la mayor transferencia de propiedad de la historia.",
      de: "Auf dem Weg zum größten Eigentumsübergang der Geschichte.",
      it: "Verso il più grande trasferimento di proprietà della storia.",
      pt: "Rumo à maior transferência de propriedade da história."
    },
    "Depuis 30 ans, Internet se nourrit de nos données afin de concevoir les services qui le rendent utile. La technologie permet maintenant de détenir ses données personnelles d'une manière cryptée. Les infrastructures adéquates commençant à prendre forme, tout porte à croire que l'internaute souhaitera être autonome pour tout ou partie de son expérience.": {
      en: "For 30 years, the Internet has relied on our data to design the services that make it useful. Technology now makes it possible to hold personal data in encrypted form. As the necessary infrastructure takes shape, users are likely to seek autonomy over all or part of their online experience.",
      es: "Durante 30 años, Internet se ha alimentado de nuestros datos para diseñar los servicios que lo hacen útil. La tecnología permite ahora conservar los datos personales de forma cifrada. A medida que se construyen las infraestructuras adecuadas, todo indica que los usuarios querrán ser autónomos en toda o parte de su experiencia.",
      de: "Seit 30 Jahren nutzt das Internet unsere Daten, um die Dienste zu entwickeln, die es nützlich machen. Heute können persönliche Daten verschlüsselt gehalten werden. Während die nötige Infrastruktur entsteht, deutet vieles darauf hin, dass Nutzer ihre digitale Erfahrung ganz oder teilweise selbst bestimmen wollen.",
      it: "Da 30 anni Internet utilizza i nostri dati per progettare i servizi che lo rendono utile. Oggi la tecnologia permette di detenere i dati personali in forma cifrata. Con la nascita delle infrastrutture necessarie, è probabile che gli utenti desiderino essere autonomi in tutta o parte della propria esperienza.",
      pt: "Há 30 anos, a Internet utiliza os nossos dados para conceber os serviços que a tornam útil. A tecnologia permite agora guardar dados pessoais de forma encriptada. À medida que surgem as infraestruturas adequadas, tudo indica que os utilizadores procurarão autonomia sobre toda ou parte da sua experiência."
    },
    "Comment est-ce possible ?": { en: "How is this possible?", es: "¿Cómo es posible?", de: "Wie ist das möglich?", it: "Com'è possibile?", pt: "Como é possível?" },
    "D'un côté, Internet a évolué du Web1 vers le Web2 pour connecter les personnes et multiplier les services. De l'autre, la finance décentralisée a rendu les actifs numériques possédables. Leur addition rend possible une infrastructure commune : le Web3.": {
      en: "On one side, the Internet evolved from Web1 to Web2 to connect people and multiply services. On the other, decentralized finance made digital assets ownable. Together, these developments make a shared infrastructure possible: Web3.",
      es: "Por un lado, Internet evolucionó de la Web1 a la Web2 para conectar a las personas y multiplicar los servicios. Por otro, las finanzas descentralizadas hicieron posible poseer activos digitales. Su combinación hace posible una infraestructura común: la Web3.",
      de: "Auf der einen Seite entwickelte sich das Internet vom Web1 zum Web2, um Menschen zu verbinden und Dienste zu vervielfachen. Auf der anderen Seite machte die dezentrale Finanzwelt digitale Vermögenswerte besitzbar. Gemeinsam ermöglichen beide Entwicklungen eine gemeinsame Infrastruktur: Web3.",
      it: "Da un lato, Internet si è evoluto dal Web1 al Web2 per collegare le persone e moltiplicare i servizi. Dall'altro, la finanza decentralizzata ha reso possedibili gli asset digitali. La loro combinazione rende possibile un'infrastruttura comune: il Web3.",
      pt: "Por um lado, a Internet evoluiu da Web1 para a Web2 para ligar pessoas e multiplicar serviços. Por outro, as finanças descentralizadas tornaram os ativos digitais possuíveis. A combinação das duas evoluções torna possível uma infraestrutura comum: a Web3."
    },
    "Ceux qui en avaient déduit la rareté avant les autres en sont sortis grandis financièrement.": {
      en: "Those who recognized their scarcity before others benefited financially.",
      es: "Quienes comprendieron su escasez antes que los demás obtuvieron una ventaja financiera.",
      de: "Wer ihre Knappheit früher als andere erkannte, profitierte finanziell.",
      it: "Chi ne ha compreso la scarsità prima degli altri ne ha tratto un vantaggio economico.",
      pt: "Quem compreendeu a sua escassez antes dos outros obteve uma vantagem financeira."
    },
    "C'est à tâtons que l'on découvre le business model d'Internet.": {
      en: "The Internet's business model was discovered through trial and error.",
      es: "El modelo de negocio de Internet se descubrió mediante ensayo y error.",
      de: "Das Geschäftsmodell des Internets entstand durch Versuch und Irrtum.",
      it: "Il modello economico di Internet è stato scoperto per tentativi.",
      pt: "O modelo de negócio da Internet foi descoberto por tentativa e erro."
    },
    "L'offre de services s'est développée grâce à nos données personnelles.": {
      en: "The range of services grew through the use of our personal data.",
      es: "La oferta de servicios creció gracias al uso de nuestros datos personales.",
      de: "Das Dienstleistungsangebot wuchs durch die Nutzung unserer persönlichen Daten.",
      it: "L'offerta di servizi è cresciuta grazie all'uso dei nostri dati personali.",
      pt: "A oferta de serviços cresceu graças à utilização dos nossos dados pessoais."
    },
    "Par peur de manquer de place, les extensions de type .machin se sont ouvertes.": {
      en: "To avoid running out of space, new extensions such as .example were opened.",
      es: "Para evitar la falta de espacio, se abrieron nuevas extensiones como .ejemplo.",
      de: "Um Platzmangel zu vermeiden, wurden neue Endungen wie .beispiel eingeführt.",
      it: "Per evitare di esaurire lo spazio, sono state aperte nuove estensioni come .esempio.",
      pt: "Para evitar a falta de espaço, foram abertas novas extensões como .exemplo."
    },
    "La plupart des services devant se payer en ligne, il devenait difficile d'exister sans établissement bancaire.": {
      en: "As most services had to be paid for online, it became difficult to participate without a bank.",
      es: "Como la mayoría de los servicios debían pagarse en línea, resultaba difícil participar sin un banco.",
      de: "Da die meisten Dienste online bezahlt werden mussten, war eine Teilnahme ohne Bank kaum möglich.",
      it: "Poiché la maggior parte dei servizi doveva essere pagata online, era difficile partecipare senza una banca.",
      pt: "Como a maioria dos serviços tinha de ser paga online, tornou-se difícil participar sem um banco."
    },
    "L'objectif de Bitcoin, créer une monnaie peer-to-peer, a engendré un système décentralisé.": {
      en: "Bitcoin's goal of creating peer-to-peer money gave rise to a decentralized system.",
      es: "El objetivo de Bitcoin de crear dinero entre pares dio origen a un sistema descentralizado.",
      de: "Das Ziel von Bitcoin, Peer-to-Peer-Geld zu schaffen, führte zu einem dezentralen System.",
      it: "L'obiettivo di Bitcoin, creare denaro peer-to-peer, ha dato origine a un sistema decentralizzato.",
      pt: "O objetivo da Bitcoin de criar dinheiro peer-to-peer deu origem a um sistema descentralizado."
    },
    "Ce même système permettant la possession a été étendu à tous les actifs numériques.": {
      en: "The same ownership mechanism was extended to other digital assets.",
      es: "El mismo mecanismo de propiedad se extendió a otros activos digitales.",
      de: "Derselbe Eigentumsmechanismus wurde auf weitere digitale Vermögenswerte ausgeweitet.",
      it: "Lo stesso meccanismo di proprietà è stato esteso ad altri asset digitali.",
      pt: "O mesmo mecanismo de propriedade foi alargado a outros ativos digitais."
    },
    "Addition": { en: "Addition", es: "Suma", de: "Addition", it: "Somma", pt: "Adição" },
    "Leur addition rend possible": { en: "Together they make possible", es: "Juntas hacen posible", de: "Gemeinsam ermöglichen sie", it: "Insieme rendono possibile", pt: "Juntas tornam possível" },
    "Infrastructure résultante": { en: "Resulting infrastructure", es: "Infraestructura resultante", de: "Daraus entstehende Infrastruktur", it: "Infrastruttura risultante", pt: "Infraestrutura resultante" },
    "Le Web3 prolonge le Web2 en associant ses services à des actifs et des identités que l'utilisateur peut posséder. Les termes Web1, Web2 et Web3 désignent les étapes successives de cette évolution du Web, et non trois Internets séparés.": {
      en: "Web3 extends Web2 by linking its services to assets and identities that users can own. The terms Web1, Web2 and Web3 describe successive stages in the Web's evolution, not three separate Internets.",
      es: "La Web3 prolonga la Web2 al vincular sus servicios con activos e identidades que el usuario puede poseer. Los términos Web1, Web2 y Web3 designan etapas sucesivas de la evolución de la Web, no tres Internets separados.",
      de: "Web3 erweitert Web2, indem es dessen Dienste mit Vermögenswerten und Identitäten verbindet, die Nutzer besitzen können. Die Begriffe Web1, Web2 und Web3 bezeichnen aufeinanderfolgende Entwicklungsstufen des Webs und nicht drei getrennte Internets.",
      it: "Il Web3 estende il Web2 associando i suoi servizi ad asset e identità che l'utente può possedere. I termini Web1, Web2 e Web3 indicano fasi successive dell'evoluzione del Web, non tre Internet separati.",
      pt: "A Web3 prolonga a Web2 ao associar os seus serviços a ativos e identidades que o utilizador pode possuir. Os termos Web1, Web2 e Web3 designam etapas sucessivas da evolução da Web, e não três Internets separadas."
    },
    "Sites Internet": { en: "Websites", es: "Sitios web", de: "Websites", it: "Siti web", pt: "Sites" },
    "Identité": { en: "Identity", es: "Identidad", de: "Identität", it: "Identità", pt: "Identidade" },
    "Droits & propriété": { en: "Rights & ownership", es: "Derechos y propiedad", de: "Rechte & Eigentum", it: "Diritti e proprietà", pt: "Direitos e propriedade" },
    "Services Web2": { en: "Web2 services", es: "Servicios Web2", de: "Web2-Dienste", it: "Servizi Web2", pt: "Serviços Web2" },
    "Certifications": { en: "Certifications", es: "Certificaciones", de: "Zertifizierungen", it: "Certificazioni", pt: "Certificações" },
    "Internet apporte les usages. La finance décentralisée apporte la propriété. Le Web3 réunit les deux.": {
      en: "The Internet provides the uses. Decentralized finance provides ownership. Web3 brings both together.",
      es: "Internet aporta los usos. Las finanzas descentralizadas aportan la propiedad. La Web3 reúne ambos.",
      de: "Das Internet liefert die Anwendungen. Dezentrale Finanzen liefern das Eigentum. Web3 führt beides zusammen.",
      it: "Internet offre gli usi. La finanza decentralizzata offre la proprietà. Il Web3 riunisce entrambi.",
      pt: "A Internet traz as utilizações. As finanças descentralizadas trazem a propriedade. A Web3 reúne ambas."
    },
    "Premier torrent": { en: "First stream", es: "Primera corriente", de: "Erster Strom", it: "Primo flusso", pt: "Primeira corrente" },
    "Deuxième torrent": { en: "Second stream", es: "Segunda corriente", de: "Zweiter Strom", it: "Secondo flusso", pt: "Segunda corrente" },
    "Troisième torrent": { en: "Third stream", es: "Tercera corriente", de: "Dritter Strom", it: "Terzo flusso", pt: "Terceira corrente" },
    "Comme l'a démontré Bitcoin, la rareté est un puissant moteur. Elle le devient davantage encore lorsque chaque bien est unique.": {
      en: "As Bitcoin has shown, scarcity is a powerful driver. It becomes even more compelling when every asset is unique.", es: "Como ha demostrado Bitcoin, la escasez es un potente motor. Lo es aún más cuando cada activo es único.", de: "Wie Bitcoin gezeigt hat, ist Knappheit ein starker Antrieb. Sie wird noch bedeutsamer, wenn jeder Vermögenswert einzigartig ist.", it: "Come ha dimostrato Bitcoin, la rarità è un potente motore. Lo diventa ancora di più quando ogni bene è unico.", pt: "Como a Bitcoin demonstrou, a escassez é um poderoso motor. Torna-se ainda mais relevante quando cada ativo é único."
    },
    "Quoi de plus stimulant que d'acquérir un actif dont vous savez que vous serez l'unique propriétaire ?": {
      en: "What could be more exciting than acquiring an asset you know you will own exclusively?", es: "¿Qué puede ser más estimulante que adquirir un activo del que sabe que será el único propietario?", de: "Was könnte reizvoller sein, als einen Vermögenswert zu erwerben, dessen alleiniger Eigentümer Sie sein werden?", it: "Che cosa c'è di più stimolante dell'acquisire un bene di cui sapete che sarete l'unico proprietario?", pt: "O que pode ser mais estimulante do que adquirir um ativo do qual sabe que será o único proprietário?"
    },
    "Les premiers NFT, faute d'autres contenus, ont porté sur des œuvres d'art vendues à des prix fous. Était-ce vraiment l'art que les acquéreurs recherchaient ?": {
      en: "With few other forms of content available, the first NFTs featured artworks sold at astonishing prices. Was art really what buyers were seeking?", es: "A falta de otros contenidos, los primeros NFT fueron obras de arte vendidas a precios desorbitados. ¿Era realmente el arte lo que buscaban los compradores?", de: "Mangels anderer Inhalte bestanden die ersten NFTs aus Kunstwerken, die zu erstaunlichen Preisen verkauft wurden. Suchten die Käufer wirklich die Kunst?", it: "In mancanza di altri contenuti, i primi NFT hanno riguardato opere d'arte vendute a prezzi folli. Era davvero l'arte ciò che cercavano gli acquirenti?", pt: "Na falta de outros conteúdos, os primeiros NFT incidiram sobre obras de arte vendidas a preços extraordinários. Era realmente a arte que os compradores procuravam?"
    },
    "Les identités numériques Web3.": { en: "Web3 digital identities.", es: "Las identidades digitales Web3.", de: "Digitale Web3-Identitäten.", it: "Le identità digitali Web3.", pt: "As identidades digitais Web3." },
    "Plus qu'une tendance, cette évolution suit l'ordre naturel des choses.": {
      en: "More than a trend, this evolution follows the natural course of things.", es: "Más que una tendencia, esta evolución sigue el curso natural de las cosas.", de: "Mehr als ein Trend folgt diese Entwicklung dem natürlichen Lauf der Dinge.", it: "Più che una tendenza, questa evoluzione segue il corso naturale delle cose.", pt: "Mais do que uma tendência, esta evolução segue o curso natural das coisas."
    },
    "Une nouvelle infrastructure se construit et pourrait rapidement devenir un standard.": {
      en: "A new infrastructure is taking shape and could quickly become a standard.", es: "Se está construyendo una nueva infraestructura que podría convertirse rápidamente en un estándar.", de: "Eine neue Infrastruktur entsteht und könnte sich schnell zum Standard entwickeln.", it: "Sta nascendo una nuova infrastruttura che potrebbe diventare rapidamente uno standard.", pt: "Está a ser construída uma nova infraestrutura que poderá rapidamente tornar-se um padrão."
    },
    "Les États tokenisent déjà certains actifs, tandis que le stockage d'actifs numériques se développe : plusieurs évolutions majeures d'Internet convergent désormais.": {
      en: "Governments are already tokenizing certain assets while digital asset custody continues to grow: several major Internet developments are now converging.", es: "Los Estados ya tokenizan ciertos activos mientras se desarrolla la custodia de activos digitales: varias grandes evoluciones de Internet convergen ahora.", de: "Staaten tokenisieren bereits bestimmte Vermögenswerte, während die Verwahrung digitaler Assets wächst: Mehrere bedeutende Entwicklungen des Internets laufen nun zusammen.", it: "Gli Stati stanno già tokenizzando alcuni beni, mentre la custodia degli asset digitali si sviluppa: diverse grandi evoluzioni di Internet stanno convergendo.", pt: "Os Estados já tokenizam determinados ativos, enquanto a custódia de ativos digitais se desenvolve: várias evoluções importantes da Internet estão agora a convergir."
    },
    "L'intérêt du Web3 : prouver sans tout transmettre.": {
      en: "The value of Web3: prove without sharing everything.", es: "El valor de Web3: demostrar sin transmitirlo todo.", de: "Der Vorteil von Web3: nachweisen, ohne alles weiterzugeben.", it: "Il valore del Web3: dimostrare senza trasmettere tutto.", pt: "O valor da Web3: provar sem transmitir tudo."
    },
    "Un actif numérique peut devenir une preuve portable. L'application vérifie ce qui est nécessaire, sans forcément conserver une copie complète de vos données.": {
      en: "A digital asset can become portable proof. The application verifies what it needs without necessarily retaining a complete copy of your data.",
      es: "Un activo digital puede convertirse en una prueba portátil. La aplicación verifica lo necesario sin conservar necesariamente una copia completa de sus datos.",
      de: "Ein digitaler Vermögenswert kann zu einem tragbaren Nachweis werden. Die Anwendung prüft das Nötige, ohne zwingend eine vollständige Kopie Ihrer Daten zu speichern.",
      it: "Un asset digitale può diventare una prova portabile. L'applicazione verifica ciò che serve senza dover conservare una copia completa dei dati.",
      pt: "Um ativo digital pode tornar-se uma prova portátil. A aplicação verifica o necessário sem ter de guardar uma cópia completa dos seus dados."
    },
    "Chaque service vous demande de transmettre ses propres copies.": {
      en: "Each service asks you to submit its own copies.", es: "Cada servicio le pide que entregue sus propias copias.", de: "Jeder Dienst verlangt eigene Kopien Ihrer Informationen.", it: "Ogni servizio vi chiede di inviare le proprie copie.", pt: "Cada serviço pede que entregue as suas próprias cópias."
    },
    "Identité, adresse, justificatifs": { en: "Identity, address, supporting documents", es: "Identidad, dirección, justificantes", de: "Identität, Adresse, Nachweise", it: "Identità, indirizzo, documenti", pt: "Identidade, morada, comprovativos" },
    "Diplômes, abonnements, accès": { en: "Diplomas, memberships, access", es: "Títulos, suscripciones, accesos", de: "Abschlüsse, Abonnements, Zugänge", it: "Diplomi, abbonamenti, accessi", pt: "Diplomas, subscrições, acessos" },
    "Coordonnées bancaires": { en: "Bank details", es: "Datos bancarios", de: "Bankverbindung", it: "Coordinate bancarie", pt: "Dados bancários" },
    "Données stockées dans plusieurs bases": { en: "Data stored in multiple databases", es: "Datos almacenados en varias bases", de: "Daten in mehreren Datenbanken", it: "Dati archiviati in più database", pt: "Dados guardados em várias bases" },
    "Avec une logique Web3": { en: "With a Web3 approach", es: "Con una lógica Web3", de: "Mit einem Web3-Ansatz", it: "Con una logica Web3", pt: "Com uma lógica Web3" },
    "Vos informations ou droits sont rattachés à un actif que vous contrôlez dans votre wallet.": {
      en: "Your information or rights are attached to an asset you control in your wallet.", es: "Su información o sus derechos se vinculan a un activo que controla en su wallet.", de: "Ihre Informationen oder Rechte sind mit einem Vermögenswert verknüpft, den Sie in Ihrem Wallet kontrollieren.", it: "Le vostre informazioni o i vostri diritti sono collegati a un asset controllato nel wallet.", pt: "As suas informações ou direitos ficam associados a um ativo que controla na sua wallet."
    },
    "Identité vérifiée": { en: "Verified identity", es: "Identidad verificada", de: "Verifizierte Identität", it: "Identità verificata", pt: "Identidade verificada" },
    "Carte de membre ou abonnement": { en: "Membership card or subscription", es: "Tarjeta de miembro o suscripción", de: "Mitgliedskarte oder Abonnement", it: "Tessera o abbonamento", pt: "Cartão de membro ou subscrição" },
    "Diplôme ou certificat professionnel": { en: "Diploma or professional certificate", es: "Título o certificado profesional", de: "Abschluss oder Berufszertifikat", it: "Diploma o certificato professionale", pt: "Diploma ou certificado profissional" },
    "Billet, licence ou droit d'accès": { en: "Ticket, license or access right", es: "Entrada, licencia o derecho de acceso", de: "Ticket, Lizenz oder Zugangsrecht", it: "Biglietto, licenza o diritto di accesso", pt: "Bilhete, licença ou direito de acesso" },
    "Exemple simple": { en: "Simple example", es: "Ejemplo sencillo", de: "Einfaches Beispiel", it: "Esempio semplice", pt: "Exemplo simples" },
    "Ce wallet détient-il un certificat professionnel valide ?": {
      en: "Does this wallet hold a valid professional certificate?", es: "¿Posee este wallet un certificado profesional válido?", de: "Enthält dieses Wallet ein gültiges Berufszertifikat?", it: "Questo wallet contiene un certificato professionale valido?", pt: "Esta wallet possui um certificado profissional válido?"
    },
    "Réponse possible": { en: "Possible answer", es: "Respuesta posible", de: "Mögliche Antwort", it: "Possibile risposta", pt: "Resposta possível" },
    "Oui, le certificat est valide. La plateforme n'a pas nécessairement besoin de télécharger ni de conserver le document complet.": {
      en: "Yes, the certificate is valid. The platform does not necessarily need to download or retain the complete document.", es: "Sí, el certificado es válido. La plataforma no necesita necesariamente descargar ni conservar el documento completo.", de: "Ja, das Zertifikat ist gültig. Die Plattform muss das vollständige Dokument nicht unbedingt herunterladen oder speichern.", it: "Sì, il certificato è valido. La piattaforma non deve necessariamente scaricare o conservare il documento completo.", pt: "Sim, o certificado é válido. A plataforma não precisa necessariamente de descarregar ou guardar o documento completo."
    },
    "Preuve": { en: "Proof", es: "Prueba", de: "Nachweis", it: "Prova", pt: "Prova" },
    "Accord": { en: "Consent", es: "Consentimiento", de: "Zustimmung", it: "Consenso", pt: "Consentimento" },
    "Donnée minimale": { en: "Minimum data", es: "Dato mínimo", de: "Minimale Daten", it: "Dato minimo", pt: "Dado mínimo" },
    "L'actif reste chez son propriétaire": { en: "The asset stays with its owner", es: "El activo permanece con su propietario", de: "Der Vermögenswert bleibt beim Eigentümer", it: "L'asset resta al proprietario", pt: "O ativo permanece com o proprietário" },
    "Vos données ne circulent plus systématiquement d'application en application. Les services viennent vérifier ce dont ils ont besoin, avec votre accord, plutôt que de devenir chacun propriétaire d'une nouvelle copie.": {
      en: "Your data no longer moves automatically from app to app. With your consent, services verify what they need instead of each retaining a new copy.", es: "Sus datos dejan de circular sistemáticamente de una aplicación a otra. Con su consentimiento, los servicios verifican lo necesario en lugar de conservar cada uno una nueva copia.", de: "Ihre Daten wandern nicht mehr automatisch von Anwendung zu Anwendung. Mit Ihrer Zustimmung prüfen Dienste das Nötige, statt jeweils eine neue Kopie zu speichern.", it: "I dati non passano più automaticamente da un'applicazione all'altra. Con il vostro consenso, i servizi verificano ciò che serve invece di conservarne ciascuno una nuova copia.", pt: "Os seus dados deixam de circular automaticamente entre aplicações. Com o seu consentimento, os serviços verificam o necessário em vez de guardarem cada um uma nova cópia."
    },
    "Comme un document conservé dans un coffre personnel : vous ouvrez une fenêtre limitée, au lieu de donner une photocopie permanente.": {
      en: "Like a document kept in a personal vault: you open a limited window instead of handing over a permanent copy.", es: "Como un documento guardado en una caja fuerte personal: abre una ventana limitada en lugar de entregar una copia permanente.", de: "Wie ein Dokument im persönlichen Tresor: Sie öffnen ein begrenztes Fenster, statt eine dauerhafte Kopie abzugeben.", it: "Come un documento custodito in una cassaforte personale: si apre una finestra limitata invece di consegnare una copia permanente.", pt: "Como um documento guardado num cofre pessoal: abre uma janela limitada em vez de entregar uma cópia permanente."
    },
    "Une nuance essentielle": { en: "An essential nuance", es: "Un matiz esencial", de: "Eine wesentliche Nuance", it: "Una precisazione essenziale", pt: "Uma nuance essencial" },
    "Une blockchain publique ne rend pas automatiquement les données privées. Les données personnelles sensibles ne doivent pas être inscrites directement en clair.": {
      en: "A public blockchain does not automatically make data private. Sensitive personal data must not be written directly in plain text.", es: "Una blockchain pública no convierte automáticamente los datos en privados. Los datos personales sensibles no deben registrarse directamente en texto claro.", de: "Eine öffentliche Blockchain macht Daten nicht automatisch privat. Sensible personenbezogene Daten dürfen nicht direkt im Klartext gespeichert werden.", it: "Una blockchain pubblica non rende automaticamente privati i dati. I dati personali sensibili non devono essere registrati direttamente in chiaro.", pt: "Uma blockchain pública não torna os dados automaticamente privados. Os dados pessoais sensíveis não devem ser registados diretamente em texto simples."
    },
    "Preuves cryptographiques": { en: "Cryptographic proofs", es: "Pruebas criptográficas", de: "Kryptografische Nachweise", it: "Prove crittografiche", pt: "Provas criptográficas" },
    "Attestations vérifiables": { en: "Verifiable credentials", es: "Credenciales verificables", de: "Überprüfbare Nachweise", it: "Attestazioni verificabili", pt: "Credenciais verificáveis" },
    "Autorisations limitées": { en: "Limited permissions", es: "Permisos limitados", de: "Begrenzte Berechtigungen", it: "Autorizzazioni limitate", pt: "Autorizações limitadas" },
    "Données chiffrées": { en: "Encrypted data", es: "Datos cifrados", de: "Verschlüsselte Daten", it: "Dati cifrati", pt: "Dados encriptados" },
    "Divulgation sélective": { en: "Selective disclosure", es: "Divulgación selectiva", de: "Selektive Offenlegung", it: "Divulgazione selettiva", pt: "Divulgação seletiva" },
    "Le véritable avantage : une preuve portable.": { en: "The real advantage: portable proof.", es: "La verdadera ventaja: una prueba portátil.", de: "Der eigentliche Vorteil: ein tragbarer Nachweis.", it: "Il vero vantaggio: una prova portabile.", pt: "A verdadeira vantagem: uma prova portátil." },
    "L'utilisateur conserve l'original. Les applications vérifient les preuves. Et l'accès aux informations peut être limité à ce qui est strictement nécessaire.": {
      en: "The user keeps the original. Applications verify the proofs. Access to information can be limited to what is strictly necessary.", es: "El usuario conserva el original. Las aplicaciones verifican las pruebas. El acceso a la información puede limitarse a lo estrictamente necesario.", de: "Der Nutzer behält das Original. Anwendungen prüfen die Nachweise. Der Informationszugriff kann auf das absolut Notwendige beschränkt werden.", it: "L'utente conserva l'originale. Le applicazioni verificano le prove. L'accesso alle informazioni può essere limitato allo stretto necessario.", pt: "O utilizador conserva o original. As aplicações verificam as provas. O acesso à informação pode limitar-se ao estritamente necessário."
    },
    "Acheter, revendre ou faire estimer un nom rare : la propriété numérique devient un parcours accompagné.": {
      en: "Buy, resell or value a rare name: digital ownership becomes a guided journey.", es: "Comprar, revender o valorar un nombre raro: la propiedad digital se convierte en un recorrido acompañado.", de: "Einen seltenen Namen kaufen, weiterverkaufen oder bewerten lassen: Digitales Eigentum wird zum begleiteten Weg.", it: "Acquistare, rivendere o valutare un nome raro: la proprietà digitale diventa un percorso guidato.", pt: "Comprar, revender ou avaliar um nome raro: a propriedade digital torna-se um percurso acompanhado."
    },
    "Découvrez les domaines disponibles.": { en: "Discover available domains.", es: "Descubra los dominios disponibles.", de: "Entdecken Sie verfügbare Domains.", it: "Scoprite i domini disponibili.", pt: "Descubra os domínios disponíveis." },
    "Voir les noms": { en: "View names", es: "Ver nombres", de: "Namen ansehen", it: "Vedi i nomi", pt: "Ver nomes" },
    "Vous possédez un domaine ? Publiez-le.": { en: "Own a domain? List it.", es: "¿Posee un dominio? Publíquelo.", de: "Sie besitzen eine Domain? Bieten Sie sie an.", it: "Possedete un dominio? Pubblicatelo.", pt: "Possui um domínio? Publique-o." },
    "Proposer un nom": { en: "List a name", es: "Proponer un nombre", de: "Namen anbieten", it: "Proponi un nome", pt: "Propor um nome" },
    "Faire estimer": { en: "Get a valuation", es: "Solicitar una valoración", de: "Bewerten lassen", it: "Richiedi una valutazione", pt: "Pedir uma avaliação" },
    "Vous pensez posséder un nom rare ? Nous pouvons l'évaluer.": { en: "Think you own a rare name? We can value it.", es: "¿Cree que posee un nombre raro? Podemos valorarlo.", de: "Sie besitzen möglicherweise einen seltenen Namen? Wir können ihn bewerten.", it: "Pensate di possedere un nome raro? Possiamo valutarlo.", pt: "Pensa possuir um nome raro? Podemos avaliá-lo." },
    "Demander un avis": { en: "Request an opinion", es: "Pedir una opinión", de: "Einschätzung anfragen", it: "Richiedi un parere", pt: "Pedir uma opinião" },
    "PureOwner ne se limite pas à afficher des noms. Nous aidons à construire une stratégie de propriété numérique.": {
      en: "PureOwner does more than display names. We help build a digital ownership strategy.", es: "PureOwner no se limita a mostrar nombres. Ayudamos a construir una estrategia de propiedad digital.", de: "PureOwner zeigt nicht nur Namen. Wir helfen beim Aufbau einer Strategie für digitales Eigentum.", it: "PureOwner non si limita a mostrare nomi. Aiutiamo a costruire una strategia di proprietà digitale.", pt: "A PureOwner não se limita a mostrar nomes. Ajudamos a construir uma estratégia de propriedade digital."
    },
    "Recherche stratégique de domaines": { en: "Strategic domain research", es: "Búsqueda estratégica de dominios", de: "Strategische Domainrecherche", it: "Ricerca strategica di domini", pt: "Pesquisa estratégica de domínios" },
    "Constitution d'un portefeuille": { en: "Portfolio building", es: "Creación de una cartera", de: "Portfolioaufbau", it: "Costruzione di un portafoglio", pt: "Construção de um portefólio" },
    "Création de votre identité Web3": { en: "Creation of your Web3 identity", es: "Creación de su identidad Web3", de: "Aufbau Ihrer Web3-Identität", it: "Creazione della vostra identità Web3", pt: "Criação da sua identidade Web3" },
    "Création de votre site": { en: "Website creation", es: "Creación de su sitio", de: "Erstellung Ihrer Website", it: "Creazione del vostro sito", pt: "Criação do seu site" },
    "Intégration DNS": { en: "DNS integration", es: "Integración DNS", de: "DNS-Integration", it: "Integrazione DNS", pt: "Integração DNS" },
    "Configuration wallet": { en: "Wallet setup", es: "Configuración del wallet", de: "Wallet-Einrichtung", it: "Configurazione del wallet", pt: "Configuração da wallet" },
    "Formation": { en: "Training", es: "Formación", de: "Schulung", it: "Formazione", pt: "Formação" },
    "Audit de portefeuille": { en: "Portfolio audit", es: "Auditoría de cartera", de: "Portfolio-Audit", it: "Audit del portafoglio", pt: "Auditoria de portefólio" },
    "Valorisation d'actifs numériques": { en: "Digital asset valuation", es: "Valoración de activos digitales", de: "Bewertung digitaler Vermögenswerte", it: "Valutazione di asset digitali", pt: "Avaliação de ativos digitais" },
    "Nos acquisitions pour votre inspiration": { en: "Our acquisitions for your inspiration", es: "Nuestras adquisiciones para inspirarle", de: "Unsere Erwerbungen als Inspiration", it: "Le nostre acquisizioni per ispirarvi", pt: "As nossas aquisições para sua inspiração" },
    "Il est plus intéressant d'être marchand de biens numériques qu'un simple intermédiaire.": {
      en: "It is more compelling to trade digital property than to remain a simple intermediary.", es: "Es más interesante comerciar con bienes digitales que ser un simple intermediario.", de: "Der Handel mit digitalem Eigentum ist interessanter als die Rolle eines bloßen Vermittlers.", it: "È più interessante commerciare beni digitali che essere un semplice intermediario.", pt: "É mais interessante comercializar bens digitais do que ser um simples intermediário."
    },
    "Chargement de la collection...": { en: "Loading the collection...", es: "Cargando la colección...", de: "Sammlung wird geladen...", it: "Caricamento della collezione...", pt: "A carregar a coleção..." },
    "Au début d'Internet, chacun a créé son adresse email. Hier, chacun possédait un numéro de téléphone. Demain, chacun possédera son identité numérique.": {
      en: "At the beginning of the Internet, everyone created an email address. Yesterday, everyone had a phone number. Tomorrow, everyone will own a digital identity.", es: "Al inicio de Internet, todos crearon una dirección de correo electrónico. Ayer, todos tenían un número de teléfono. Mañana, todos poseerán una identidad digital.", de: "Zu Beginn des Internets legte jeder eine E-Mail-Adresse an. Gestern besaß jeder eine Telefonnummer. Morgen wird jeder eine digitale Identität besitzen.", it: "All'inizio di Internet, tutti hanno creato un indirizzo email. Ieri, tutti avevano un numero di telefono. Domani, tutti possiederanno un'identità digitale.", pt: "No início da Internet, todos criaram um endereço de email. Ontem, todos tinham um número de telefone. Amanhã, todos possuirão uma identidade digital."
    },
    "PureOwner a pour objectif de faire de cette avancée votre standard.": {
      en: "PureOwner aims to make this advancement your standard.", es: "PureOwner quiere convertir este avance en su estándar.", de: "PureOwner möchte diesen Fortschritt zu Ihrem Standard machen.", it: "PureOwner vuole rendere questo progresso il vostro standard.", pt: "A PureOwner pretende tornar este avanço o seu padrão."
    },
    "Prêt": { en: "Ready", es: "Listo", de: "Bereit", it: "Pronto", pt: "Pronto" },
    "En direct": { en: "Live", es: "En directo", de: "Live", it: "In diretta", pt: "Ao vivo" },
    "Pause": { en: "Paused", es: "Pausa", de: "Pause", it: "Pausa", pt: "Pausa" },
    "Connexion": { en: "Connecting", es: "Conectando", de: "Verbindung", it: "Connessione", pt: "Ligação" },
    "Indisponible": { en: "Unavailable", es: "No disponible", de: "Nicht verfügbar", it: "Non disponibile", pt: "Indisponível" },
    "Volume de la radio": { en: "Radio volume", es: "Volumen de la radio", de: "Radiolautstärke", it: "Volume della radio", pt: "Volume da rádio" },
    "Lancer la radio": { en: "Play radio", es: "Iniciar la radio", de: "Radio starten", it: "Avvia la radio", pt: "Iniciar a rádio" },
    "Couper le son": { en: "Mute", es: "Silenciar", de: "Stummschalten", it: "Disattiva audio", pt: "Silenciar" },
    "Rétablir le son": { en: "Unmute", es: "Restablecer el sonido", de: "Ton einschalten", it: "Riattiva audio", pt: "Repor o som" },
    "Mettre la radio en pause": { en: "Pause radio", es: "Pausar la radio", de: "Radio pausieren", it: "Metti in pausa la radio", pt: "Pausar a rádio" },
    "Illustration d'une carte d'identité numérique avec QR code": { en: "Illustration of a digital identity card with QR code", es: "Ilustración de una tarjeta de identidad digital con código QR", de: "Illustration einer digitalen Identitätskarte mit QR-Code", it: "Illustrazione di una carta d'identità digitale con codice QR", pt: "Ilustração de um cartão de identidade digital com código QR" },
    "PureOwner accueil": { en: "PureOwner home", es: "Inicio de PureOwner", de: "PureOwner Startseite", it: "Home PureOwner", pt: "Início PureOwner" },
    "Choisir une langue": { en: "Choose a language", es: "Elegir un idioma", de: "Sprache wählen", it: "Scegli una lingua", pt: "Escolher um idioma" },
    "Navigation latérale": { en: "Side navigation", es: "Navegación lateral", de: "Seitennavigation", it: "Navigazione laterale", pt: "Navegação lateral" },
    "Introduction": { en: "Introduction", es: "Introducción", de: "Einführung", it: "Introduzione", pt: "Introdução" },
    "État des lieux": { en: "Current landscape", es: "Situación actual", de: "Aktueller Stand", it: "Stato attuale", pt: "Situação atual" },
    "Confluence entre Internet et finance": { en: "Convergence of the Internet and finance", es: "Convergencia entre Internet y finanzas", de: "Konvergenz von Internet und Finanzwelt", it: "Convergenza tra Internet e finanza", pt: "Convergência entre Internet e finanças" },
    "Les trois torrents": { en: "The three streams", es: "Las tres corrientes", de: "Die drei Ströme", it: "I tre flussi", pt: "As três correntes" },
    "Usages Web3": { en: "Web3 uses", es: "Usos Web3", de: "Web3-Anwendungen", it: "Usi Web3", pt: "Usos Web3" },
    "Rareté des noms": { en: "Name scarcity", es: "Escasez de nombres", de: "Knappheit von Namen", it: "Scarsità dei nomi", pt: "Escassez de nomes" },
    "Centre d'apprentissage": { en: "Learning center", es: "Centro de aprendizaje", de: "Lernzentrum", it: "Centro di apprendimento", pt: "Centro de aprendizagem" },
    "Accompagnement PureOwner": { en: "PureOwner guidance", es: "Acompañamiento PureOwner", de: "PureOwner Begleitung", it: "Supporto PureOwner", pt: "Acompanhamento PureOwner" },
    "Réserver votre nom": { en: "Reserve your name", es: "Reservar su nombre", de: "Ihren Namen reservieren", it: "Prenota il tuo nome", pt: "Reservar o seu nome" },
    "Filtrer par catégorie": { en: "Filter by category", es: "Filtrar por categoría", de: "Nach Kategorie filtern", it: "Filtra per categoria", pt: "Filtrar por categoria" },
    "Conclusion": { en: "Conclusion", es: "Conclusión", de: "Fazit", it: "Conclusione", pt: "Conclusão" },
    "Ouvrir la radio": { en: "Open radio", es: "Abrir la radio", de: "Radio öffnen", it: "Apri la radio", pt: "Abrir a rádio" },
    "Lecteur Ibiza Global Radio": { en: "Ibiza Global Radio player", es: "Reproductor Ibiza Global Radio", de: "Ibiza Global Radio Player", it: "Lettore Ibiza Global Radio", pt: "Leitor Ibiza Global Radio" },
    "Réduire": { en: "Minimize", es: "Minimizar", de: "Minimieren", it: "Riduci", pt: "Minimizar" },
    "Derniers titres": { en: "Recent tracks", es: "Últimos temas", de: "Letzte Titel", it: "Ultimi brani", pt: "Faixas recentes" },
    "Derniers titres et favoris": { en: "Recent tracks and favorites", es: "Últimos temas y favoritos", de: "Letzte Titel und Favoriten", it: "Ultimi brani e preferiti", pt: "Faixas recentes e favoritos" },
    "Historique indisponible": { en: "History unavailable", es: "Historial no disponible", de: "Verlauf nicht verfügbar", it: "Cronologia non disponibile", pt: "Histórico indisponível" },
    "En attente des données radio": { en: "Waiting for radio data", es: "Esperando datos de la radio", de: "Warten auf Radiodaten", it: "In attesa dei dati radio", pt: "A aguardar dados da rádio" },
    "Afficher les derniers titres": { en: "Show recent tracks", es: "Mostrar los últimos temas", de: "Letzte Titel anzeigen", it: "Mostra gli ultimi brani", pt: "Mostrar faixas recentes" },
    "Copier le titre en cours": { en: "Copy current track", es: "Copiar el tema actual", de: "Aktuellen Titel kopieren", it: "Copia il brano attuale", pt: "Copiar faixa atual" },
    "Ajouter le titre aux favoris": { en: "Add track to favorites", es: "Añadir el tema a favoritos", de: "Titel zu Favoriten hinzufügen", it: "Aggiungi il brano ai preferiti", pt: "Adicionar faixa aos favoritos" },
    "Retirer le titre des favoris": { en: "Remove track from favorites", es: "Quitar el tema de favoritos", de: "Titel aus Favoriten entfernen", it: "Rimuovi il brano dai preferiti", pt: "Remover faixa dos favoritos" },
    "Copier tous les favoris": { en: "Copy all favorites", es: "Copiar todos los favoritos", de: "Alle Favoriten kopieren", it: "Copia tutti i preferiti", pt: "Copiar todos os favoritos" },
    "Envoyer les favoris par e-mail": { en: "Email favorites", es: "Enviar favoritos por correo", de: "Favoriten per E-Mail senden", it: "Invia i preferiti via email", pt: "Enviar favoritos por e-mail" },
    "Ouvrir Ibiza Global TV": { en: "Open Ibiza Global TV", es: "Abrir Ibiza Global TV", de: "Ibiza Global TV öffnen", it: "Apri Ibiza Global TV", pt: "Abrir Ibiza Global TV" },
    "Actualiser la TV": { en: "Refresh TV", es: "Actualizar TV", de: "TV aktualisieren", it: "Aggiorna TV", pt: "Atualizar TV" },
    "Ouvrir la TV dans un nouvel onglet": { en: "Open TV in a new tab", es: "Abrir TV en una pestaña nueva", de: "TV in neuem Tab öffnen", it: "Apri la TV in una nuova scheda", pt: "Abrir TV num novo separador" },
    "Ouvrir le lecteur officiel": { en: "Open official player", es: "Abrir el reproductor oficial", de: "Offiziellen Player öffnen", it: "Apri il lettore ufficiale", pt: "Abrir o leitor oficial" },
    "La chaîne en direct indiquera si la diffusion est hors ligne.": { en: "The live channel will indicate if the broadcast is offline.", es: "El canal en directo indicará si la emisión está fuera de línea.", de: "Der Live-Kanal zeigt an, wenn die Übertragung offline ist.", it: "Il canale live indicherà se la trasmissione è offline.", pt: "O canal em direto indicará se a transmissão estiver offline." }
  });

  Object.assign(T, {
    "PureOwner — Marketplace .brave et guide de propriété numérique": {
      en: "PureOwner — .brave marketplace and digital ownership guide",
      es: "PureOwner — Marketplace .brave y guía de propiedad digital",
      de: "PureOwner — .brave-Marktplatz und Leitfaden für digitales Eigentum",
      it: "PureOwner — Marketplace .brave e guida alla proprietà digitale",
      pt: "PureOwner — Marketplace .brave e guia de propriedade digital"
    },
    "Spéculation": { en: "Speculation", es: "Especulación", de: "Spekulation", it: "Speculazione", pt: "Especulação" },
    "Technologie": { en: "Technology", es: "Tecnología", de: "Technologie", it: "Tecnologia", pt: "Tecnologia" },
    "Confluence": { en: "Convergence", es: "Convergencia", de: "Konvergenz", it: "Convergenza", pt: "Convergência" },
    "Identités numériques": { en: "Digital identities", es: "Identidades digitales", de: "Digitale Identitäten", it: "Identità digitali", pt: "Identidades digitais" },
    "Domain names": { en: "Domain names", es: "Nombres de dominio", de: "Domainnamen", it: "Nomi di dominio", pt: "Nomes de domínio" },
    "Années 2000": { en: "2000s", es: "Años 2000", de: "2000er-Jahre", it: "Anni 2000", pt: "Anos 2000" },
    "Banque": { en: "Banking", es: "Banca", de: "Bankwesen", it: "Banca", pt: "Banca" },
    "Web3 =": { en: "Web3 =", es: "Web3 =", de: "Web3 =", it: "Web3 =", pt: "Web3 =" },
    "propriété": { en: "ownership", es: "propiedad", de: "Eigentum", it: "proprietà", pt: "propriedade" },
    "Convergence": { en: "Convergence", es: "Convergencia", de: "Konvergenz", it: "Convergenza", pt: "Convergência" },
    "Résultat & services": { en: "Outcome & services", es: "Resultado y servicios", de: "Ergebnis & Dienste", it: "Risultato e servizi", pt: "Resultado e serviços" },
    "Noms de domaine": { en: "Domain names", es: "Nombres de dominio", de: "Domainnamen", it: "Nomi di dominio", pt: "Nomes de domínio" },
    "PureOwner · La référence de la propriété numérique": {
      en: "PureOwner · The digital ownership reference",
      es: "PureOwner · La referencia de la propiedad digital",
      de: "PureOwner · Die Referenz für digitales Eigentum",
      it: "PureOwner · Il punto di riferimento per la proprietà digitale",
      pt: "PureOwner · A referência da propriedade digital"
    },
    "Live": { en: "Live", es: "En directo", de: "Live", it: "In diretta", pt: "Ao vivo" },
    "Volume": { en: "Volume", es: "Volumen", de: "Lautstärke", it: "Volume", pt: "Volume" },
    "Confluence des propriétés numériques": {
      en: "Convergence of digital ownership",
      es: "Convergencia de la propiedad digital",
      de: "Konvergenz digitalen Eigentums",
      it: "Convergenza della proprietà digitale",
      pt: "Convergência da propriedade digital"
    },
    "Légende du schéma": { en: "Diagram legend", es: "Leyenda del diagrama", de: "Diagrammlegende", it: "Legenda del diagramma", pt: "Legenda do diagrama" },
    "Marketplace PureOwner": { en: "PureOwner marketplace", es: "Marketplace PureOwner", de: "PureOwner-Marktplatz", it: "Marketplace PureOwner", pt: "Marketplace PureOwner" },
    "Chapitres Pourquoi Bitcoin": { en: "Why Bitcoin chapters", es: "Capítulos Por qué Bitcoin", de: "Kapitel Warum Bitcoin", it: "Capitoli Perché Bitcoin", pt: "Capítulos Porquê Bitcoin" },
    "Chapitre agrandi": { en: "Expanded chapter", es: "Capítulo ampliado", de: "Vergrößertes Kapitel", it: "Capitolo ingrandito", pt: "Capítulo ampliado" },
    "Rechercher un .brave...": { en: "Search for a .brave...", es: "Buscar un .brave...", de: "Nach einer .brave-Domain suchen...", it: "Cerca un .brave...", pt: "Pesquisar um .brave..." }
  });

  Object.assign(T, {
    "Pourquoi Ethereum ?": { en: "Why Ethereum?", es: "¿Por qué Ethereum?", de: "Warum Ethereum?", it: "Perché Ethereum?", pt: "Porquê Ethereum?" },
    "Du constat des limites de Bitcoin à l'idée d'un ordinateur mondial programmable : découvrez comment Ethereum a ouvert la voie aux smart contracts, aux applications décentralisées et aux actifs numériques.": {
      en: "From Bitcoin's limitations to the idea of a programmable world computer: discover how Ethereum paved the way for smart contracts, decentralized applications and digital assets.",
      es: "Desde los límites de Bitcoin hasta la idea de un ordenador mundial programable: descubra cómo Ethereum abrió el camino a los contratos inteligentes, las aplicaciones descentralizadas y los activos digitales.",
      de: "Von den Grenzen Bitcoins bis zur Idee eines programmierbaren Weltcomputers: Entdecken Sie, wie Ethereum den Weg für Smart Contracts, dezentrale Anwendungen und digitale Vermögenswerte ebnete.",
      it: "Dai limiti di Bitcoin all'idea di un computer mondiale programmabile: scoprite come Ethereum ha aperto la strada a smart contract, applicazioni decentralizzate e asset digitali.",
      pt: "Dos limites da Bitcoin à ideia de um computador mundial programável: descubra como a Ethereum abriu caminho aos smart contracts, às aplicações descentralizadas e aos ativos digitais."
    },
    "Chapitres Pourquoi Ethereum": { en: "Why Ethereum chapters", es: "Capítulos Por qué Ethereum", de: "Kapitel Warum Ethereum", it: "Capitoli Perché Ethereum", pt: "Capítulos Porquê Ethereum" },
    "Le constat Bitcoin": { en: "The Bitcoin observation", es: "El punto de partida: Bitcoin", de: "Die Bitcoin-Ausgangslage", it: "Il punto di partenza: Bitcoin", pt: "O ponto de partida: Bitcoin" },
    "Le problème actuel": { en: "The current problem", es: "El problema actual", de: "Das aktuelle Problem", it: "Il problema attuale", pt: "O problema atual" },
    "L'idée centrale": { en: "The central idea", es: "La idea central", de: "Die zentrale Idee", it: "L'idea centrale", pt: "A ideia central" },
    "Le smart contract": { en: "The smart contract", es: "El contrato inteligente", de: "Der Smart Contract", it: "Lo smart contract", pt: "O smart contract" },
    "L'Ethereum Virtual Machine": { en: "The Ethereum Virtual Machine", es: "La Ethereum Virtual Machine", de: "Die Ethereum Virtual Machine", it: "L'Ethereum Virtual Machine", pt: "A Ethereum Virtual Machine" },
    "Le gas": { en: "Gas", es: "El gas", de: "Gas", it: "Il gas", pt: "O gas" },
    "Ether (ETH)": { en: "Ether (ETH)", es: "Ether (ETH)", de: "Ether (ETH)", it: "Ether (ETH)", pt: "Ether (ETH)" },
    "Les comptes": { en: "Accounts", es: "Las cuentas", de: "Konten", it: "Gli account", pt: "As contas" },
    "L'état mondial": { en: "The world state", es: "El estado global", de: "Der globale Zustand", it: "Lo stato globale", pt: "O estado global" },
    "Les applications décentralisées": { en: "Decentralized applications", es: "Las aplicaciones descentralizadas", de: "Dezentrale Anwendungen", it: "Le applicazioni decentralizzate", pt: "As aplicações descentralizadas" },
    "Les tokens": { en: "Tokens", es: "Los tokens", de: "Token", it: "I token", pt: "Os tokens" },
    "Les organisations autonomes": { en: "Autonomous organizations", es: "Las organizaciones autónomas", de: "Autonome Organisationen", it: "Le organizzazioni autonome", pt: "As organizações autónomas" },
    "Les usages imaginés en 2014": { en: "Use cases envisioned in 2014", es: "Los usos imaginados en 2014", de: "2014 vorgestellte Anwendungsfälle", it: "Gli usi immaginati nel 2014", pt: "Os usos imaginados em 2014" },
    "Les limites reconnues": { en: "Acknowledged limitations", es: "Los límites reconocidos", de: "Erkannte Grenzen", it: "I limiti riconosciuti", pt: "Os limites reconhecidos" }
  });

  Object.assign(T, {
    "Comment le Web3 ?": { en: "How does Web3 work?", es: "¿Cómo funciona Web3?", de: "Wie funktioniert Web3?", it: "Come funziona il Web3?", pt: "Como funciona a Web3?" },
    "Du réseau Web1 à l'Internet de la propriété : découvrez comment Bitcoin, Ethereum, les tokens et les identités décentralisées ont progressivement construit le Web3.": {
      en: "From the Web1 network to the ownership Internet: discover how Bitcoin, Ethereum, tokens and decentralized identities progressively built Web3.",
      es: "De la red Web1 al Internet de la propiedad: descubra cómo Bitcoin, Ethereum, los tokens y las identidades descentralizadas construyeron progresivamente Web3.",
      de: "Vom Web1-Netzwerk zum Internet des Eigentums: Entdecken Sie, wie Bitcoin, Ethereum, Token und dezentrale Identitäten das Web3 schrittweise aufgebaut haben.",
      it: "Dalla rete Web1 all'Internet della proprietà: scoprite come Bitcoin, Ethereum, i token e le identità decentralizzate hanno progressivamente costruito il Web3.",
      pt: "Da rede Web1 à Internet da propriedade: descubra como a Bitcoin, a Ethereum, os tokens e as identidades descentralizadas construíram progressivamente a Web3."
    },
    "Chapitres Comment le Web3": { en: "How Web3 works chapters", es: "Capítulos Cómo funciona Web3", de: "Kapitel Wie Web3 funktioniert", it: "Capitoli Come funziona il Web3", pt: "Capítulos Como funciona a Web3" },
    "Du Web1 au Web2": { en: "From Web1 to Web2", es: "De Web1 a Web2", de: "Von Web1 zu Web2", it: "Dal Web1 al Web2", pt: "Da Web1 à Web2" },
    "De Bitcoin à Ethereum": { en: "From Bitcoin to Ethereum", es: "De Bitcoin a Ethereum", de: "Von Bitcoin zu Ethereum", it: "Da Bitcoin a Ethereum", pt: "Da Bitcoin à Ethereum" },
    "Des tokens aux NFT": { en: "From tokens to NFTs", es: "De los tokens a los NFT", de: "Von Token zu NFTs", it: "Dai token agli NFT", pt: "Dos tokens aos NFT" },
    "Les identités décentralisées": { en: "Decentralized identities", es: "Las identidades descentralizadas", de: "Dezentrale Identitäten", it: "Le identità decentralizzate", pt: "As identidades descentralizadas" },
    "Les DAO": { en: "DAOs", es: "Las DAO", de: "DAOs", it: "Le DAO", pt: "As DAO" },
    "Le Web3, Internet de la propriété": { en: "Web3, the ownership Internet", es: "Web3, el Internet de la propiedad", de: "Web3, das Internet des Eigentums", it: "Il Web3, l'Internet della proprietà", pt: "A Web3, a Internet da propriedade" }
  });

  Object.assign(T, {
    "PureOwner — Devenez propriétaire de votre identité numérique": {
      en: "PureOwner — Own your digital identity", es: "PureOwner — Sea dueño de su identidad digital", de: "PureOwner — Besitzen Sie Ihre digitale Identität", it: "PureOwner — Possiedi la tua identità digitale", pt: "PureOwner — Seja dono da sua identidade digital"
    },
    "PureOwner accompagne le plus grand transfert de propriété numérique depuis la création d'Internet. Web3 : possédez votre prénom, votre nom et votre identité numérique de façon permanente — avant quelqu'un d'autre.": {
      en: "PureOwner supports the greatest transfer of digital ownership since the creation of the Internet. Web3: permanently own your first name, last name and digital identity — before someone else does.",
      es: "PureOwner acompaña la mayor transferencia de propiedad digital desde la creación de Internet. Web3: posea de forma permanente su nombre, apellido e identidad digital — antes que otra persona.",
      de: "PureOwner begleitet den größten Transfer digitalen Eigentums seit der Entstehung des Internets. Web3: Besitzen Sie Vorname, Nachname und digitale Identität dauerhaft — bevor es jemand anderes tut.",
      it: "PureOwner accompagna il più grande trasferimento di proprietà digitale dalla nascita di Internet. Web3: possiedi in modo permanente nome, cognome e identità digitale — prima di qualcun altro.",
      pt: "A PureOwner acompanha a maior transferência de propriedade digital desde a criação da Internet. Web3: possua permanentemente o seu nome, apelido e identidade digital — antes de outra pessoa."
    },
    "Le plus grand transfert de propriété numérique depuis la création d'Internet. Réservez votre nom avant qu'il ne soit pris.": {
      en: "The greatest transfer of digital ownership since the creation of the Internet. Reserve your name before it is taken.",
      es: "La mayor transferencia de propiedad digital desde la creación de Internet. Reserve su nombre antes de que alguien lo registre.",
      de: "Der größte Transfer digitalen Eigentums seit der Entstehung des Internets. Sichern Sie Ihren Namen, bevor er vergeben ist.",
      it: "Il più grande trasferimento di proprietà digitale dalla nascita di Internet. Prenota il tuo nome prima che venga registrato.",
      pt: "A maior transferência de propriedade digital desde a criação da Internet. Reserve o seu nome antes que seja registado."
    },
    "Lire le guide d'achat": { en: "Read the buying guide", es: "Leer la guía de compra", de: "Kaufratgeber lesen", it: "Leggi la guida all'acquisto", pt: "Ler o guia de compra" },
    "Guide pratique": { en: "Practical guide", es: "Guía práctica", de: "Praxisleitfaden", it: "Guida pratica", pt: "Guia prático" },
    "Acheter un nom de domaine classique ou Web3": { en: "Buy a traditional or Web3 domain name", es: "Comprar un nombre de dominio clásico o Web3", de: "Einen klassischen oder Web3-Domainnamen kaufen", it: "Acquistare un dominio classico o Web3", pt: "Comprar um nome de domínio clássico ou Web3" },
    "Fermer le guide": { en: "Close the guide", es: "Cerrar la guía", de: "Leitfaden schließen", it: "Chiudi la guida", pt: "Fechar o guia" },
    "Guide d'achat des noms de domaine": { en: "Domain name buying guide", es: "Guía de compra de nombres de dominio", de: "Kaufratgeber für Domainnamen", it: "Guida all'acquisto di nomi di dominio", pt: "Guia de compra de nomes de domínio" },
    "Module intégré": { en: "Integrated module", es: "Módulo integrado", de: "Integriertes Modul", it: "Modulo integrato", pt: "Módulo integrado" },
    "Le tirage PureOwner.": { en: "The PureOwner reading.", es: "La tirada PureOwner.", de: "Die PureOwner-Legung.", it: "La lettura PureOwner.", pt: "A leitura PureOwner." },
    "Choisissez trois arcanes dans notre cabinet numérique : rideaux, boule de cristal et chat noir compris.": {
      en: "Choose three arcana in our digital reading room — curtains, crystal ball and black cat included.",
      es: "Elija tres arcanos en nuestro gabinete digital, con cortinas, bola de cristal y gato negro incluidos.",
      de: "Wählen Sie drei Arkana in unserem digitalen Kabinett — Vorhänge, Kristallkugel und schwarze Katze inklusive.",
      it: "Scegli tre arcani nel nostro studio digitale, con tende, sfera di cristallo e gatto nero inclusi.",
      pt: "Escolha três arcanos no nosso gabinete digital, com cortinas, bola de cristal e gato preto incluídos."
    },
    "Le tarot reste un module autonome. La molette continue de faire défiler PureOwner, même lorsque la souris se trouve au-dessus des cartes.": {
      en: "The tarot remains a standalone module. The wheel continues to scroll PureOwner even when the pointer is over the cards.",
      es: "El tarot sigue siendo un módulo autónomo. La rueda continúa desplazando PureOwner incluso cuando el puntero está sobre las cartas.",
      de: "Das Tarot bleibt ein eigenständiges Modul. Das Mausrad scrollt PureOwner weiter, auch wenn sich der Zeiger über den Karten befindet.",
      it: "I tarocchi restano un modulo autonomo. La rotellina continua a scorrere PureOwner anche quando il puntatore è sopra le carte.",
      pt: "O tarot continua a ser um módulo autónomo. A roda continua a deslocar a PureOwner mesmo quando o ponteiro está sobre as cartas."
    },
    "Tarot digital PureOwner": { en: "PureOwner digital tarot", es: "Tarot digital PureOwner", de: "Digitales PureOwner-Tarot", it: "Tarocchi digitali PureOwner", pt: "Tarot digital PureOwner" },
    "Tarot digital": { en: "Digital tarot", es: "Tarot digital", de: "Digitales Tarot", it: "Tarocchi digitali", pt: "Tarot digital" },
    "Choisissez trois arcanes pour révéler votre trajectoire.": { en: "Choose three arcana to reveal your path.", es: "Elija tres arcanos para revelar su trayectoria.", de: "Wählen Sie drei Arkana, um Ihren Weg zu enthüllen.", it: "Scegli tre arcani per rivelare il tuo percorso.", pt: "Escolha três arcanos para revelar o seu percurso." },
    "Cartes de votre tirage": { en: "Cards in your reading", es: "Cartas de su tirada", de: "Karten Ihrer Legung", it: "Carte della tua lettura", pt: "Cartas da sua leitura" },
    "Votre tirage": { en: "Your reading", es: "Su tirada", de: "Ihre Legung", it: "La tua lettura", pt: "A sua leitura" },
    "arcanes choisis": { en: "arcana selected", es: "arcanos elegidos", de: "Arkana gewählt", it: "arcani scelti", pt: "arcanos escolhidos" },
    "Révéler ma trajectoire": { en: "Reveal my path", es: "Revelar mi trayectoria", de: "Meinen Weg enthüllen", it: "Rivela il mio percorso", pt: "Revelar o meu percurso" },
    "✦ Révéler ma trajectoire": { en: "✦ Reveal my path", es: "✦ Revelar mi trayectoria", de: "✦ Meinen Weg enthüllen", it: "✦ Rivela il mio percorso", pt: "✦ Revelar o meu percurso" },
    "Redistribuer les cartes": { en: "Redeal the cards", es: "Volver a repartir las cartas", de: "Karten neu austeilen", it: "Ridistribuisci le carte", pt: "Voltar a distribuir as cartas" },
    "Sélectionnez trois arcanes. La boule de cristal est encore en train de négocier avec le Wi‑Fi.": { en: "Select three arcana. The crystal ball is still negotiating with the Wi-Fi.", es: "Seleccione tres arcanos. La bola de cristal sigue negociando con el Wi-Fi.", de: "Wählen Sie drei Arkana. Die Kristallkugel verhandelt noch mit dem WLAN.", it: "Seleziona tre arcani. La sfera di cristallo sta ancora negoziando con il Wi-Fi.", pt: "Selecione três arcanos. A bola de cristal ainda está a negociar com o Wi-Fi." },
    "Recommencer le tirage": { en: "Start the reading again", es: "Reiniciar la tirada", de: "Legung neu starten", it: "Ricomincia la lettura", pt: "Recomeçar a leitura" },
    "Votre trajectoire digitale": { en: "Your digital path", es: "Su trayectoria digital", de: "Ihr digitaler Weg", it: "Il tuo percorso digitale", pt: "O seu percurso digital" },
    "Priorité": { en: "Priority", es: "Prioridad", de: "Priorität", it: "Priorità", pt: "Prioridade" },
    "Point de vigilance": { en: "Watch point", es: "Punto de atención", de: "Zu beachten", it: "Punto di attenzione", pt: "Ponto de atenção" },
    "Recevoir cette trajectoire et en parler ensemble": { en: "Receive this path and discuss it together", es: "Recibir esta trayectoria y comentarla juntos", de: "Diesen Weg erhalten und gemeinsam besprechen", it: "Ricevi questo percorso e parliamone insieme", pt: "Receber este percurso e conversar sobre ele" },
    "Découvrir votre trajectoire digitale": { en: "Discover your digital path", es: "Descubrir su trayectoria digital", de: "Ihren digitalen Weg entdecken", it: "Scopri il tuo percorso digitale", pt: "Descobrir o seu percurso digital" },
    "Couper les effets sonores": { en: "Turn off sound effects", es: "Desactivar los efectos de sonido", de: "Soundeffekte ausschalten", it: "Disattiva gli effetti sonori", pt: "Desativar os efeitos sonoros" },
    "Activer les effets sonores": { en: "Turn on sound effects", es: "Activar los efectos de sonido", de: "Soundeffekte einschalten", it: "Attiva gli effetti sonori", pt: "Ativar os efeitos sonoros" },
    "Son activé": { en: "Sound on", es: "Sonido activado", de: "Ton an", it: "Audio attivo", pt: "Som ativado" },
    "Son coupé": { en: "Sound off", es: "Sonido desactivado", de: "Ton aus", it: "Audio disattivato", pt: "Som desativado" },
    "Fondations": { en: "Foundations", es: "Fundamentos", de: "Grundlagen", it: "Fondamenta", pt: "Fundações" },
    "Croissance": { en: "Growth", es: "Crecimiento", de: "Wachstum", it: "Crescita", pt: "Crescimento" },
    "Innovation": { en: "Innovation", es: "Innovación", de: "Innovation", it: "Innovazione", pt: "Inovação" },
    "Implantation internet": { en: "Internet presence", es: "Presencia en Internet", de: "Internetpräsenz", it: "Presenza su Internet", pt: "Presença na Internet" },
    "Storytelling du site": { en: "Website storytelling", es: "Narrativa del sitio", de: "Website-Storytelling", it: "Storytelling del sito", pt: "Narrativa do site" },
    "Image de marque": { en: "Brand image", es: "Imagen de marca", de: "Markenbild", it: "Immagine di marca", pt: "Imagem de marca" },
    "Canaux de diffusion": { en: "Distribution channels", es: "Canales de difusión", de: "Vertriebskanäle", it: "Canali di diffusione", pt: "Canais de divulgação" },
    "Acquisition client": { en: "Customer acquisition", es: "Adquisición de clientes", de: "Kundengewinnung", it: "Acquisizione clienti", pt: "Aquisição de clientes" },
    "Crypto transactions": { en: "Crypto transactions", es: "Transacciones cripto", de: "Krypto-Transaktionen", it: "Transazioni crypto", pt: "Transações cripto" },
    "Web3 innovateur": { en: "Web3 innovation", es: "Innovación Web3", de: "Web3-Innovation", it: "Innovazione Web3", pt: "Inovação Web3" },
    "Trajectoire enregistrée — merci": { en: "Path saved — thank you", es: "Trayectoria guardada — gracias", de: "Weg gespeichert — danke", it: "Percorso salvato — grazie", pt: "Percurso guardado — obrigado" },
    "Activer Ibiza Global Radio": { en: "Turn on Ibiza Global Radio", es: "Activar Ibiza Global Radio", de: "Ibiza Global Radio einschalten", it: "Attiva Ibiza Global Radio", pt: "Ativar Ibiza Global Radio" },
    "Lecteur radio flottant": { en: "Floating radio player", es: "Reproductor de radio flotante", de: "Schwebender Radioplayer", it: "Lettore radio mobile", pt: "Leitor de rádio flutuante" },
    "Favori du titre en cours": { en: "Favorite current track", es: "Favorito del tema actual", de: "Aktuellen Titel favorisieren", it: "Brano attuale preferito", pt: "Favorito da faixa atual" },
    "Ajouter le titre en cours aux favoris": { en: "Add current track to favorites", es: "Añadir el tema actual a favoritos", de: "Aktuellen Titel zu Favoriten hinzufügen", it: "Aggiungi il brano attuale ai preferiti", pt: "Adicionar faixa atual aos favoritos" },
    "Retirer le titre en cours des favoris": { en: "Remove current track from favorites", es: "Quitar el tema actual de favoritos", de: "Aktuellen Titel aus Favoriten entfernen", it: "Rimuovi il brano attuale dai preferiti", pt: "Remover faixa atual dos favoritos" },
    "En attente": { en: "Waiting", es: "En espera", de: "Warten", it: "In attesa", pt: "A aguardar" },
    "Aucun son sans clic utilisateur.": { en: "No sound until you click.", es: "No hay sonido hasta que haga clic.", de: "Kein Ton vor einem Klick.", it: "Nessun suono prima del clic.", pt: "Sem som até clicar." },
    "Lecture ou pause": { en: "Play or pause", es: "Reproducir o pausar", de: "Wiedergabe oder Pause", it: "Riproduci o pausa", pt: "Reproduzir ou pausar" },
    "Ouvrir le volume": { en: "Open volume control", es: "Abrir el volumen", de: "Lautstärke öffnen", it: "Apri il volume", pt: "Abrir volume" },
    "Volume du lecteur etendu": { en: "Expanded player volume", es: "Volumen del reproductor ampliado", de: "Lautstärke des erweiterten Players", it: "Volume del lettore esteso", pt: "Volume do leitor expandido" },
    "Copier le titre": { en: "Copy track", es: "Copiar tema", de: "Titel kopieren", it: "Copia brano", pt: "Copiar faixa" },
    "Masquer": { en: "Hide", es: "Ocultar", de: "Ausblenden", it: "Nascondi", pt: "Ocultar" },
    "Masquer le lecteur": { en: "Hide player", es: "Ocultar reproductor", de: "Player ausblenden", it: "Nascondi lettore", pt: "Ocultar leitor" },
    "Afficher": { en: "Show", es: "Mostrar", de: "Anzeigen", it: "Mostra", pt: "Mostrar" },
    "Afficher le lecteur": { en: "Show player", es: "Mostrar reproductor", de: "Player anzeigen", it: "Mostra lettore", pt: "Mostrar leitor" },
    "Ouvrir Soundeo et copier ce titre": { en: "Open Soundeo and copy this track", es: "Abrir Soundeo y copiar este tema", de: "Soundeo öffnen und diesen Titel kopieren", it: "Apri Soundeo e copia questo brano", pt: "Abrir Soundeo e copiar esta faixa" },
    "Ajouter ce titre aux favoris": { en: "Add this track to favorites", es: "Añadir este tema a favoritos", de: "Diesen Titel zu Favoriten hinzufügen", it: "Aggiungi questo brano ai preferiti", pt: "Adicionar esta faixa aos favoritos" },
    "Retirer ce titre des favoris": { en: "Remove this track from favorites", es: "Quitar este tema de favoritos", de: "Diesen Titel aus Favoriten entfernen", it: "Rimuovi questo brano dai preferiti", pt: "Remover esta faixa dos favoritos" },
    "Ajouter aux favoris": { en: "Add to favorites", es: "Añadir a favoritos", de: "Zu Favoriten hinzufügen", it: "Aggiungi ai preferiti", pt: "Adicionar aos favoritos" },
    "Retirer des favoris": { en: "Remove from favorites", es: "Quitar de favoritos", de: "Aus Favoriten entfernen", it: "Rimuovi dai preferiti", pt: "Remover dos favoritos" },
    "Actualiser le flux": { en: "Refresh stream", es: "Actualizar emisión", de: "Stream aktualisieren", it: "Aggiorna flusso", pt: "Atualizar transmissão" },
    "Actualiser le flux Ibiza Global TV": { en: "Refresh Ibiza Global TV stream", es: "Actualizar la emisión de Ibiza Global TV", de: "Ibiza Global TV-Stream aktualisieren", it: "Aggiorna il flusso Ibiza Global TV", pt: "Atualizar transmissão Ibiza Global TV" },
    "Ouvrir dans un nouvel onglet": { en: "Open in a new tab", es: "Abrir en una pestaña nueva", de: "In neuem Tab öffnen", it: "Apri in una nuova scheda", pt: "Abrir num novo separador" },
    "Ouvrir Ibiza Global TV dans un nouvel onglet": { en: "Open Ibiza Global TV in a new tab", es: "Abrir Ibiza Global TV en una pestaña nueva", de: "Ibiza Global TV in neuem Tab öffnen", it: "Apri Ibiza Global TV in una nuova scheda", pt: "Abrir Ibiza Global TV num novo separador" },
    "Chaine en direct. Restream indiquera si la diffusion est hors ligne.": { en: "Live channel. Restream will indicate if the broadcast is offline.", es: "Canal en directo. Restream indicará si la emisión está desconectada.", de: "Live-Kanal. Restream zeigt an, wenn die Übertragung offline ist.", it: "Canale in diretta. Restream indicherà se la trasmissione è offline.", pt: "Canal em direto. A Restream indicará se a transmissão está offline." },
    "Envoyer les favoris par mail": { en: "Email favorites", es: "Enviar favoritos por correo", de: "Favoriten per E-Mail senden", it: "Invia i preferiti via email", pt: "Enviar favoritos por e-mail" },
    "Mail": { en: "Email", es: "Correo", de: "E-Mail", it: "Email", pt: "E-mail" },
    "Favoris": { en: "Favorites", es: "Favoritos", de: "Favoriten", it: "Preferiti", pt: "Favoritos" },
    "Historique indisponible": { en: "History unavailable", es: "Historial no disponible", de: "Verlauf nicht verfügbar", it: "Cronologia non disponibile", pt: "Histórico indisponível" },
    "En attente des donnees radio": { en: "Waiting for radio data", es: "Esperando datos de la radio", de: "Warten auf Radiodaten", it: "In attesa dei dati radio", pt: "A aguardar dados da rádio" },
    "Lecteur radio reduit": { en: "Minimized radio player", es: "Reproductor de radio minimizado", de: "Minimierter Radioplayer", it: "Lettore radio ridotto", pt: "Leitor de rádio reduzido" },
    "Lecture en direct": { en: "Live playback", es: "Reproducción en directo", de: "Live-Wiedergabe", it: "Riproduzione in diretta", pt: "Reprodução em direto" },
    "Flux officiel Ibiza Global Radio.": { en: "Official Ibiza Global Radio stream.", es: "Emisión oficial de Ibiza Global Radio.", de: "Offizieller Ibiza Global Radio-Stream.", it: "Flusso ufficiale Ibiza Global Radio.", pt: "Transmissão oficial da Ibiza Global Radio." },
    "Le flux est pret.": { en: "The stream is ready.", es: "La emisión está lista.", de: "Der Stream ist bereit.", it: "Il flusso è pronto.", pt: "A transmissão está pronta." },
    "Connexion live": { en: "Connecting live", es: "Conectando en directo", de: "Live-Verbindung", it: "Connessione live", pt: "Ligação em direto" },
    "Ouverture du flux officiel Ibiza Global Radio.": { en: "Opening the official Ibiza Global Radio stream.", es: "Abriendo la emisión oficial de Ibiza Global Radio.", de: "Offizieller Ibiza Global Radio-Stream wird geöffnet.", it: "Apertura del flusso ufficiale Ibiza Global Radio.", pt: "A abrir a transmissão oficial da Ibiza Global Radio." },
    "Lecture bloquee": { en: "Playback blocked", es: "Reproducción bloqueada", de: "Wiedergabe blockiert", it: "Riproduzione bloccata", pt: "Reprodução bloqueada" },
    "Clique sur lecture pour relancer le flux.": { en: "Click play to restart the stream.", es: "Pulse reproducir para reiniciar la emisión.", de: "Klicken Sie auf Wiedergabe, um den Stream neu zu starten.", it: "Premi play per riavviare il flusso.", pt: "Clique em reproduzir para reiniciar a transmissão." },
    "Mettre en pause": { en: "Pause", es: "Pausar", de: "Pausieren", it: "Metti in pausa", pt: "Pausar" },
    "Volume coupe": { en: "Muted", es: "Silenciado", de: "Stumm", it: "Audio disattivato", pt: "Sem som" },
    "Retablir le son": { en: "Unmute", es: "Restablecer el sonido", de: "Ton einschalten", it: "Riattiva audio", pt: "Repor o som" },
    "Offres acceptées": { en: "Offers welcome", es: "Se aceptan ofertas", de: "Angebote willkommen", it: "Offerte accettate", pt: "Ofertas aceites" },
    "Voir le domaine": { en: "View domain", es: "Ver dominio", de: "Domain ansehen", it: "Vedi dominio", pt: "Ver domínio" },
    "Options de paiement": { en: "Payment options", es: "Opciones de pago", de: "Zahlungsoptionen", it: "Opzioni di pagamento", pt: "Opções de pagamento" },
    "Précédent": { en: "Previous", es: "Anterior", de: "Zurück", it: "Precedente", pt: "Anterior" },
    "Suivant": { en: "Next", es: "Siguiente", de: "Weiter", it: "Successivo", pt: "Seguinte" },
    "Vos données restent les vôtres.": { en: "Your data remains yours.", es: "Sus datos siguen siendo suyos.", de: "Ihre Daten bleiben Ihre Daten.", it: "I tuoi dati restano tuoi.", pt: "Os seus dados continuam a ser seus." },
    "Découvrez précisément les données utilisées, leur finalité et les protections appliquées par PureOwner.": { en: "See exactly what data PureOwner uses, why it is used and how it is protected.", es: "Descubra qué datos utiliza PureOwner, con qué finalidad y cómo los protege.", de: "Erfahren Sie genau, welche Daten PureOwner nutzt, wofür und wie sie geschützt werden.", it: "Scopri quali dati utilizza PureOwner, per quale scopo e come vengono protetti.", pt: "Veja exatamente que dados a PureOwner utiliza, para que fim e como são protegidos." },
    "Confidentialité et transparence": { en: "Privacy and transparency", es: "Privacidad y transparencia", de: "Datenschutz und Transparenz", it: "Privacy e trasparenza", pt: "Privacidade e transparência" },
    "Notre accompagnement peut impliquer des informations de profil ou de wallet. Le cadre complet précise ce qui est utilisé, pourquoi et pendant combien de temps.": { en: "Our guidance may involve profile or wallet information. The full policy explains what is used, why and for how long.", es: "Nuestro acompañamiento puede implicar información de perfil o wallet. La política completa explica qué se utiliza, por qué y durante cuánto tiempo.", de: "Unsere Begleitung kann Profil- oder Wallet-Informationen umfassen. Die vollständige Richtlinie erklärt, was warum und wie lange genutzt wird.", it: "Il nostro supporto può coinvolgere informazioni del profilo o del wallet. L'informativa completa spiega cosa viene utilizzato, perché e per quanto tempo.", pt: "O nosso acompanhamento pode envolver informações de perfil ou wallet. A política completa explica o que é utilizado, porquê e durante quanto tempo." },
    "Lire la politique détaillée": { en: "Read the detailed policy", es: "Leer la política detallada", de: "Ausführliche Richtlinie lesen", it: "Leggi l'informativa dettagliata", pt: "Ler a política detalhada" },
    "Confidentialité": { en: "Privacy", es: "Privacidad", de: "Datenschutz", it: "Privacy", pt: "Privacidade" },
    "Fermer": { en: "Close", es: "Cerrar", de: "Schließen", it: "Chiudi", pt: "Fechar" }
  });

  function normalize(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function hasLetters(value) {
    return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value || "");
  }

  function skipElement(element) {
    return !element || element.closest("script,style,noscript,svg,.storefront-card-name,[data-no-translate]");
  }

  function dynamicTranslate(source, lang) {
    var match = source.match(/^(\d+)\s+chapitres?$/i);
    if (match) {
      return {
        en: match[1] + " chapters",
        es: match[1] + " capítulos",
        de: match[1] + " Kapitel",
        it: match[1] + " capitoli",
        pt: match[1] + " capítulos"
      }[lang];
    }

    match = source.match(/^Chapitre\s+(\d+)\s+—\s+(.+)$/i);
    if (match) {
      return {
        en: "Chapter ", es: "Capítulo ", de: "Kapitel ", it: "Capitolo ", pt: "Capítulo "
      }[lang] + match[1] + " — " + translateString(match[2], lang);
    }

    match = source.match(/^(\d+)\s+noms?\s+\.brave\s+disponibles?$/i);
    if (match) {
      return {
        en: match[1] + " .brave names available",
        es: match[1] + " nombres .brave disponibles",
        de: match[1] + " .brave-Namen verfügbar",
        it: match[1] + " nomi .brave disponibili",
        pt: match[1] + " nomes .brave disponíveis"
      }[lang];
    }

    match = source.match(/^Offres dès\s+(.+)$/i);
    if (match) {
      return {
        en: "Offers from " + match[1],
        es: "Ofertas desde " + match[1],
        de: "Angebote ab " + match[1],
        it: "Offerte da " + match[1],
        pt: "Ofertas a partir de " + match[1]
      }[lang];
    }

    match = source.match(/^Paiement\s+(.+)\/mois$/i) || source.match(/^Échelonner dès\s+(.+)\/mois$/i);
    if (match) {
      return {
        en: "Payment " + match[1] + "/month",
        es: "Pago " + match[1] + "/mes",
        de: "Zahlung " + match[1] + "/Monat",
        it: "Pagamento " + match[1] + "/mese",
        pt: "Pagamento " + match[1] + "/mês"
      }[lang];
    }

    match = source.match(/^(.+),\s*(Fondations|Identité|Croissance|Innovation)$/i);
    if (match) return translateString(match[1], lang) + ", " + translateString(match[2], lang);

    return null;
  }

  function translateString(value, lang) {
    var source = normalize(value);
    if (!source || !hasLetters(source) || lang === "fr") return source;
    if (T[source] && T[source][lang]) return T[source][lang];
    return dynamicTranslate(source, lang) || source;
  }

  function translateTextNode(node, lang) {
    var current = normalize(node.nodeValue);
    if (!node.__poSourceText || (node.__poLastText && current !== node.__poLastText && current !== node.__poSourceText)) {
      node.__poSourceText = normalize(node.nodeValue);
      node.__poPrefix = (node.nodeValue.match(/^\s*/) || [""])[0];
      node.__poSuffix = (node.nodeValue.match(/\s*$/) || [""])[0];
    }
    var original = node.__poSourceText;
    if (!original || !hasLetters(original)) return;
    var translated = translateString(original, lang);
    var next = (node.__poPrefix || "") + translated + (node.__poSuffix || "");
    if (node.nodeValue !== next) node.nodeValue = next;
    node.__poLastText = normalize(next);
  }

  function translateAttrs(element, lang) {
    if (!element || element.nodeType !== 1 || skipElement(element)) return;
    if (element.matches(".language-menu [data-lang]")) return;
    var states = element.__poI18nAttrs || (element.__poI18nAttrs = {});
    ATTRS.forEach(function (attr) {
      if (!element.hasAttribute(attr)) return;
      if (attr === "content" && !element.matches("meta[name='description'],meta[property='og:title'],meta[property='og:description'],meta[name='twitter:title'],meta[name='twitter:description']")) return;
      var current = normalize(element.getAttribute(attr));
      var state = states[attr];
      if (!state || (state.last && current !== state.last && current !== state.source)) {
        state = states[attr] = { source: current, last: current };
      }
      var source = state.source;
      if (!source || !hasLetters(source)) return;
      var translated = translateString(source, lang);
      if (element.getAttribute(attr) !== translated) element.setAttribute(attr, translated);
      state.last = normalize(translated);
    });
  }

  function walk(root, lang) {
    if (!root) return;
    if (root.nodeType === 3) {
      if (!skipElement(root.parentElement)) translateTextNode(root, lang);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;

    var stack = [root];
    while (stack.length) {
      var node = stack.pop();
      if (node.nodeType === 3) {
        if (!skipElement(node.parentElement)) translateTextNode(node, lang);
        continue;
      }
      if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) continue;
      if (node.nodeType === 1) {
        if (skipElement(node)) continue;
        translateAttrs(node, lang);
      }
      Array.prototype.slice.call(node.childNodes).reverse().forEach(function (child) {
        stack.push(child);
      });
    }
  }

  function syncMenus(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-current").forEach(function (label) {
      label.textContent = LANG_LABELS[lang] || "FR";
    });
    document.querySelectorAll(".language-menu [data-lang]").forEach(function (button) {
      var active = button.getAttribute("data-lang") === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLanguage(lang) {
    if (!LANG_LABELS[lang]) lang = "fr";
    localStorage.setItem(STORAGE_KEY, lang);
    applying = true;
    syncMenus(lang);
    walk(document.documentElement, lang);
    applying = false;
    document.dispatchEvent(new CustomEvent("pureowner:languagechange", { detail: { language: lang } }));
    var tarot = document.getElementById("tarot-digital-widget");
    if (tarot && tarot.contentWindow) {
      tarot.contentWindow.postMessage({ type: "pureowner:languagechange", language: lang }, window.location.origin);
    }
  }

  function bind() {
    document.querySelectorAll(".language-menu [data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(button.getAttribute("data-lang"));
      });
    });

    observer = new MutationObserver(function (mutations) {
      if (applying) return;
      var lang = localStorage.getItem(STORAGE_KEY) || "fr";
      if (lang === "fr") return;
      applying = true;
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") walk(mutation.target, lang);
        mutation.addedNodes.forEach(function (node) { walk(node, lang); });
        if (mutation.type === "attributes") walk(mutation.target, lang);
      });
      applying = false;
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS
    });

    setLanguage(localStorage.getItem(STORAGE_KEY) || detectDeviceLanguage());
  }

  window.PureOwnerI18n = { setLanguage: setLanguage, translateString: translateString, dictionary: T };

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.type !== "pureowner:languagechange") return;
    setLanguage(event.data.language);
  });

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY && event.newValue) setLanguage(event.newValue);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
