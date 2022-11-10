// Attend que le DOM soit chargé
window.onload = function () {confirmation()};

/**
 * Affichage du numéro de commande.
 */
function confirmation()
{
    // Ja passe l'ID de la commande dans l'URL pour afficher le numéro de commande
    document.getElementById('orderId').textContent = new URL(location.href).searchParams.get('orderId');
}