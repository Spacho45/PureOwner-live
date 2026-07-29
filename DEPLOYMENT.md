# Déploiement de PureOwner

## Architecture retenue

Le code source est conservé sur GitHub et Cloudflare Pages publie automatiquement chaque modification de la branche `main`.

```text
Ordinateur local -> GitHub -> Cloudflare Pages -> pureowner.com
```

L'ancien dépôt `Spacho45/PureOwner.com` doit être conservé en l'état tant que la nouvelle chaîne n'a pas été validée. Un nouveau dépôt, par exemple `Spacho45/PureOwner-live`, évite de mélanger l'ancien essai et la version actuelle du site.

## Configuration Cloudflare Pages

1. Créer une application Pages reliée au nouveau dépôt GitHub.
2. Choisir `main` comme branche de production.
3. Laisser la commande de build vide.
4. Utiliser `.` comme dossier de sortie.
5. Vérifier d'abord l'adresse de prévisualisation `*.pages.dev`.
6. Ajouter ensuite `pureowner.com` et `www.pureowner.com` comme domaines personnalisés.

## Bascule DNS

Les serveurs de noms sont déjà délégués à Cloudflare :

- `monroe.ns.cloudflare.com`
- `razvan.ns.cloudflare.com`

Les anciens enregistrements A pointant vers `34.42.100.71` doivent rester en place jusqu'à ce que la prévisualisation Pages soit validée. Lors de l'ajout des domaines personnalisés, Cloudflare Pages peut créer ou proposer les enregistrements appropriés. Les anciens A ne doivent être supprimés qu'à ce moment-là.

Conserver temporairement les enregistrements TXT `_acme-challenge` pendant la transition. Ils pourront être nettoyés après vérification du certificat HTTPS.

## Vérifications avant production

- La prévisualisation Pages affiche la dernière version du site.
- Les images, traductions, liens d'achat et modules interactifs fonctionnent.
- `https://pureowner.com` et `https://www.pureowner.com` répondent sans erreur.
- Une seule variante de domaine redirige vers l'autre pour éviter le contenu dupliqué.
- Le certificat TLS est valide.

## Retour arrière

En cas de problème, remettre les anciens enregistrements A vers `34.42.100.71`. Le dépôt historique reste intact et peut servir de référence pendant toute la migration.
