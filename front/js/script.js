// Attend que le DOM soit chargé
window.onload = function () {allProducts()};

/**
 * Récupération des Articles de l'API.
 */
async function allProducts()
{
    const products = await fetch('http://localhost:3000/api/products');
    const result = await products.json();

    // Je récupére un element (UN seul Article) dans le tableau result
    for (let element of result)
    {
        displayProduct(element);
    }
}

/**
 * Création et insertion des Articles dans la page d'accueil.
 * @param {Object} product Object qui contient les Articles de l'API.
 */
function displayProduct(product)
{
    // a
    let productLink = document.createElement("a");
    productLink.setAttribute("href","./product.html?id="+ product._id);

    // article
    let productArticle = document.createElement ("article");

    // img
    let productImg = document.createElement("img");
    productImg.setAttribute("src", product.imageUrl);
    productImg.setAttribute("alt", product.altTxt);
    productImg.setAttribute("class", "Img-fluid");

    // h3
    let productName = document.createElement("h3");
    productName.setAttribute("class", "productName");
    productName.textContent = product.name;

    // p
    let productDescription = document.createElement("p");
    productDescription.setAttribute("class", "productDescription");
    productDescription.textContent = product.description;

    // J'ajoute mes éléments au DOM
    productArticle.appendChild(productImg);
    productArticle.append(productName);
    productArticle.append(productDescription);
    productLink.appendChild(productArticle);
    document.getElementById("items").appendChild(productLink);
}