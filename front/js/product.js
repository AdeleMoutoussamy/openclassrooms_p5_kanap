window.onload = function () {getArticle()};

async function getArticle()
{
    // Récupération de l'ID du produit dans l'URL
    const productId = new URLSearchParams(window.location.search).get("id");

    let reponse = await fetch('http://localhost:3000/api/products/' + productId);
    const article = await reponse.json();

    displayArticle(article);
}

// Affichage du produit
function displayArticle(article)
{
    console.log(article);

    // img
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.setAttribute("src", article.imageUrl);
    productImg.setAttribute("alt", article.altTxt);

    // h1
    let productName = document.getElementById('title');
    productName.textContent = article.name;

    // prix
    let productPrice = document.getElementById('price');
    productPrice.textContent = article.price;

    // description
    let productDescription = document.getElementById('description');
    productDescription.textContent = article.description;

    // couleurs
    for (let color of article.colors)
    {
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = color;
        productColors.textContent = color;
    }

    toCart(article._id);
}


// Le Panier
function toCart(idProduct)
{   
    // J'attache un écouteur d'événement au bouton
    let button = document.getElementById('addToCart');
    button.addEventListener('click', ()=>
    {
        addToCart(idProduct);
    });
}

function addToCart(idProduct)
{
    const colorPicked = document. querySelector("#colors");
    const quantityPicked = document.querySelector("#quantity");

    if (quantityPicked.value > 0 && quantityPicked.value <=100 && quantityPicked.value != " ")
    {
        if (colorPicked.value != "")
        {
            let choiceColor = colorPicked.value;
            let choiceQuantity = quantityPicked.value;
            console.log(colorPicked.value);
            console.log(quantityPicked.value);

            // Récupération des options de l'article à ajouter au panier
            let optionsProduct =
            {
                id: idProduct,
                color: choiceColor,
                quantity: choiceQuantity,
            };

            // Déclaration d'une variable
            let productLs;

            // Si le panier existe
            if (localStorage.getItem('product'))
            {
                productLs = JSON.parse(localStorage.getItem('product'));
                const resultFind = productLs.find(
                (element) => element.id === idProduct && element.color === choiceColor);

                // Si le produit choisi est déjà dans le panier
                if (resultFind)
                {
                    let newQuantity =
                    parseInt(optionsProduct.quantity) + parseInt(resultFind.quantity);
                    resultFind.quantity = newQuantity;

                // Si le produit choisi n'est pas dans le panier
                } else {
                    productLs.push(optionsProduct);
                }

              // Si le panier n'existe pas
            } else {
                productLs = [];
                productLs.push(optionsProduct);
            }

            localStorage.setItem("product", JSON.stringify(productLs));
            console.table(productLs);
            alert('Produit ajouté !')

        } else {
            alert('Vous devez sélectionnez une couleur !')
        }
        
    } else {
        alert('Quantité invalide !')
    }
}