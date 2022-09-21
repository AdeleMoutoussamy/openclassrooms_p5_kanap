window.onload = function () {getCart()};

const productLs = JSON.parse(localStorage.getItem("product"));

// Si le panier est vide
function getCart()
{
    if (productLs === null || productLs == 0)
    {
        alert('Votre panier est vide !')
 
    } else {

        for (let product in productLs)
        {
            // Insertion de l'élément "article"
            let productArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', productLs[product].id);

            // Insertion de l'élément "div"
            let productDivImg = document.createElement("div");
            productArticle.appendChild(productDivImg);
            productDivImg.className = "cart__item__img";

            // Insertion de l'image
            let productImg = document.createElement("img");
            productDivImg.appendChild(productImg);
            productImg.src = productLs[product].imgProduct;
            productImg.alt = productLs[product].altImgProduct;

            // Insertion de l'élément "div"
            let productItemContent = document.createElement("div");
            productArticle.appendChild(productItemContent);
            productItemContent.className = "cart__item__content";

            // Insertion de l'élément "div"
            let productItemContentTitlePrice = document.createElement("div");
            productItemContent.appendChild(productItemContentTitlePrice);
            productItemContentTitlePrice.className = "cart__item__content__titlePrice";

            // Insertion du titre h3
            let productTitle = document.createElement("h2");
            productItemContentTitlePrice.appendChild(productTitle);
            productTitle.textContent = productLs[product].nameProduct;

            // Insertion de la couleur
            let productColor = document.createElement("p");
            productTitle.appendChild(productColor);
            productColor.textContent = productLs[product].colorProduct;
            productColor.style.fontSize = "20px";

            // Insertion du prix
            let productPrice = document.createElement("p");
            productItemContentTitlePrice.appendChild(productPrice);
            productPrice.textContent = productLs[product].priceProduct + " €";

            // Insertion de l'élément "div"
            let productItemContentSettings = document.createElement("div");
            productItemContent.appendChild(productItemContentSettings);
            productItemContentSettings.className = "cart__item__content__settings";

            // Insertion de l'élément "div"
            let productItemContentSettingsQuantity = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsQuantity);
            productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

            // Insertion de "Qté : "
            let productQte = document.createElement("p");
            productItemContentSettingsQuantity.appendChild(productQte);
            productQte.textContent = "Qté : ";

            // Insertion de la quantité
            let productQuantity = document.createElement("input");
            productItemContentSettingsQuantity.appendChild(productQuantity);
            productQuantity.value = productLs[product].quantityProduct;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // Insertion de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // Insertion de "p" supprimer
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

            //Selection de l'élément à modifier en fonction de son id ET sa couleur
            let quantityModif = productLs[k].quantityProduct;
            let qttModifValue = qttModif[k].valueAsNumber;

            const resultFind = productLs.find((elem) => elem.qttModifValue !== quantityModif);

            resultFind.quantityProduct = qttModifValue;
            productLs[k].quantityProduct = resultFind.quantityProduct;

            localStorage.setItem("product", JSON.stringify(productLs));

            location.reload();
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

            //Selection de l'élément à supprimer en fonction de son id ET sa couleur
            let idDelete = productLs[j].id;
            let colorDelete = productLs[j].colorProduct;

            productLs = productLs.filter( elem => elem.id !== idDelete || elem.colorProduct !== colorDelete );

            localStorage.setItem("product", JSON.stringify(productLs));

            //Alerte produit supprimé
            alert("Ce produit a bien été supprimé du panier");
            location.reload();
        })
    }
}