window.onload = function () {getArticle()};

async function getArticle()
{
    // Récupération de l'id du produit dans l'url

    // const productId = new URLSearchParams(window.location.href).get("id")  ////

    var str = window.location.href;
    var url = new URL(str);
    var productId = url.searchParams.get("id");
    console.log(productId);

    let reponse = await fetch('http://localhost:3000/api/products/' + productId)
    const article = await reponse.json()

    displayArticle(article)
}

// Affichage du produit
function displayArticle(article)
{
    console.log(article)

    // Img
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.setAttribute("src", article.imageUrl);
    productImg.setAttribute("alt", article.altTxt);

    // h1
    let productName = document.getElementById('title');
    productName.textContent = article.name;

    // Price
    let productPrice = document.getElementById('price');
    productPrice.textContent = article.price;

    // Description
    let productDescription = document.getElementById('description');
    productDescription.textContent = article.description;

    // Colors
    for (let colors of article.colors)
    {
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.textContent = colors;
    }

    toCart(article._id)
}


// Le Panier

function toCart(idProd)
{   
    // J'attache un écouteur d'événement au bouton
    let button = document.getElementById('addToCart');
    button.addEventListener('click', ()=>
    {
        addToCart(idProd)
    });
}

function addToCart(idProd)
{}