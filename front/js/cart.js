window.onload = function () {getCart()};

// Récupération du panier
const productLs = JSON.parse(localStorage.getItem("product"));

async function getCart()
{
    if (productLs === null || productLs == 0)
    {
        alert('Votre panier est vide !')
 
    } else {

        for (let i of productLs)
        {
            // Récupération de l'ID de chaque produit
            
            // Appeler l'API avec l'ID
            // fetch('http://localhost:3000/api/products/' + productId)

            // Insertion de l'élément "article"
            let productArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', productLs[i].id);

            // élément "div"
            let productDivImg = document.createElement("div");
            productArticle.appendChild(productDivImg);
            productDivImg.className = "cart__item__img";

            // image
            let productImg = document.createElement("img");
            productDivImg.appendChild(productImg);
            productImg.src = productLs[i].imgProduct;
            productImg.alt = productLs[i].altImgProduct;

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
            productTitle.textContent = productLs[i].nameProduct;

            // couleur
            let productColor = document.createElement("p");
            productTitle.appendChild(productColor);
            productColor.textContent = productLs[i].color;

            // prix
            let productPrice = document.createElement("p");
            productItemContentTitlePrice.appendChild(productPrice);
            productPrice.textContent = productLs[i].priceProduct + " €";

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
            productQuantity.value = productLs[i].quantity;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // "p" supprimer
            let productRemove = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productRemove);
            productRemove.className = "deleteItem";
            productRemove.textContent = "Supprimer";
        }
    }

    getTotals();
}

function getTotals()
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
        totalPrice += (elementsQtt[i].valueAsNumber * productLs[i].priceProduct);
    }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.textContent = totalPrice;
    console.log(totalPrice);

    modifyQtt();
}

// Modification d'une quantité de produit
function modifyQtt()
{
    let qttModif = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < qttModif.length; k++)
    {
        qttModif[k].addEventListener("change" , (event) => {
            event.preventDefault();

            // Sélection de l'élément à modifier en fonction de son id ET sa couleur
            let quantityModif = productLs[k].quantityProduct;
            let qttModifValue = qttModif[k].valueAsNumber;

            const resultFind = productLs.find((elem) => elem.qttModifValue !== quantityModif);

            resultFind.quantityProduct = qttModifValue;
            productLs[k].quantityProduct = resultFind.quantityProduct;

            localStorage.setItem("product", JSON.stringify(productLs));

            // location.reload();
        })
    }

    deleteProduct();
}

// Suppression d'un produit
function deleteProduct()
{
    let btnRemove = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < btnRemove.length; j++)
    {
        btnRemove[j].addEventListener("click" , (event) => {
            event.preventDefault();

            // Sélection de l'élément à supprimer en fonction de son id ET sa couleur
            let idDelete = productLs[j].id;
            let colorDelete = productLs[j].colorProduct;

            productLs = productLs.filter( elem => elem.id !== idDelete || elem.colorProduct !== colorDelete );

            localStorage.setItem("product", JSON.stringify(productLs));

            // Alerte produit supprimé
            alert("Ce produit a bien été supprimé du panier");

            // location.reload();
        })
    }
}

// Formulaire
function getForm()
{
    // Ajout des Regex
    let form = document.querySelector(".cart__order__form");

    // Création des expressions régulières
    let nameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+$");
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");


    // Prénom //
    // Écoute de la modification
    form.firstName.addEventListener('change', function()
    {
        validFirstName(this);
    });

    // Validation
    const validFirstName = function(inputFirstName) 
    {
        // FirsNameErrorMsg = inputFirstName.nextElementSibling;

        if (nameRegExp.test(inputFirstName.value))
        {
            // FirstNameErrorMsg.innerHMTL = 'Prénom Valide.';
            alert('Prénom Valide.');
        } else {
            // FirstNameErrorMsg.innerHTML = 'Prénom non valide';
            alert('Prénom non valide.');
        }
    };


    // Nom //
    // Écoute de la modification
    form.lastName.addEventListener('change', function()
    {
        validLastName(this);
    });

    // Validation
    const validLastName = function(inputLastName)
    {
        if (nameRegExp.test(inputLastName.value))
        {
            alert('Nom valide.');
        } else {
            alert('Nom non valide.');
        }
    };


    // Adresse //
    // Écoute de la modification
    form.address.addEventListener('change', function()
    {
        validAddress(this);
    });

    // Validation
    const validAddress = function(inputAddress)
    {
        if (addressRegExp.test(inputAddress.value))
        {
            alert('Adresse valide.');
        } else {
            alert('Adresse non valide.');
        }
    };


    // Ville //
    // Écoute de la modification
    form.city.addEventListener('change', function()
    {
        validCity(this);
    });

    // Validation
    const validCity = function(inputCity)
    {
        if (nameRegExp.test(inputCity.value))
        {
            alert('Ville valide.');
        } else {
            alert('Ville non valide.');
        }
    };


    // Email //
    // Écoute de la modification
    form.email.addEventListener('change', function()
    {
        validEmail(this);
    });

    // Validation
    const validEmail = function(inputEmail)
    {
        if (emailRegExp.test(inputEmail.value))
        {
            alert('Email valide.');
        } else {
            alert('Email non valide.');
        }
    };

}
getForm();


function postForm()
{
    const btnOrder = document.getElementById("order");

    btnOrder.addEventListener("click", () =>
    {

        //Récupération des coordonnées du formulaire client
        let inputName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAdress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputMail = document.getElementById('email');

        //Construction d'un array depuis le local storage
        let idProd = [];
        for (let i = 0; i<productLs.length;i++) {
            idProd.push(productLs[i].id);
        }
        console.log(idProd);

        const order =
        {
            contact :
            {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            product: idProd,
        } 

        const options = fetch("http://localhost:3000/api/products/order",
        {
            method: 'POST',
            headers:
            {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(order),
        });

        options.then(async(reponse) =>
        {
            try
            {
                console.log();
                const contenu = await reponse.json();
                console.log(contenu);
            } catch(e) {
                console.log(e);
            }
        });

    })
}
postForm();
