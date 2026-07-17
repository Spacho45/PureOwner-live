# PureOwner — Oracle Web3

Prototype React autonome pour explorer l’identité numérique à travers un tirage local de trois cartes. Il n’utilise ni API, ni base de données, ni authentification et n’est pas relié au site PureOwner principal.

## Lancer localement

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
cd oracle-web3
npm install
npm run dev
```

Vite affiche ensuite l’URL locale, généralement `http://localhost:5173`.

## Vérifier et construire

```bash
npm run typecheck
npm run build
npm run preview
```

Le dossier de production est `dist/`.

## Déployer séparément sur Netlify

Créer un nouveau site avec `oracle-web3` comme dossier de base, `npm run build` comme commande et `dist` comme dossier publié. Aucune variable d’environnement n’est requise.

Le fichier `netlify.toml` contient déjà ces paramètres.
