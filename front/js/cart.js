// Attend que le DOM soit chargé
window.onload = function () {getCart()};

/**
 * Panier.
 * Récupération du panier via le Local Storage.
 */
async function getCart()
{
    // productLs est un tableau vide
    const productLs = [];
    // Je récupére le panier dans le Local Storage
    const cart = JSON.parse(localStorage.getItem('product'));

    // Je vérifie si mon panier est vide
    if (cart === null || cart == 0)
    {
        alert(' Votre panier est vide ! ')

      // Si mon panier n'est pas vide
    } else {

        // Je fait une boucle sur l'Article dans le panier
        for (let i in cart)
        {
            // Je récupére l'ID de l'Article que j'avais stocké dans le Local Storage
            const elem = await getArticle(cart[i].id);
            elem.color = cart[i].color;
            elem.quantity = cart[i].quantity;
            // Je met mon Article complet (elem) dans le tableau productLs
            productLs.push(elem);

            // Affichage des Articles dans le panier
            displayProduct(elem, productLs);
        }

        // Affichage des Articles et du prix total
        getTotals(productLs);

        // J'attache un écouteur d'événement 'click' au bouton " Commander ! "
        document.getElementById("order").addEventListener("click", (event) =>
        {
            sendOrder(productLs, event);
        });

        // Formulaire
        eventForm();
    }

    /**
    * Récupération de l'ID des Articles.
    * @param {String} productId String qui contient l'ID de l'Article.
    * @returns
    */
    async function getArticle(productId)
    {
        const reponse = await fetch('http://localhost:3000/api/products/' + productId);
        return await reponse.json();
    }

    /**
    * Création et insertion des éléments dans la page panier.
    * @param {Object} elem Object qui contient UN seul Article.
    * @param {Array} productLs Array qui contient tous les Articles avec leur prix, leur quantité, etc ...
    */
    function displayProduct(elem, productLs)
    {
        // Affiche de l'Article dans la console
        console.log(elem);

        // élément "article"
        let productArticle = document.createElement("article");
        document.querySelector("#cart__items").appendChild(productArticle);
        productArticle.className = "cart__item";
        productArticle.setAttribute('data-id', elem._id);

        // élément "div"
        let productDivImg = document.createElement("div");
        productArticle.appendChild(productDivImg);
        productDivImg.className = "cart__item__img";

        // image
        let productImg = document.createElement("img");
        productDivImg.appendChild(productImg);
        productImg.src = elem.imageUrl
        productImg.alt = elem.altTxt;

        // élément "div"
        let productItemContent = document.createElement("div");
        productArticle.appendChild(productItemContent);
        productItemContent.className = "cart__item__content";

        // élément "div"
        let productItemContentTitlePrice = document.createElement("div");
        productItemContent.appendChild(productItemContentTitlePrice);
        productItemContentTitlePrice.className = "cart__item__content__titlePrice";

        // h2
        let productTitle = document.createElement("h2");
        productItemContentTitlePrice.appendChild(productTitle);
        productTitle.textContent = elem.name;

        // couleur
        let productColor = document.createElement("p");
        productTitle.appendChild(productColor);
        productColor.textContent = elem.color;

        // prix
        let productPrice = document.createElement("p");
        productItemContentTitlePrice.appendChild(productPrice);
        productPrice.textContent = elem.price + " €";

        // élément "div"
        let productItemContentSettings = document.createElement("div");
        productItemContent.appendChild(productItemContentSettings);
        productItemContentSettings.className = "cart__item__content__settings";

        // élément "div"
        let productItemContentSettingsQuantity = document.createElement("div");
        productItemContentSettings.appendChild(productItemContentSettingsQuantity);
        productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

        // " Qté : "
        let productQte = document.createElement("p");
        productItemContentSettingsQuantity.appendChild(productQte);
        productQte.textContent = "Qté : ";

        // quantité
        let productQuantity = document.createElement("input");
        productItemContentSettingsQuantity.appendChild(productQuantity);
        productQuantity.value = elem.quantity;
        productQuantity.className = "itemQuantity";
        productQuantity.setAttribute("type", "number");
        productQuantity.setAttribute("min", "1");
        productQuantity.setAttribute("max", "100");
        productQuantity.setAttribute("name", "itemQuantity");
        // J'attache un écouteur d'événement 'change' pour la modification de la quantité
        productQuantity.addEventListener("change", (event) =>
        {
            modifyQtt(event, productLs, elem.color, elem._id);
        });

        // élément "div"
        let productItemContentSettingsDelete = document.createElement("div");
        productItemContentSettings.appendChild(productItemContentSettingsDelete);
        productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

        // "p" supprimer
        let productRemove = document.createElement("p");
        productItemContentSettingsDelete.appendChild(productRemove);
        productRemove.className = "deleteItem";
        productRemove.textContent = "Supprimer";
        // J'attache un écouteur d'événement 'click' au bouton " Supprimer "
        productRemove.addEventListener("click", (event) =>
        {
            deleteProduct(event, productLs, elem.color, elem._id);
        });
    }
}

/**
 * Récupération total des quantités et du prix des Articles.
 * @param {Array} productLs Array qui contient tous les Articles avec leur prix, leur quantité, etc ...
 */
function getTotals(productLs)
{
    // Je récupére l'input
    var elementsQtt = document.getElementsByClassName('itemQuantity');
    // Je parcoure mon tableau myLength
    var myLength = elementsQtt.length

    // Récupération de la quantité total
    totalQtt = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalQtt += elementsQtt[i].valueAsNumber;
    }

    // Je récupére l'id 
    const productTotalQuantity = document.getElementById('totalQuantity');
    // Je met la quantité total à l'id
    productTotalQuantity.textContent = totalQtt;
    // Affiche la quantité total dans la console
    console.log(totalQtt);

    // Récupération du prix total
    totalPrice = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalPrice += elementsQtt[i].valueAsNumber * productLs[i].price;
    }

    // Je récupére l'id
    const productTotalPrice = document.getElementById('totalPrice');
    // Je met le prix total à l'id
    productTotalPrice.textContent = totalPrice;
    // Affiche le prix total dans la console
    console.log(totalPrice);
}

/**
 * Modification d'une quantité d'un Article.
 * @param {Event} event Event qui change la quantité de l'Article.
 * @param {Array} productLs Array qui contient tous les Articles avec leur prix, leur quantité, etc ...
 * @param {String} color String qui contient la couleur de l'Article.
 * @param {String} id String qui contient l'ID de l'Article.
 */
function modifyQtt(event, productLs, color, id)
{
    // Récupération de la valeur modifiée
    const qttModifValue = event.target.value;
    const ls = JSON.parse(localStorage.getItem('product'));

    productLs.forEach((part,index) =>
    {
        // Affiche de l'index de l'Article dans la console
        console.log(index);

        // Je vérifie si l'Article à le même ID et couleur que l'Article que je veux modifié
        if (part._id === id && part.color === color)
        {
            // Modification de la quantité dans le Local Storage
            ls[index].quantity = qttModifValue;

            // Modification de la quantité dans le tableau productLs
            productLs[index].quantity = qttModifValue;
        }
    });

    // Remplacement de l'ancien Local Storage par le nouveau avec la quantité mise à jour
    localStorage.setItem('product', JSON.stringify(ls));

    // Recalcule de la quantité et du prix
    getTotals(productLs);
}

/**
 * Suppression d'un Article dans le panier.
 * @param {Event} event Event qui supprime l'Article du panier.
 * @param {Array} productLs Array qui contient tous les Articles avec leur prix, leur quantité, etc ...
 * @param {String} color String qui contient la couleur de l'Article.
 * @param {String} id String qui contient l'ID de l'Article.
 */
function deleteProduct(event, productLs, color, id)
{
    // Affiche le tableau, l'event, la color et l'id dans la console
    console.log(productLs);
    console.log(event.target);
    console.log(color);
    console.log(id);

    const ls = JSON.parse(localStorage.getItem("product"));

    productLs.forEach((elem, index) => 
    {
        // Je vérifie si l'Article à le même ID et couleur que l'Article que je veux supprimé
        if (elem._id === id && color == elem.color)
        {

            // Suppression de l'index dans productLs
            productLs.splice(index, 1);

            // Suppression de l'index dans le localStorage
            ls.splice(index, 1);

            alert(' Ce produit a été supprimé du panier ! ');
        }
    });

    // Remplacement de l'ancien Local Storage par le nouveau avec la quantité mise à jour
    localStorage.setItem("product", JSON.stringify(ls));

    // Je supprime l'Article de la page panier
    event.target.closest("article").remove();

    // Recalcule de la quantité et du prix
    getTotals(productLs);
}

/**
 * Formulaire.
 * Vérification des champs.
 */
function eventForm()
{
    // Je récupére le formulaire
    const form = document.querySelector(".cart__order__form");

    // J'Attache un écouteur d'événement 'blur', puis une fonction sur les champs
    // Prénom
    form.firstName.addEventListener("blur", function ()
    {
        // this représente le champ input du formulaire
        validFirstName(this);
    });

    // Nom
    form.lastName.addEventListener("blur", function ()
    {
        validLastName(this);
    });

    // Adresse
    form.address.addEventListener("blur", function ()
    {
        validAddress(this);
    });

    // Ville
    form.city.addEventListener("blur", function ()
    {
        validCity(this);
    });

    // Email
    form.email.addEventListener("blur", function ()
    {
        validEmail(this);
    });
}

// Validation FIRSTNAME
const validFirstName = function (inputFirstName)
{
    console.log(inputFirstName);

    // Création des expressions régulières
    let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    // Je vérifie si le FirstName correspond à la Regex mise en place
    if (nameRegExp.test(inputFirstName.value))
    {
        firstNameErrorMsg.textContent = "";
        return true;

      // Si ça ne correspond pas à la Regex
    } else {
        firstNameErrorMsg.textContent = "Prénom non valide.";
        return false;
    }
};

// Validation LASTNAME
const validLastName = function (inputLastName)
{
    console.log(inputLastName);

    let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (nameRegExp.test(inputLastName.value))
    {
        lastNameErrorMsg.textContent = "";
        return true;

    } else {
        lastNameErrorMsg.textContent = "Nom non valide.";
        return false;
    }
};

// Validation ADDRESS
const validAddress = function (inputAddress)
{
    console.log(inputAddress);

    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+$");
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value))
    {
        addressErrorMsg.textContent = "";
        return true;

    } else {
        addressErrorMsg.textContent = "Adresse non valide.";
        return false;
    }
};

// Validation CITY
const validCity = function (inputCity)
{
    console.log(inputCity);

    let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let cityErrorMsg = inputCity.nextElementSibling;

    if (nameRegExp.test(inputCity.value))
    {
        cityErrorMsg.textContent = "";
        return true;

    } else {
        cityErrorMsg.textContent = "Ville non valide.";
        return false;
    }
};

// Validation EMAIL
const validEmail = function (inputEmail)
{
    console.log(inputEmail);

    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value))
    {
        emailErrorMsg.textContent = "";
        return true;

    } else {
        emailErrorMsg.textContent = "Email non valide.";
        return false;
    }
}

/**
 * Commander.
 * Récupération et analysation des données saisies par l'utilisateur dans le formulaire.
 * @param {Array} productLs Array qui contient tous les Articles avec leur prix, leur quantité, etc ...
 * @param {Event} event Event qui confirme la commande.
 * @returns
 */
function sendOrder(productLs, event)
{
    event.preventDefault();
    console.log(productLs);

    // Je récupére les input
    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAddress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputEmail = document.getElementById('email');

    // Je vérifie si l'utilisateur a bien remplit les champs du formulaire
    if (
    !validFirstName(inputFirstName) ||
    !validLastName(inputLastName) ||
    !validAddress(inputAddress) ||
    !validCity(inputCity) ||
    !validEmail(inputEmail)
    ) {
        alert(" Veuillez remplir correctement les champs du formulaire ! ");
        return false;
    }

    // idProd est un tableau vide
    let idProd = [];
    for (let i = 0; i < productLs.length; i++)
    {
        idProd.push(productLs[i]._id);
    }
    console.log(idProd);

    // Création d'un objet contact avec un tableau des Articles
    const order =
    {
        contact :
        {
            firstName: inputFirstName.value,
            lastName: inputLastName.value,
            address: inputAddress.value,
            city: inputCity.value,
            email: inputEmail.value,
        },
        products: idProd,
    } 

    console.log(order);

    // Création de l'entête de la requête
    const options = {
        // Méthode HTTP
        method: 'POST',
        // headers qui donnent un peu plus d'informations su rnotre requête
        headers:
        {
            "content-type": "application/json"
        },
        // On souhaite envoyé du json à notre service web, donc on le stringify
        body: JSON.stringify(order),
    }

    // Envoi de la requête POST au back-end
    fetch("http://localhost:3000/api/products/order", options)
    // Récupére le résultat de la requête au format json
    .then((reponse) => reponse.json())
    .then((result) =>
    {
        console.log(result);
        // Supprime l'Article du Local Storage
        localStorage.removeItem('product');

        // Redirige l'utilisateur sur la page confirmation
        // Je récupére l'ID de commande dans la réponse
        document.location.href = "confirmation.html?orderId=" + result.orderId;
    })
}