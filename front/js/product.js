const productId = new URL(window.location.href).searchParams.get("id");

getArticle();

function getArticle()
{
    fetch("http://localhost:3000/api/products/" + productId)
    .then((response) =>
    {
        return response.json();
    })

    .then(async function (resultatAPI)
    {
        article = await resultatAPI;
        console.log(article);
        if (article){
            getPost(article);
        }
    })
}
    
function getPost(article)
{
    // Img
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // h1
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

    // Price
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Colors
    for (let colors of article.colors){
        console.log(colors);
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
}