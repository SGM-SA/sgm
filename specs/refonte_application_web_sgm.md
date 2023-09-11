# Refonte de l'application web

Ce document a pour but de décrire les méthodes et technologies mis en place pour la refonte de l'application web SGM.
Il ne s'agit pas réellement d'un cahier des charges, ce dernier se trouvant sur notion [à cette adresse](https://faceted-calendula-4a5.notion.site/SGM-045b728ee5fb4dfc93ce11d335314b7c?pvs=4).

- [Principes](#principes)
- [Technologies](#technologies)
- [Quelques points clés](#quelques-points-clés)
    - [Automatisation](#automatisation)
    - [Monorepo](#monorepo)
    - [CLI](#cli)
    - [Documentation](#documentation)
- [Conclusion](#conclusion)

## Principes

La refonte du projet repose sur 4 principes :

- La robustesse du code
- La facilité de développement
- La vitesse de développement
- La maintenabilité dans le temps

Tout est mis en oeuvre pour maximiser au possible ces 4 principes, que ce soit par les technologies choisies, les méthodes employées, les systèmes mis en place ou encore le code produit.

Mais, plus qu'une "refonte", il s'agit en fait ici d'un nouveau départ, d'une écriture de A à Z de l'application actuelle.

## Technologies

Dans un premier temps, une réécriture en `typescript` est nécessaire. Cela permet de gagner en robustesse et en lisibilité du code. Il s'agit d'un langage fortement typé qui permet de détecter des erreurs à la compilation plutôt qu'à l'exécution. Cela permet de gagner du temps et de la qualité et est presque obligatoire pour un projet web moderne.

Dans un second temps, il est nécessaire de réécrire l'application en utilisant les dernières technologies et les meilleures pratiques :
- `react` pour la librairie d'UI. Il s'agit de la librairie d'UI la plus utilisée et la plus performante.
- `vite` pour le bundler. Il s'agit d'un bundler très rapide et moderne qui permet de faire du hot-reload et de la compilation à la volée. Il est très performant, permet de gagner du temps de développement et est la solution la plus efficace pour bundler un projet react de nos jours.
- `nx` pour gérer l'entiereté du projet dans un seul repository git. Il s'agit d'un outil qui permet de gérer un monorepo de manière efficace. Il permet de gérer les dépendances entre les projets, de gérer les tests, de gérer les builds, de gérer les générateurs de code, etc.
- `storybook` pour tester, documenter et développer de manière isolée les composants. Il permet de troquer un peu de temps de développement supplémentaire contre des composants d'une bien meilleure qualité et surtout beaucoup plus maintenables dans le temps puisque développés de manière "pure". Il offre également une documentation et un environnement de test très utiles pour les développeurs.
- `cypress` pour les tests bout-en-bout. Il s'agit d'un outil très performant et très simple à utiliser pour faire des tests bout-en-bout.
- `vitest` pour les tests unitaires. Il s'agit d'outils très performants et très simples à utiliser pour faire des tests unitaires.
- `chakra-ui` pour faire facilement un design system robuste et commun. Il s'agit d'une librairie de composants très performante et très simple à utiliser. Elle permet de faire un design system robuste et commun.
- Des générateurs cli pour générer facilement des nouveaux composants, pages, etc
- ci/cd complet `github actions`
- `eslint` et `prettier` pour les configuration de standardisation de code.

## Quelques points clés

#### Automatisation

L'un des points clés de cette refonte réside dans la mise en place de tout un système d'auto-génération de code entre le back-end et le front-end, afin d'avoir un typage bout-en-bout constant et juste et une synchronisation des modèles de données entre le back-end et le front-end. Ce simple point permet de grandement améliorer la robustesse du code, la facilité ainsi que la vitesse de développement et enfin la maintenabilité dans le temps. C'est à dire nos 4 principes de refonte cités précédement.

Dans notre cas précis, la "Single Source of Truth" (seule source de vérité) est le back-end. C'est lui qui définit les modèles de données et les types. Le front-end va donc s'adapter à ces modèles de données et à ces types.

#### Monorepo

Un monorepo permet de gérer l'entiereté du projet dans un seul repository git. Cela permet de gérer les dépendances entre les projets, de gérer les tests, les builds, les générateurs de code, etc. 

Il est très important dans notre cas puisque l'on peut ainsi gérer à la fois le back-end et le front-end dans le même repository, et donc faciliter l'auto-génération et la synchronisation des modèles de données et des types entre le back-end et le front-end.

#### CLI

L'utilisation d'un CLI fait maison adapté aux besoins spécifiques du projet permet de générer facilement des nouveaux composants, pages, etc. Cela permet de grandement gagner du temps de développement.

#### Documentation

Je mets un point d'honneur à documenter le code au maximum, et à surtout expliquer le fonctionnement intrinsèque de toute cette machinerie mis en place afin que, le code final puisse être maintenu dans le temps par n'importe quel développeur et que l'on puisse en faire une base saine pour de futurs projets.

## Conclusion

Ce projet, bien plus qu'une simple refonte d'application web afin de la rendre viable dans le temps et robuste au niveau du code, est une véritable usine faisant cohabiter en harmonie de nombreux outils et technologies modernes permettant de gagner en qualité, en robustesse, en vitesse et en maintenabilité dans le temps. 

---

Copyright (c) 2023 Bartholomé Gili