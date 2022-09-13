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
    for (let color of article.colors)
    {
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = color;
        productColors.textContent = color;
    }

    toCart(article._id)
}


// Le Panier

function toCart(idProduct)
{   
    // J'attache un écouteur d'événement au bouton
    let button = document.getElementById('addToCart');
    button.addEventListener('click', ()=>
    {
        addToCart(idProduct)
    });
}

function addToCart(idProduct)
{
    const colorPicked = document. querySelector("#colors");
    const quantityPicked = document.querySelector("#quantity");

    if (quantityPicked.value > 0 && quantityPicked.value <=100 && quantityPicked.value != 0)
    {
        let choiceColor = colorPicked.value;
        let choiceQuantity = quantityPicked.value;
    
        // Récupération des options de l'article à ajouter au panier
        let optionsProduct =
        {
            id: idProduct,
            color: choiceColor,
            quantity: choiceQuantity,
            name: idProduct.name,
            price: idProduct.price,
            description: idProduct.description,
            img: idProduct.imageUrl,
            altImg: idProduct.altTxt
        };

        // Accéder à l'array grâce au LocalStorage
        let productLs = JSON.parse(localStorage.getItem("product"));

        // Si le panier a déjà 1 article
        if (productLs)
        {
            const resultFind = productLs.find(
            (element) => element.id === idProduct && element.color === choiceColor);

            // Si le produit choisi est déjà dans le panier
            if (resultFind)
            {
                let newQuantity =
                parseInt(optionsProduct.quantity) + parseInt(resultFind.quantity);
                resultFind.quantity = newQuantity;
                localStorage.setItem("product", JSON.stringify(productLs));
                console.table(productLs);

            // Si le produit choisi n'est pas dans le panier
            } else {
                productLs.push(optionsProduct);
                localStorage.setItem("product", JSON.stringify(productLs));
                console.table(productLs);
            }

          // Si le panier est vide
        } else {
            productLs.push(optionsProduct);
            localStorage.setItem("product", JSON.stringify(productLs));
            console.table(productLs);
        }
    }
}