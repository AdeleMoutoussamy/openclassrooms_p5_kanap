window.onload = function () {allProducts()};

async function getProducts() 
{
    let products = await fetch('http://localhost:3000/api/products');
    console.log (products);
    console.log("Les produits ont été récupérés !");
    return products.json();
}

async function allProducts() 
{
    let result = await getProducts()

    // for (let i=0; i < result.length; i++) 
    // {		
    //     displayProduct(result[i]) 
    // }

    // for (let i in result)
    // {
    //     displayProduct(result[i])
    // }

    for (let elem of result) 
    {
        displayProduct(elem)
    }
}

function displayProduct(prod) 
{
    console.log(prod)

    // a
    let productLink = document.createElement("a");
    productLink.setAttribute("href","./product.html?id="+ prod._id);

    // article
    let productArticle = document.createElement ("article");

    // img
    let productImg = document.createElement("img");
    productImg.setAttribute("src", prod.imageUrl);
    productImg.setAttribute("alt", prod.altTxt);
    productImg.setAttribute("class", "Img-fluid");

    // h3
    let productName = document.createElement("h3");
    productName.setAttribute("class", "productName");
    productName.innerHTML = prod.name;

    // p
    let productDescription = document.createElement("p");
    productDescription.setAttribute("class", "productDescription");
    productDescription.innerHTML = prod.description;

    document.getElementById("items").appendChild(productLink);
    productLink.appendChild(productArticle);
    productArticle.appendChild(productImg);
    productImg.appendChild(productName);
    productName.appendChild(productDescription);
}