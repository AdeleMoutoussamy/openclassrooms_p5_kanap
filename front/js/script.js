// Attend que le DOM soit chargé
window.onload = function () {allProducts()};

// Récupération des articles de l'API
async function allProducts()
{
    let products = await fetch('http://localhost:3000/api/products');
    let result = await products.json();

    for (let element of result)
    {
        displayProduct(element);
    }
}

/**
 * @param {Object} product Object qui contient les articles de l'API.
 */
// Insertion des produits dans la page d'accueil
function displayProduct(product)
{
    console.log(product);

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

    productArticle.appendChild(productImg);
    productArticle.append(productName);
    productArticle.append(productDescription);
    productLink.appendChild(productArticle);
    document.getElementById("items").appendChild(productLink);
}