# Clean Code Guidelines — SolidJS 2026

> Directives pour l'IA agentique. Appliquer ces règles systématiquement lors de toute génération ou modification de code dans ce projet.

---

## 1. Réactivité SolidJS — Principes fondamentaux

- **Ne jamais déstructurer les props** : les props sont des getters réactifs. Utiliser `props.value`, jamais `const { value } = props`.
- **Utiliser `splitProps`** pour séparer les props consommées localement des props transmises à un enfant.
- **Toujours accéder aux signaux dans un contexte de suivi** (JSX, `createEffect`, `createMemo`). Un accès hors contexte rompt la réactivité.
- **Préférer `createMemo`** à une fonction utilitaire ordinaire dès qu'une valeur dérive de signaux, pour éviter les recalculs inutiles.
- **`createEffect` uniquement pour les effets de bord** (DOM impératif, appels API, logs). Ne pas l'utiliser pour dériver de l'état.
- **`on()`** avec `defer: true` pour s'abonner à un signal précis sans exécution immédiate.
- **`untrack()`** pour lire un signal sans créer de dépendance réactive explicite.

```ts
// ✅ Correct
const double = createMemo(() => count() * 2);

// ❌ Incorrect — casse la réactivité
const { count } = props;
```

---

## 2. Structure des composants

- Un composant = une responsabilité unique. Scinder dès qu'un composant dépasse ~80 lignes de JSX.
- Placer la logique de dérivation (memos, effets) **avant** le `return`.
- Nommer les composants en **PascalCase**, les signaux/fonctions en **camelCase**.
- Les handlers d'événements sont préfixés par `handle` (`handleClick`, `handleSubmit`).
- Les props de callback sont préfixées par `on` (`onSelect`, `onChange`).
- Extraire les composants purement présentationnels (sans état local) dans des fichiers séparés sous `components/`.

```tsx
// ✅ Structure type d'un composant
const ColorCard: Component<ColorCardProps> = (props) => {
  const [local, others] = splitProps(props, ["color", "onSelect"]);
  const label = createMemo(() => local.color.name.toUpperCase());

  return (
    <div {...others} onClick={() => local.onSelect(local.color)}>
      {label()}
    </div>
  );
};
```

---

## 3. Typage TypeScript strict

- `strict: true` dans `tsconfig.json` est **obligatoire**.
- Typer toutes les props avec une `interface` ou un `type` explicite. Pas de `any`.
- Utiliser `Component<Props>` de `solid-js` pour typer les composants.
- Préférer `type` pour les unions/intersections, `interface` pour les formes d'objets extensibles.
- Typer les valeurs de retour des fonctions utilitaires publiques.
- Utiliser les types utilitaires (`Readonly<>`, `Partial<>`, `Pick<>`) plutôt que de redéfinir.

```ts
// ✅
interface ColorCardProps {
  color: Color;
  onSelect: (color: Color) => void;
}

// ❌
const ColorCard = (props: any) => { ... };
```

---

## 4. Organisation des fichiers

```
src/
  components/      # Composants UI réutilisables (PascalCase.tsx)
  helpers/         # Fonctions pures utilitaires, sans effets de bord
  types/           # Types et interfaces TypeScript globaux
  stores/          # Stores réactifs globaux (createStore, createSignal)
  hooks/           # Primitives réactives réutilisables (useXxx)
```

- Un fichier = un seul export principal.
- Les helpers sont des **fonctions pures** testables sans contexte SolidJS.
- Les hooks (`useXxx`) encapsulent la logique réactive réutilisable.

---

## 5. Gestion de l'état

- **État local** → `createSignal` dans le composant.
- **État dérivé** → `createMemo`.
- **État global/partagé** → `createStore` avec `produce` pour les mutations imbriquées.
- Éviter de passer des setters profondément dans l'arbre. Utiliser le Context API (`createContext` + `useContext`).
- Ne jamais muter directement un objet de store — utiliser `setStore` ou `produce`.

```ts
// ✅ Mutation imbriquée correcte
setColors(produce((draft) => {
  draft[index].selected = true;
}));
```

---

## 6. Contrôle de flux JSX

- Utiliser les composants de flux natifs SolidJS : `<Show>`, `<For>`, `<Switch>/<Match>`, `<Index>`.
- **Ne jamais** utiliser `&&` ou ternaires imbriqués complexes dans le JSX — préférer `<Show>`.
- `<For>` pour les listes où l'identité des items compte ; `<Index>` si seul l'index compte.
- Toujours fournir une `fallback` à `<Show>` et `<Suspense>` si pertinent.

```tsx
// ✅
<For each={colors()} fallback={<p>Aucune couleur</p>}>
  {(color) => <ColorCard color={color} onSelect={handleSelect} />}
</For>

// ❌
{colors().map((color) => <ColorCard color={color} />)}
```

---

## 7. Performance

- **Granularité des signaux** : créer des signaux petits et ciblés plutôt qu'un seul objet signal monolithique.
- Éviter de créer des objets ou des tableaux inline dans le JSX — les extraire en memos.
- Utiliser `lazy()` pour le code-splitting des routes ou composants lourds.
- Ne pas abuser de `createEffect` pour recalculer des valeurs — c'est le rôle de `createMemo`.
- `<Dynamic>` pour les composants conditionnels dont le type change fréquemment.

---

## 8. Accessibilité (a11y)

- Tout élément interactif doit avoir un rôle ARIA approprié si ce n'est pas un élément natif (`button`, `a`, `input`).
- Les images non décoratives ont un `alt` descriptif.
- Assurer la navigabilité au clavier : `tabIndex`, `onKeyDown` pour les éléments custom.
- Contraste suffisant (WCAG AA minimum : 4.5:1 pour le texte normal).

---

## 9. Style et CSS

- Préférer les classes CSS (modules ou classes utilitaires) aux styles inline.
- Les variables CSS custom properties (`--color-primary`) pour les tokens de design.
- Pas de `!important` sauf cas exceptionnel documenté.
- Nommer les classes avec BEM ou une convention cohérente au projet.

---

## 10. Qualité du code

- **Fonctions pures** : même entrée → même sortie, pas d'effets de bord cachés.
- **Longueur de fonction** : < 30 lignes. Découper si dépassement.
- **Pas de code commenté** laissé en production. Supprimer, pas commenter.
- **Nommage explicite** : éviter les abréviations (`clr` → `color`, `idx` → `index`).
- **Early returns** pour réduire l'imbrication.
- **DRY** : toute logique dupliquée 2+ fois devient un helper ou un hook.

```ts
// ✅ Early return
function getContrastColor(hex: string): string {
  if (!hex) return "#000000";
  const luminance = computeLuminance(hex);
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
```

---

## 11. Sécurité

- Ne jamais utiliser `innerHTML` ou `insertAdjacentHTML` avec des données utilisateur — risque XSS.
- Ne pas exposer de clés API ou secrets dans le code source — utiliser des variables d'environnement (`import.meta.env`).
- Valider et assainir toutes les entrées utilisateur avant traitement.
- Préférer `textContent` à `innerHTML` pour insérer du texte dynamique.

---

## 12. Conventions de nommage résumées

| Entité | Convention | Exemple |
|---|---|---|
| Composant | PascalCase | `ColorGrid` |
| Signal | camelCase + `()` à l'appel | `count()` |
| Setter | `set` + PascalCase | `setCount` |
| Memo | camelCase | `sortedColors` |
| Hook | `use` + PascalCase | `useColorSort` |
| Handler | `handle` + Action | `handleUpload` |
| Prop callback | `on` + Action | `onSelect` |
| Fichier composant | PascalCase.tsx | `ColorGrid.tsx` |
| Fichier helper | camelCase.ts | `colorSort.ts` |
| Type/Interface | PascalCase | `ColorEntry` |

---

## 13. Checklist avant commit

- [ ] Aucun `any` TypeScript non justifié
- [ ] Aucune prop déstructurée directement
- [ ] Pas de `console.log` oublié
- [ ] Tous les `createEffect` ont un but de side-effect clair
- [ ] Les listes JSX utilisent `<For>` ou `<Index>`
- [ ] Les variables d'environnement sensibles sont dans `.env` (hors git)
- [ ] Le composant a une responsabilité unique
- [ ] Le code est lisible sans commentaire explicatif
