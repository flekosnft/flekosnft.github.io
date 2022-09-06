import { supply } from "./metadata_module.js";
import { loadNFT, recoverOnClickRefresh } from './ntfLoader_module.js';
import { loadContent } from "./showroom_content_module.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const maxToken = 10000;
const addToLoad = 20;
var loadCount = (urlParams.get('start') ? parseInt(urlParams.get('start')) : 1);
var nextLoadCount = getNextLoad(loadCount);

window.onload = () => {
    document.getElementById('showroom').style.background = '#DDDCE3';
    document.getElementById('content').innerHTML = loadContent();
    loadNFTs();
    document.getElementById('loadMore').addEventListener("click", () => loadMore());
}

function loadNFTs() {
    while (loadCount <= nextLoadCount){
        loadNFT(loadCount, 'canvas')
        loadCount++;
    }
    recoverOnClickRefresh();
}

function getNextLoad(count){
    let next = count + addToLoad;
    if(next > supply) next = supply;
    return next;
}

function loadMore(){
    nextLoadCount = getNextLoad(nextLoadCount);
    loadNFTs();
}