window.onload = function () {confirmation()};

function confirmation()
{
    const orderId = getOrderId();
    let id = orderId;
    document.getElementById('orderId').textContent = id;
};

// Fonction pour récupérer l'id de la commande dans l'URL
function getOrderId()
{
    return new URL(location.href).searchParams.get('id');
}