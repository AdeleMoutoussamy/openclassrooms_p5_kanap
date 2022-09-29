window.onload = function () {getCart()};

// Récupération du panier
async function getCart()
{
    const productLs = [];
    const cart = JSON.parse(localStorage.getItem('product'));
    
    if (cart === null || cart == 0)
    {
        alert('Votre panier est vide !')
 
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

        document.getElementById("order").addEventListener("click", (event) =>
        {
            postForm(productLs, event);
        });
    }

    async function getArticle(productId)
    {
        let reponse = await fetch('http://localhost:3000/api/products/' + productId);
        return await reponse.json();
    }

    function displayProduct(elem, productLs)
    {
        console.log(elem);

        // Insertion de l'élément "article"
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
        productRemove.addEventListener("click", (event) =>
        {
            deleteProduct(event, productLs, elem.color, elem._id);
        });
    }

}

function getTotals(productLs)
{
    // Récupération du total des quantités
    var elementsQtt = document.getElementsByClassName('itemQuantity');
    var myLength = elementsQtt.length,
    totalQtt = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalQtt += elementsQtt[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.textContent = totalQtt;
    console.log(totalQtt);

    // Récupération du prix total
    totalPrice = 0;

    for (var i = 0; i < myLength; ++i)
    {
        totalPrice += (elementsQtt[i].valueAsNumber * productLs[i].price);
    }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.textContent = totalPrice;
    console.log(totalPrice);
}

// Modification d'une quantité de produit
function modifyQtt(event, productLs, color, id)
{
    // console.log(productLs);
    // console.log(event.target.value);
    // console.log(color);
    // console.log(id);
    const qttModifValue = event.target.value;
    const ls = JSON.parse(localStorage.getItem('product'));
    productLs.forEach((part,index) =>
    {
        if (part._id === id && part.color === color)
        {
            console.log(index);

            //Modification de la quantité dans le Local Storage
            ls[index].quantity = qttModifValue;

            //Modification de la quantité dans le tableau productLs
            productLs[index].quantity = qttModifValue;
        }
    });

    localStorage.setItem('product', JSON.stringify(ls));

    // Recalcule de la quantité et du prix
    getTotals(productLs);
}

// Suppression d'un produit
function deleteProduct(event, productLs, color, id)
{
    console.log(productLs);
    console.log(event.target);
    console.log(color);
    console.log(id);

    // let btnRemove = document.querySelectorAll(".deleteItem");

    // for (let j = 0; j < btnRemove.length; j++)
    // {
    //     btnRemove[j].addEventListener("click" , (event) => {
    //         event.preventDefault();

    //         // Sélection de l'élément à supprimer en fonction de son id ET sa couleur
    //         let idDelete = productLs[j].id;
    //         let colorDelete = productLs[j].colorProduct;

    //         productLs = productLs.filter( elem => elem.id !== idDelete || elem.colorProduct !== colorDelete );

    //         localStorage.setItem("product", JSON.stringify(productLs));

    //         // Alerte produit supprimé
    //         alert("Ce produit a bien été supprimé du panier");

    //         // location.reload();
    //     })
    // }
}

// Formulaire
function getForm()
{
    let form = document.querySelector(".cart__order__form");

    // Création des expressions régulières
    let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+$");
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");


    // Prénom //
    // Écoute de la modification
    form.firstName.addEventListener('blur', function()
    {
        validFirstName(this);
    });

    // Validation
    const validFirstName = function(inputFirstName) 
    {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (nameRegExp.test(inputFirstName.value))
        {
            firstNameErrorMsg.textContent = '';

        } else {
            firstNameErrorMsg.textContent = 'Prénom non valide.';

        }
    };


    // Nom //
    // Écoute de la modification
    form.lastName.addEventListener('blur', function()
    {
        validLastName(this);
    });

    // Validation
    const validLastName = function(inputLastName)
    {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (nameRegExp.test(inputLastName.value))
        {
            lastNameErrorMsg.textContent = '';
        } else {
            lastNameErrorMsg.textContent = 'Nom non valide.'
        }
    };


    // Adresse //
    // Écoute de la modification
    form.address.addEventListener('blur', function()
    {
        validAddress(this);
    });

    // Validation
    const validAddress = function(inputAddress)
    {
        let adressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value))
        {
            adressErrorMsg.textContent = '';
        } else {
            adressErrorMsg.textContent = 'Adresse non valide.'
        }
    };


    // Ville //
    // Écoute de la modification
    form.city.addEventListener('blur', function()
    {
        validCity(this);
    });

    // Validation
    const validCity = function(inputCity)
    {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (nameRegExp.test(inputCity.value))
        {
            cityErrorMsg.textContent = '';
        } else {
            cityErrorMsg.textContent = 'Ville non valide.'
        }
    };


    // Email //
    // Écoute de la modification
    form.email.addEventListener('blur', function()
    {
        validEmail(this);
    });

    // Validation
    const validEmail = function(inputEmail)
    {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value))
        {
            emailErrorMsg.textContent = '';
        } else {
            emailErrorMsg.textContent = 'Email non valide.'
        }
    };

}
getForm();


function postForm(productLs, event)
{
    event.preventDefault();
    console.log(productLs)

    // Récupération des coordonnées du formulaire client
    let inputFirstName = document.getElementById('firstName');
    let inputLastName = document.getElementById('lastName');
    let inputAdress = document.getElementById('address');
    let inputCity = document.getElementById('city');
    let inputEmail = document.getElementById('email');

    // Construction d'un array depuis le Local Storage
    let idProd = [];
    for (let i = 0; i<productLs.length;i++)
    {
        idProd.push(productLs[i].id);
    }
    console.log(idProd);

    const order =
    {
        contact :
        {
            firstName: inputFirstName.value,
            lastName: inputLastName.value,
            address: inputAdress.value,
            city: inputCity.value,
            email: inputEmail.value,
        },
        products: idProd,
    } 

    // Requête POST
    // const options = await fetch("http://localhost:3000/api/products/order",
    // {
    //     method: 'POST',
    //     headers:
    //     {
    //         "Content-Type": "application/json" 
    //     },
    //     body: JSON.stringify(order),
    // })
    // options.then(async(reponse) =>
    // {
    //     try
    //     {
    //         console.log(reponse);
    //         const contenu = await reponse.json();
    //         console.log(contenu);

    //     } catch(error) {
    //         console.log(error);
    //     }
    // });

    const options = {
        method: 'POST',
        headers:
        {
            "content-type": "application/json"
        },
        body: JSON.stringify(order),
    }

    fetch("http://localhost:3000/api/products/order", options)
    .then((reponse) => reponse.json())
    .then((result) =>
    {
        console.log(result);
        localStorage.clear();
        localStorage.setItem("orderId", result.orderId);

        document.location.href = "confirmation.html";
    })
    // .catch((error) =>
    // {
    //     console.log(error);
    // })

}
