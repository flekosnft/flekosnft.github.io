import {chainByChainId, onAccountChanged, onChainChanged, getWeb3Signer, getWeb3Provider} from './web3_module.js';
import { supply } from "./metadata_module.js";
import { loadNFT } from './ntfLoader_module.js';
import { loadContent } from './bedroom_content_module.js';
import { chains, getContract} from './contracts_module.js';

const updateWarning = 'Are you sure?\nUpdating will remove your local data and the code will need to look again on the blockchain. This action may take some time!';
const workingWarning = 'Are you sure?\nAnother process is running. This can slow down ongoing executions and increase resource usage.'

const clock = ['/', '-', '\\']

var provider;
var network;
var signer;
var signerAddress;
var currentProcesses = 0;
var loadingState = {
    ethereum: false,
    polygon: false,
    binance: false,
    avalanche: false,
    fantom: false,
    arbitrum: false,
    optimism: false
}

window.onload = async () => {
    document.getElementById('room').style.background = '#DDDCE3';
    document.getElementById('content').innerHTML = loadContent();

    signer = await getWeb3Signer();
    signerAddress = await signer.getAddress();
    document.getElementById('address').innerHTML = signerAddress;

    provider = getWeb3Provider();
    network = await provider.getNetwork();
    let chainName = chainByChainId[network.chainId]
    chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1)
    document.getElementById('network').innerHTML = chainName;

    chains.forEach((chain) => {
        document.getElementById(`${chain}_load`).onclick = () => load(getContract(chain), chain, false);
        document.getElementById(`${chain}_title`).onclick = () => hideShowCollection(chain);
    })
}

function hideShowCollection(chain){
    let title = chain.charAt(0).toUpperCase() + chain.slice(1);
    let collection = document.getElementById(`${chain}`);
    let hideShowButton = document.getElementById(`${chain}_hideShow`);
    if (collection.style.display === 'none') {
        collection.style.display = 'flex';
        hideShowButton.innerHTML = `${title} v`;
        window.localStorage.setItem(`${chain}_hide`, 2);
    } else {
        collection.style.display = 'none';
        hideShowButton.innerHTML = `${title} ʌ`;
        window.localStorage.setItem(`${chain}_hide`, 1);
    }
}

onAccountChanged(async () => {
    window.location.reload();
});

onChainChanged(async () => {
    provider = getWeb3Provider();
    network = await provider.getNetwork();
    let chainName = chainByChainId[network.chainId]
    chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1)
    document.getElementById('network').innerHTML = chainName;
});

function load(contract, chain, update){
    if(checkStored(chain) && !update){
        loadStored(contract, chain);
    } else {
        if(update){
            if(confirm(updateWarning)){
                beforeLoadFromChain(contract, chain, update);
            }
        } else {
            beforeLoadFromChain(contract, chain, update);
        }
    }
}

async function beforeLoadFromChain(contract, chain, removeLocal){
    if(currentProcesses > 0){
        if(confirm(workingWarning)){
            currentProcesses++;
            if(removeLocal) window.localStorage.removeItem(chain + signerAddress);
            await loadFromChain(contract, chain);
            currentProcesses--;
        }
    } else {
        currentProcesses++;
        if(removeLocal) window.localStorage.removeItem(chain + signerAddress);
        await loadFromChain(contract, chain);
        currentProcesses--;
    }
}

function loadingAnimation(element, chain, index, finishState){
    setTimeout(() => {
        element.innerHTML = clock[index];
        if(loadingState[chain]){
            if(index < clock.length - 1) loadingAnimation(element, chain, ++index, finishState);
            else loadingAnimation(element, chain, 0, finishState)
        } else {
            element.innerHTML = finishState;
        }
    }, 150);
}

function checkStored(chain){
    if(window.localStorage.getItem(chain + signerAddress)) return true;
    else return false;
}

async function loadStored(contract, chain){
    let contentElement = document.getElementById(`${chain}_content`);
    contentElement.innerHTML = await loadCanvas(chain);
    let canvasElement = document.getElementById(`${chain}_canvas`);
    let loadElement = document.getElementById(`${chain}_load`);

    loadElement.disabled = true;
    let tokenIdList = JSON.parse(window.localStorage.getItem(chain + signerAddress));
    if(tokenIdList){
        for(let c = 0; c < tokenIdList.length; c++){
            loadElement.innerHTML = `Loading from local... ${c}/${tokenIdList.length}`;
            loadNFT(tokenIdList[c], `${chain}_canvas`);
        }
    }

    loadElement.innerHTML = 'Load completed!';
    if(canvasElement.childElementCount == 0) contentElement.innerHTML = '<p>No results.</p>';
    setTimeout(() => {
        loadElement.onclick = () => load(contract, chain, true);
        loadElement.innerHTML = 'Update';
        loadElement.disabled = false;
    }, 1000);
}

async function loadFromChain(contract, chain){
    let documentTitle = document.title;
    document.title = documentTitle + ' (Loading...)';
    let contentElement = document.getElementById(`${chain}_content`);
    contentElement.innerHTML = await loadCanvas(chain);
    let loadingElement = document.getElementById(`${chain}_loading`);
    let canvasElement = document.getElementById(`${chain}_canvas`);
    let loadElement = document.getElementById(`${chain}_load`);

    loadingState[chain] = true;
    loadingAnimation(loadingElement, chain, 0, '');

    loadElement.disabled = true;
    let searchAtSameTime = 10;
    let ids = [];
    for(let c = 0; c <= supply; c += searchAtSameTime){
        loadElement.innerHTML = `Loading from the blockchain... ${c}/${supply}`;
        let owners = await ownerOfParallel(contract, c, searchAtSameTime);
        for(let i = 0; i < owners.length; i++){
            if(owners[i] == signerAddress){
                loadNFT(c + i, `${chain}_canvas`);
                ids.push(c + i);
            }
        }
    }
    window.localStorage.setItem(chain + signerAddress, JSON.stringify(ids));
    
    document.title = documentTitle;
    loadingState[chain] = false;
    loadElement.innerHTML = 'Load completed!';
    if(canvasElement.childElementCount == 0) contentElement.innerHTML = '<p>No results.</p>';
    setTimeout(() => {
        loadElement.onclick = () => load(contract, chain, true);
        loadElement.innerHTML = 'Update';
        loadElement.disabled = false;
    }, 1000);
}

async function ownerOfParallel(contract, startPoint, numberOfProcesses){
    let processes = [];
    for(let i = 0; i < numberOfProcesses; i++){
        processes.push(ownerOf(contract, startPoint + i))
    }
    return await Promise.all(processes);
}

async function ownerOf(contract, tokenId){
    let result;
    try {
        result = await contract.ownerOf(tokenId);
    } catch (error) {}
    return result;
}

async function loadCanvas(chain){
    return `<div id="${chain}_canvas" class="canvas"></div>`
}

export { chains }