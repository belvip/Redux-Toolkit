# React Redux Project

Ce projet utilise **React** et **Redux** pour gérer l'état de l'application de manière centralisée. Le store Redux est configuré avec `@reduxjs/toolkit` pour simplifier les configurations et offrir une structure modulaire à l'état global de l'application.

## Etapes

## Etape 1

### Configuration du Store Redux

Dans notre projet, le store Redux est configuré dans le fichier `store.js` à l'aide de` @reduxjs/toolkit`, qui permet de simplifier l'implémentation en fournissant des outils comme `configureStore`. Ce fichier initialise le store en combinant plusieurs "slices" (portions d'état) que nous définissons pour notre application.

### Code du fichier `store.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import modalReducer from '../features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
  }
});

```
**Explication des Concepts :**

* `configureStore` : Cette fonction de `@reduxjs/toolkit` simplifie la configuration du store Redux en ajoutant par défaut des fonctionnalités utiles, comme la configuration du DevTools Redux, le middleware thunk pour gérer les actions asynchrones, et un contrôle automatique des erreurs.

* **Reducers :**
  * `cartReducer` : Gère l'état lié au panier (cart) et est importé du fichier `cartSlice.js` dans le dossier `features/cart`.
  * `modalReducer` : Gère l'état du composant modal (fenêtre modale) et est importé du fichier `modalSlice.js` dans le dossier `features/modal`.

  Ces reducers sont associés aux clés `cart` et `modal`, permettant de les référencer de manière distincte dans l'état global de l'application.

  --

 ### Structure du Projet
 Voici la structure générale du projet :

  ```plaintext
      src/
    ├── app/
    │   └── store.js               # Configuration du store Redux
    ├── features/
    │   ├── cart/
    │   │   └── cartSlice.js       # Slice pour gérer l'état du panier
    │   ├── modal/
    │   │   └── modalSlice.js      # Slice pour gérer l'état de la fenêtre modale
    ├── components/
    │   ├── Cart.js                # Composant de gestion du panier
    │   ├── Modal.js               # Composant de gestion de la fenêtre modale
    └── App.js                     # Composant principal de l'application

  ```

 ### Fonctionnalités et Slices 

 ## Cart (Panier)

 Le slice `cartSlice` gère l'état du panier. Voici un exemple d'état et d'actions dans `cartSlice.js` :

 ```java
  // cartSlice.js
  import { createSlice } from '@reduxjs/toolkit';

  const cartSlice = createSlice({
    name: 'cart',
    initialState: {
      items: [],
      total: 0,
    },
    reducers: {
      addItem: (state, action) => { /* Code pour ajouter un article */ },
      removeItem: (state, action) => { /* Code pour supprimer un article */ },
    },
  });

  export const { addItem, removeItem } = cartSlice.actions;
  export default cartSlice.reducer;

 ```

 **Modal (Fenêtre modale)**

 Le slice `modalSlice` gère l'affichage de la fenêtre modale :

 ## Composants

### CartContainer

Le composant `CartContainer` affiche le contenu du panier de l'utilisateur et fournit une option pour le vider. Il utilise les hooks `useDispatch` et `useSelector` pour interagir avec le store Redux.

--
#### Code du Composant

```javascript
import React from 'react';
import CartItem from './CartItem';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../features/modal/modalSlice';

const CartContainer = () => {
    const dispatch = useDispatch();
    const { cartItems, total, amount } = useSelector((store) => store.cart);

    if (amount < 1) {
        return (
            <section className='cart'>
                <header>
                    <h2>your bag</h2>
                    <h4 className='empty-cart'>is currently empty</h4>
                </header>
            </section>
        );
    }
    return (
        <section className='cart'>
            <h2>your bag</h2>
            <div>
                {cartItems.map((item) => {
                    return <CartItem key={item.id} {...item} />
                })}
            </div>
            <footer>
                <hr />
                <div className="cart-total">
                    <h4>total <span>{total.toFixed(2)}xaf</span></h4>
                </div>
            </footer>
            <button className="btn clear-btn" onClick={() => dispatch(openModal())}>clear cart</button>
        </section>
    );
}

export default CartContainer;
```

**Explication des Concepts Utilisés**

`useDispatch` et `useSelector` : Ces hooks Redux sont utilisés pour accéder et modifier l'état global de l'application :

  * useDispatch est utilisé pour déclencher des actions, ici l'action openModal pour ouvrir la fenêtre modale de confirmation.
  * useSelector permet d'accéder à l'état du panier `(cart)` dans le store, y compris les éléments `(cartItems)`, le montant total `(total)`, et la quantité d'articles `(amount)`.
  * **Condition d'affichage du panier vide :** Si la quantité totale amount est inférieure à 1, un message est affiché pour indiquer que le panier est vide.

  * **Bouton "clear cart"** : Un bouton de suppression qui déclenche l'action openModal pour afficher une confirmation avant de vider le panier.

### Structure et Affichage des Articles
Chaque article du panier est rendu avec le composant `CartItem`. Le composant CartContainer gère l'affichage de chaque élément à l'aide de la fonction `map` sur `cartItems`.

**Fonctionnalités**
  * **Affichage dynamique** : Le composant ajuste l'affichage du panier en fonction de la quantité d'articles.
  * **Affichage du total :** Le total du panier est calculé et affiché en format monétaire avec deux décimales (exemple : `200.00xaf`).
  * **Bouton de vidage du panier** : Ce bouton utilise `openModal` pour afficher une fenêtre de confirmation avant de supprimer tous les articles du panier.

  ### CartItem

Le composant `CartItem` représente un article individuel du panier. Il affiche les informations de l'article et permet d'ajuster sa quantité ou de le retirer du panier.

--
#### Code du Composant

```javascript
import React from 'react';
import { ChevronDown, ChevronUp } from '../icons';
import { removeItem, increase, decrease } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';

const CartItem = ({ id, img, title, price, amount }) => {
    const dispatch = useDispatch();
    return (
        <article className='cart-item'>
            <img src={img} alt={title} />
            <div>
                <h4>{title}</h4>
                <h4 className='item-price'>{price}xaf</h4>
                <button className='remove-btn' onClick={() => {
                    dispatch(removeItem(id));
                }}>remove</button>
            </div>

            <div>
                <button className='amount-btn' onClick={() => {
                    dispatch(increase({ id }))
                }}>
                    <ChevronUp />
                </button>

                <p className='amount'>{amount}</p>

                <button className='amount-btn' onClick={() => {
                    if (amount === 1) {
                        dispatch(removeItem(id));
                        return;
                    }
                    dispatch(decrease({ id }))
                }}>
                    <ChevronDown />
                </button>
            </div>
        </article>
    );
}

export default CartItem;
```

**Explication des Concepts Utilisés**
  * `removeItem`, `increase`, et `decrease` : Ces actions sont importées depuis cartSlice et déclenchées via `dispatch`. Elles permettent :

    * `removeItem` : Supprime l'article du panier.
    * `increase` : Augmente la quantité de l'article.
    * `decrease` : Diminue la quantité de l'article, et si celle-ci atteint 1, l'article est retiré.
  * **Boutons Chevron** : Les icônes ChevronUp et ChevronDown permettent d'ajuster la quantité de chaque article.

**Fonctionnalités du Composant**
  * **Affichage des informations** : Affiche l'image, le titre et le prix de chaque article.
  * **Contrôle de la quantité** : Utilise des boutons pour augmenter ou diminuer la quantité de  l'article.
  * **Suppression de l'article** : Le bouton "remove" permet de retirer un article spécifique du panier.
**Utilisation**
Le composant `CartItem` est utilisé dans le composant `CartContainer` pour afficher chaque article dans le panier. En ajustant la quantité ou en supprimant un article, le composant déclenche les actions Redux appropriées pour mettre à jour l'état global du panier.

### Modal

Le composant `Modal` affiche une fenêtre modale de confirmation pour supprimer tous les articles du panier. Il utilise Redux pour déclencher des actions de suppression du contenu du panier et pour fermer la modale.

#### Code du Composant

```javascript
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";

const Modal = () => {
    const dispatch = useDispatch();
    return (
        <aside className="modal-container">
            <div className="modal">
                <h4>remove all items from your shopping cart ?</h4>
                <div className="btn-container">
                    <button type="button" className="btn confirm-btn" 
                        onClick={() => {
                            dispatch(clearCart())
                            dispatch(closeModal())
                        }}
                    >
                        confirm
                    </button>
                    <button type="button" className="btn clear-btn"
                        onClick={() => {
                            dispatch(closeModal())
                        }}
                    >
                        cancel
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Modal;
```
--
### Explication des Concepts Utilisés
**Actions** `clearCart` et `closeModal` : Importées de `cartSlice` et `modalSlice`, ces actions permettent :

  * `clearCart` : Vide le panier en supprimant tous les articles.
  * `closeModal` : Ferme la fenêtre modale.
**Boutons de confirmation et d'annulation :**

  * **Bouton "confirm"** : Déclenche `clearCart` pour vider le panier, puis `closeModal` pour fermer la modale.

  * **Bouton "cancel"** : Ferme uniquement la modale sans supprimer les articles du panier.


**Fonctionnalités du Composant**
  * **Confirmation de suppression** : Le composant s'assure que l'utilisateur souhaite supprimer tous les articles avant de procéder.
  * **Gestion de l'état via Redux** : Grâce à clearCart et closeModal, les actions de la modale sont connectées à l'état global de l'application, ce qui rend l'expérience utilisateur cohérente et réactive.

**Utilisation**
Le composant `Modal` est affiché lorsque l'utilisateur clique sur le bouton "clear cart" dans `CartContainer`. Il donne à l’utilisateur une option de confirmation avant la suppression de tous les articles, et se ferme automatiquement une fois l’action confirmée ou annulée.

--

### Navbar

Le composant `Navbar` représente la barre de navigation de l'application, affichant le titre de l'application et le nombre d'articles dans le panier.

#### Code du Composant

```javascript
import { CartIcon } from '../icons';
import { useSelector } from 'react-redux';
import React from 'react';

const Navbar = () => {
    const { amount } = useSelector((store) => store.cart);
    
    return (
        <nav>
            <div className="nav-center">
                <h3>redux toolkit</h3>
                <div className="nav-container">
                    <CartIcon />
                    <div className="amount-container">
                        <p className='total-amount'>{amount}</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
```

### Explication des Concepts Utilisés
  * `useSelector` : Permet d'accéder au store global de Redux, et ici, de récupérer la valeur `amount` depuis le cart. Cette valeur représente le nombre d'articles dans le panier, mis à jour dynamiquement en fonction de l'état global.

  * `CartIcon` : Une icône représentant le panier, importée depuis le dossier `icons`, qui sert de repère visuel pour la section du panier.

**Fonctionnalités du Composant**
  * **Affichage de l’état du panier** : Le composant affiche dynamiquement le nombre d'articles dans le panier (amount) à côté de l'icône CartIcon, offrant aux utilisateurs une visibilité rapide sur le contenu de leur panier.

  * **Responsive et dynamique** : La barre de navigation s’adapte automatiquement aux changements de l’état global du panier sans nécessiter de rechargement de la page.

## Utilisation
Le composant `Navbar` est idéal pour être inclus en haut de l'application, fournissant une vue en temps réel du nombre d'articles ajoutés au panier. Grâce à `useSelector`, il récupère l'état global de Redux pour afficher une information constamment mise à jour.

--

## cartSlice.js

Ce fichier contient la logique principale de Redux pour gérer l'état du panier, notamment le calcul des totaux, l'ajout/suppression d'articles, et la gestion des actions asynchrones.

### Explication du Code

#### Importations

- `createSlice` et `createAsyncThunk` : Utilisés pour créer un slice Redux et gérer les actions asynchrones.
- `axios` : Bibliothèque pour les requêtes HTTP.
- `openModal` : Action provenant du slice `modalSlice`, utilisée ici pour ouvrir une fenêtre modale lors d'une erreur de chargement.

#### URL de l'API

- `url` : Une API externe qui simule une liste d'articles de panier pour charger les données initiales du panier.

#### État Initial

```javascript
const initialState = {
    cartItems : cartItems,
    amount: 4,
    total: 0,
    isLoading: true,
};
```

  * `cartItems` : Contient les articles du panier. Initialement rempli avec des données statiques importées.
  * `amount` : Nombre d'articles dans le panier.
  * `total` : Montant total de la commande.
  * `isLoading` : Indicateur de chargement pour les requêtes asynchrones.

**Thunk Asynchrone** - `getCartItems`
La fonction `` getCartItems``  est un `` createAsyncThunk``  permettant de récupérer les articles du panier depuis une API externe.

```javascript
  export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI) => {
      try {
          const resp = await axios(url);
          thunkAPI.dispatch(openModal());
          return resp.data;
      } catch (error) {
          return thunkAPI.rejectWithValue('something went wrong');
      }
  });

```

--

## App.js

Le composant principal `App.js` est le point d'entrée de l'application. Il utilise `Redux` pour gérer l'état de l'application, en combinant des fonctionnalités de panier (cart) et de fenêtre modale (modal) et effectue des opérations côté client pour récupérer et calculer les données.

### Explication du Code

#### Imports et Dépendances

- `Navbar` et `CartContainer` : Composants enfants responsables de l'affichage de la barre de navigation et du panier, respectivement.
- `useDispatch`, `useSelector` : Hooks de `react-redux` utilisés pour accéder au store Redux et dispatcher les actions.
- `calculateTotals`, `getCartItems` : Actions asynchrones et synchrones issues de `cartSlice`, permettant de calculer les totaux et de récupérer les éléments du panier depuis une API.

#### Logique du Composant `App`

```javascript
function App() {
  const { cartItems, isLoading } = useSelector((store) => store.cart);
  const { isOpen } = useSelector((store) => store.modal);
  const dispatch = useDispatch();
}
```


## modalSlice.js

Ce fichier gère l'état d'ouverture et de fermeture d'une fenêtre modale dans l'application. Il utilise `createSlice` de Redux Toolkit pour centraliser la gestion de l'état `isOpen`, qui détermine si le modal est visible ou non.

### Explication du Code

#### État Initial

```javascript
const initialState = {
    isOpen: false,
};
```



## Explication des Concepts Utilisés

### CartContainer

- **`useDispatch`** et **`useSelector`** : Ces hooks Redux sont utilisés pour accéder et modifier l'état global de l'application :
  - **`useDispatch`** : Utilisé pour déclencher des actions, ici l'action `openModal` pour ouvrir la fenêtre modale de confirmation.
  - **`useSelector`** : Permet d'accéder à l'état du panier `(cart)` dans le store, y compris les éléments `(cartItems)`, le montant total `(total)`, et la quantité d'articles `(amount)`.

- **Condition d'affichage du panier vide** : Si la quantité totale `amount` est inférieure à 1, un message est affiché pour indiquer que le panier est vide.

- **Bouton "Vider le Panier"** : Un bouton qui déclenche l'action `openModal` pour afficher une confirmation avant de vider le panier.

---

### CartItem

- **`removeItem`**, **`increase`**, et **`decrease`** : Ces actions sont importées depuis `cartSlice` et déclenchées via `dispatch`. Elles permettent :
  - **`removeItem`** : Supprime l'article du panier.
  - **`increase`** : Augmente la quantité de l'article.
  - **`decrease`** : Diminue la quantité de l'article ; si elle atteint 1, l'article est retiré.

- **Boutons Chevron** : Les icônes `ChevronUp` et `ChevronDown` permettent d'ajuster la quantité de chaque article.

## Fonctionnalités du Composant

### CartContainer

- **Affichage des informations** : Affiche le titre, le prix et la quantité de chaque article dans le panier.
- **Interactivité** : Permet à l'utilisateur d'ajuster la quantité des articles et de vider le panier.

---

### CartItem

- **Affichage des informations** : Affiche l'image, le titre et le prix de chaque article.
- **Contrôle de la quantité** : Utilise des boutons pour augmenter ou diminuer la quantité de l'article.
- **Suppression de l'article** : Le bouton "Supprimer" permet de retirer un article spécifique du panier.

---

### Modal

- **Affichage de la fenêtre modale** : Confirme la suppression de tous les articles du panier.
- **Actions de confirmation** : Utilise Redux pour déclencher des actions de suppression du contenu du panier et pour fermer la modale.
