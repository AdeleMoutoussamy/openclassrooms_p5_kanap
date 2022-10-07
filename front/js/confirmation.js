window.onload = function () {confirmation()};

// Affichage du numéro de commande
function confirmation()
{
    document.getElementById('orderId').textContent = new URL(location.href).searchParams.get('orderId');
}