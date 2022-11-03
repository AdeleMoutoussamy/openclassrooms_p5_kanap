// Attend que le DOM soit chargé
window.onload = function () {getArticle()};

/**
 * Récupération de l'ID de l'article dans l'URL.
 */
async function getArticle()
{
    const productId = new URLSearchParams(window.location.search).get("id");

    const reponse = await fetch('http://localhost:3000/api/products/' + productId);
    const article = await reponse.json();

    displayArticle(article);
}

/**
 * Insertion des détails de l'article dans la page produit.
 * @param {Object} article Object qui contient un seul produit.
 */
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

    eventCart(article._id);
}

/**
 * Le Panier.
 * Attacher un écouteur d'événement au bouton " Ajouter au panier ".
 * @param {String} idProduct String qui contient l'ID des articles.
 */
function eventCart(idProduct)
{   
    // Je récupère le boutton
    const button = document.getElementById('addToCart');

    button.addEventListener('click', ()=>
    {
        addToCart(idProduct);
    });
}

/**
 * Choix de la quantité et de la couleur, ainsi que d'ajouter l'article au panier.
 * @param {String} idProduct String qui contient l'ID des articles.
 */
function addToCart(idProduct)
{
    // Je récupère les input
    const colorPicked = document. querySelector("#colors");
    const quantityPicked = document.querySelector("#quantity");

    if (quantityPicked.value > 0 && quantityPicked.value <=100 && quantityPicked.value != " ")
    {
        if (colorPicked.value != "")
        {
            const choiceColor = colorPicked.value;
            const choiceQuantity = quantityPicked.value;

            console.log(colorPicked.value);
            console.log(quantityPicked.value);

            // Récupération des options de l'article à ajouter au panier
            const optionsProduct =
            {
                id: idProduct,
                color: choiceColor,
                quantity: choiceQuantity,
            };

            // Déclaration d'une variable
            let productLs;

            // Je regarde si le panier existe
            if (localStorage.getItem('product'))
            {
                productLs = JSON.parse(localStorage.getItem('product'));
                const resultFind = productLs.find(
                (element) => element.id === idProduct && element.color === choiceColor);

                // Si le produit choisi est déjà dans le panier
                if (resultFind)
                {
                    const newQuantity =
                    parseInt(optionsProduct.quantity) + parseInt(resultFind.quantity);
                    resultFind.quantity = newQuantity;

                // Si le produit choisi n'est pas dans le panier
                } else {
                    productLs.push(optionsProduct);
                }

              // Si le panier n'existe pas
            } else {
                // productLs est un tableau vide
                productLs = [];
                productLs.push(optionsProduct);
            }

            localStorage.setItem("product", JSON.stringify(productLs));
            console.table(productLs);
            alert(' Produit ajouté au panier ! ')

        } else {
            alert(' Vous devez sélectionnez une couleur ! ')
        }
        
    } else {
        alert(' Quantité invalide ! ')
    }
}