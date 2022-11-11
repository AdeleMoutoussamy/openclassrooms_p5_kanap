// Attend que le DOM soit chargé
window.onload = function () {getArticle()};

/**
 * Récupération de l'ID de l'Article dans l'URL.
 */
async function getArticle()
{
    // Je récupére l'ID de l'Article dans l'URL
    const productId = new URLSearchParams(window.location.search).get("id");

    const reponse = await fetch('http://localhost:3000/api/products/' + productId);
    const article = await reponse.json();

    displayArticle(article);
}

/**
 * Insertion des informations de l'Article dans la page produit.
 * @param {Object} article Object qui contient UN seul Produit.
 */
function displayArticle(article)
{
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
    // Je récupére les couleurs de l'Article
    for (let color of article.colors)
    {
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = color;
        productColors.textContent = color;
    }

    // Ajouter au panier
    eventCart(article._id);
}

/**
 * Le bouton " Ajouter au panier ".
 * Lui attacher un écouteur d'événement.
 * @param {String} idProduct String qui contient l'ID de l'Article.
 */
function eventCart(idProduct)
{
    // Je récupére le bouton " Ajouter au panier "
    const button = document.getElementById('addToCart');

    // Je lui attache un écouteur d'événement 'click'
    button.addEventListener('click', () =>
    {
        addToCart(idProduct);
    });
}

/**
 * Choix de la quantité et de la couleur, ainsi que d'ajouter l'Article au panier.
 * @param {String} idProduct String qui contient l'ID de l'Article.
 */
function addToCart(idProduct)
{
    // Je récupére les input
    const colorPicked = document. querySelector("#colors");
    const quantityPicked = document.querySelector("#quantity");

    // Je vérifie si l'utilisateur a bien choisit une quantité
    if (quantityPicked.value > 0 && quantityPicked.value <=100 && quantityPicked.value != " ")
    {
        // Je vérifie si l'utilisateur a bien choisit une couleur
        if (colorPicked.value != "")
        {
            // Ajoute les valeurs aux input
            const choiceColor = colorPicked.value;
            const choiceQuantity = quantityPicked.value;

            // Création d'un objet pour l'Article qui sera ajouté au panier
            const optionsProduct =
            {
                id: idProduct,
                color: choiceColor,
                quantity: choiceQuantity,
            };

            // Déclaration d'une variable
            let productLs;

            // Je vérifie s'il y a déjà un Article dans le panier
            if (localStorage.getItem('product'))
            {
                // Je récupére l'Article dans le Local Storage, et le met dans le tableau productLs
                productLs = JSON.parse(localStorage.getItem('product'));
                const resultFind = productLs.find((element) => element.id === idProduct && element.color === choiceColor);

                // Si l'Article choisi est déjà dans le panier
                if (resultFind)
                {
                    // Je modifie juste la quantité
                    const newQuantity = parseInt(optionsProduct.quantity) + parseInt(resultFind.quantity);
                    resultFind.quantity = newQuantity;

                // Si l'Article choisi n'est pas dans le panier
                } else {

                    // J'ajoute l'Article dans le tableau productLs
                    productLs.push(optionsProduct);
                }

              // Si il n'y a pas d'Article dans le panier
            } else {

                // productLs est un tableau vide
                productLs = [];
                // J'ajoute l'Article dans le tableau productLs
                productLs.push(optionsProduct);
            }

            // Je stocke l'Article dans le Local Storage
            localStorage.setItem("product", JSON.stringify(productLs));

            alert(' Produit ajouté au panier ! ')

        } else {
            // Si l'utilisateur n'a pas choisit de couleur
            alert(' Vous devez sélectionnez une couleur ! ')
        }

    } else {
        // Si l'utilisateur n'a pas choisit de quantité
        alert(' Quantité invalide ! ')
    }
}