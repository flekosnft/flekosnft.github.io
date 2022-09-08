function hideShowCollection(chain){
    let title = chain.charAt(0).toUpperCase() + chain.slice(1);
    let collection = document.getElementById(`${chain}`);
    let hideShowButton = document.getElementById(`${chain}_hideShow`);
    if (collection.style.display === 'none') {
        collection.style.display = 'flex';
        hideShowButton.innerHTML = `${title} ʌ`;
        window.localStorage.setItem(`${chain}_hide`, 2);
    } else {
        collection.style.display = 'none';
        hideShowButton.innerHTML = `${title} v`;
        window.localStorage.setItem(`${chain}_hide`, 1);
    }
}