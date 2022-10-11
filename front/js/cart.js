// Attend que le DOM soit chargé
window.onload = function () {getCart()};

/**
 * Récupération du panier via le Local Storage.
 */
async function getCart()
{
    // productLs est un tableau vide
    const productLs = [];
    const cart = JSON.parse(localStorage.getItem('product'));
    
    if (cart === null || cart == 0)
    {
        alert(' Votre panier est vide ! ')
 
    } else {

        for (let i in cart)
        {
            const elem = await getArticle(cart[i].id);
            elem.color = cart[i].color;
            elem.quantity = cart[i].quantity;
            productLs.push(elem);

            displayProduct(elem, productLs);
        }

        getTotals(productLs);

        // Attacher un écouteur d'événement au bouton " Commander ! "
        document.getElementById("order").addEventListener("click", (event) =>
        {
            postForm(productLs, event);
        });

        eventForm();
    }

    /**
     * Récupérations de l'ID des articles.
     * @param {String} productId String qui contient l'ID des articles.
     * @returns
     */
    async function getArticle(productId)
    {
        const reponse = await fetch('http://localhost:3000/api/products/' + productId);
        return await reponse.json();
    }

    /**
     * Création et insertion des éléments dans la page panier.
     * @param {Object} elem Object qui contient Un seul article.
     * @param {Array} productLs Array qui contient le/les articles dans le panier. 
     */
    function displayProduct(elem, productLs)
    {
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

        // "Qté : "
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
        // Attacher un écouteur d'événement pour la modification de la quantité
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
        // Attacher un écouteur d'événement au bouton " Supprimer "
        productRemove.addEventListener("click", (event) =>
        {
            deleteProduct(event, productLs, elem.color, elem._id);
        });
    }

}

/**
 * Récupération total des quantités.
 * @param {Array} productLs Array qui contient le/les articles dans le panier.
 */
function getTotals(productLs)
{
    var elementsQtt = document.getElementsByClassName('itemQuantity');
    var myLength = elementsQtt.length,
    totalQtt = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalQtt += elementsQtt[i].valueAsNumber;
    }

    const productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.textContent = totalQtt;
    console.log(totalQtt);

    // Récupération du prix total
    totalPrice = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalPrice += elementsQtt[i].valueAsNumber * productLs[i].price;
    }

    const productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.textContent = totalPrice;
    console.log(totalPrice);
}

/**
 * Modification d'une quantité de l'article.
 * @param {Event} event Event qui change la quantité de l'article.
 * @param {Array} productLs Array qui contient le/les articles dans le panier.
 * @param {String} color String qui contient la couleur de l'article.
 * @param {String} id String qui contient l'ID de l'article.
 */
function modifyQtt(event, productLs, color, id)
{
    // Récupération de la valeur modifiée
    const qttModifValue = event.target.value;
    const ls = JSON.parse(localStorage.getItem('product'));

    // Boucle sur le tableau productLs avec "part" et "index" en paramètre
    productLs.forEach((part,index) =>
    {
        console.log(index);

        if (part._id === id && part.color === color)
        {
            // Modification de la quantité dans le Local Storage
            ls[index].quantity = qttModifValue;

            // Modification de la quantité dans le tableau productLs
            productLs[index].quantity = qttModifValue;
        }
    });

    // Remplacement de l'ancien Local Storage par el nouveau avec la quantité mis à jour
    localStorage.setItem('product', JSON.stringify(ls));

    // Recalcule de la quantité et du prix
    getTotals(productLs);
}

/**
 * Suppression d'un article dans le panier.
 * @param {Event} event Event qui supprime l'article du panier.
 * @param {Array} productLs Array qui contient le/les articles dans le panier.
 * @param {String} color String qui contient la couleur de l'article.
 * @param {String} id String qui contient l'ID de l'article.
 */
function deleteProduct(event, productLs, color, id)
{
    console.log(productLs);
    console.log(event.target);
    console.log(color);
    console.log(id);

    const ls = JSON.parse(localStorage.getItem("product"));

    // Boucle sur le tableau productLs avec "part" et "index" en paramètre
    productLs.forEach((elem, index) => 
        {
            if (elem._id === id && color == elem.color)
        {

            // Suppression de l'index dans productLs
            productLs.splice(index, 1);

            // Suppression de l'index dans le localStorage
            ls.splice(index, 1);

            alert(' Ce produit a été supprimé du panier ! ');
        }
    });

    localStorage.setItem("product", JSON.stringify(ls));

    // Je supprime l'article de la page panier
    event.target.closest("article").remove();

    // Recalcule de la quantité et du prix
    getTotals(productLs);
}

/**
 * Formulaire.
 * 
 */
function eventForm()
{
    const form = document.querySelector(".cart__order__form");

    // Attacher un écouteur d'événement sur la modification des champs
    // Prénom
    form.firstName.addEventListener("blur", function ()
    {
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

    if (nameRegExp.test(inputFirstName.value))
    {
        firstNameErrorMsg.textContent = "";
        return true;

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
 * Récupération et analysation des données saisies par l'utilisateur dans le formulaire.
 * Passer la commande.
 * @param {Array} productLs Array qui le/les articles dans le panier.
 * @param {Event} event Event qui confirme la commande.
 * @returns
 */
function postForm(productLs, event)
{
    event.preventDefault();
    console.log(productLs);

    // Récupération des coordonnées du formulaire client
    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAddress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputEmail = document.getElementById('email');

    // On vérifie que les champs sont correctement remplis suivant les regex mises en place
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

    //
    let idProd = [];
    for (let i = 0; i < productLs.length; i++)
    {
        idProd.push(productLs[i]._id);
    }
    console.log(idProd);

    //
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

    // Requête POST sur l'API
    const options = {
        method: 'POST',
        headers:
        {
            "content-type": "application/json"
        },
        body: JSON.stringify(order),
    }

    // Récupération de l'ID de commande
    fetch("http://localhost:3000/api/products/order", options)
    .then((reponse) => reponse.json())
    .then((result) =>
    {
        console.log(result);
        localStorage.removeItem('product');

        document.location.href = "confirmation.html?orderId=" + result.orderId;
    })
}