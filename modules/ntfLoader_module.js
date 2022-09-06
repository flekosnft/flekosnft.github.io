import { getTokenJson, getTokenImage } from "./metadata_module.js";

var loadingImage = new Image();
loadingImage.src = 'img/loading.gif';
var loadingName = 'Loading...';

var toRefresh = [];

async function loadNFT(token, containerId){
    document.getElementById(containerId).innerHTML += createNFTCard(loadingImage, loadingName, token);
    await getTokenJson(token).then((json) => {
        loadedStateNFT(json, token);
    }).catch((error) => {
        console.log(error);
        refreshStateNFT(token);
    });
}

async function refreshNFT(token){
    loadingStateNFT(token);
    await getTokenJson(token).then((json) => {
        loadedStateNFT(json, token);
    }).catch((error) => {
        console.log(error);
        refreshStateNFT(token);
    });
}

function loadingStateNFT(tokenId){
    document.getElementById(`fleko_${tokenId}_img`).title = loadingName;
    document.getElementById(`fleko_${tokenId}_img`).src = loadingImage.src;
    document.getElementById(`fleko_${tokenId}_img`).alt = loadingName;
}

function refreshStateNFT(tokenId){
    toRefresh.push(tokenId);
    document.getElementById(`fleko_${tokenId}`).addEventListener("click", () => refreshNFT(tokenId));
    document.getElementById(`fleko_${tokenId}_img`).title = 'Refresh';
    document.getElementById(`fleko_${tokenId}_img`).src = 'img/refresh.png';
    document.getElementById(`fleko_${tokenId}_img`).alt = 'Refresh';
}

function loadedStateNFT(tokenJson, tokenId){
    let tokenImage = new Image();
    tokenImage.src = getTokenImage(tokenJson);
    let tokenName = tokenJson.name;
    tokenImage.onload = () => {
        document.getElementById(`fleko_${tokenId}_img`).title = tokenName;
        document.getElementById(`fleko_${tokenId}_img`).src = tokenImage.src;
        document.getElementById(`fleko_${tokenId}_img`).alt = tokenName;
        document.getElementById(`fleko_${tokenId}_link`).href = `${window.location.protocol}//${window.location.host}/details.html?id=${tokenId}`

    }
    tokenImage.onerror = () => {
        refreshStateNFT(tokenId);
    }
}

function createNFTCard(image, name, id){
    return (`
        <div id="fleko_${id}" class="card">
            <a id="fleko_${id}_link">
                <img id="fleko_${id}_img" title="${name}" src="${image.src}" alt="${name}">
            </a>
        </div>
        `)
}

function recoverOnClickRefresh(){
    toRefresh.forEach((id) => {
        document.getElementById(`fleko_${id}`).addEventListener("click", () => refreshNFT(id));
    })
    toRefresh = [];
}

export{loadNFT, recoverOnClickRefresh}