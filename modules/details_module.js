import { getTokenJson, getTokenImage } from "./metadata_module.js";
import { getContract } from './contracts_module.js';
import {getNetworkByTokenId} from './omnichain_module.js';
import { loadContent } from "./details_content_module.js";
import { loadingAnimatation, finishLoadingAnimation } from './animations_module.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

window.onload = () => {
    document.getElementById('content').innerHTML = loadContent();
    loadInfo();
}

async function loadInfo(){
    let loadingChainElement = document.getElementById('loadingChain');
    let loadingOwnerElement = document.getElementById('loadingOwner');
    loadingAnimatation(loadingChainElement, 150);
    loadingAnimatation(loadingOwnerElement, 150);
    var json = await getTokenJson(urlParams.get('id'));
    let name = json.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('name').innerHTML = name;
    let image = new Image();
    image.src = getTokenImage(json);
    image.onload = () => {
        document.getElementById('image').src = image.src;
        document.getElementById('image').title = json.name;;
        document.getElementById('image').alt = json.name;;
    }
    for(let i = 0; i < json.attributes.length; i++){
        if(attributeFilter(json.attributes[i])) document.getElementById('attributes').innerHTML += attributes(json.attributes[i]);
    }
    await getNetworkByTokenId(json.tokenId).then(async (network) => {
        if(network == undefined) {
            document.getElementById('chainInfo').innerHTML = 'This fleko seems to be lost between networks!'
        }else{
            document.getElementById('chainInfo').innerHTML = `Currently at <b>${network}</b> network`;
            finishLoadingAnimation(loadingChain);
            loadingChain.innerHTML = '';
            document.getElementById('owner').innerHTML = await getContract(network).ownerOf(json.tokenId);
            finishLoadingAnimation(loadingOwner);
        }
    });
}

function attributes(attribute){
    let trait_type = attribute.trait_type;
    trait_type = trait_type.charAt(0).toUpperCase() + trait_type.slice(1);
    let value = attribute.value;
    value = value.charAt(0).toUpperCase() + value.slice(1);
    return (`
        <div class="attribute">
            <h>${trait_type}</h>
            <p>${value}</p>
        </div>
        `)
}

function attributeFilter(attribute){
    let show = true;
    if(attribute.value == 'none') show = false;
    return show;
}