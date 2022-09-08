import { chainByChainId, onAccountChanged, onChainChanged, getWeb3Signer, getWeb3Provider } from './web3_module.js';
import { supply } from "./metadata_module.js";
import { loadNFT } from './ntfLoader_module.js';
import { loadContent } from './bedroom_content_module.js';
import { chains, getContract} from './contracts_module.js';
import { loadingAnimatation, finishLoadingAnimation } from './animations_module.js';

const updateWarning = 'Are you sure?\nUpdating will remove your local data and the code will need to look again on the blockchain. This action may take some time!';
const workingWarning = 'Are you sure?\nAnother process is running. This can slow down ongoing executions and increase resource usage.';
const onAccountChangedWarning = 'Are you sure? Changing or disconnecting the current account will reset your collection and ongoing processes will stop.';

const documentTitle = document.title;

var addressElement, networkElement;

var provider;
var network;
var signer;
var signerAddress;
var currentProcesses = 0;
var accountChanged = false;
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

    addressElement = document.getElementById('address');
    networkElement = document.getElementById('network');


    document.getElementById('connect').addEventListener('click', () => {
        if(!signer){
            connectWallet();
        } else {
            alert('Already connected!\nNow you can manage your accounts directly from your wallet.')
        }
    });
    
    initCollection();
}

async function connectWallet(){
    addressElement.innerHTML = 'Connecting...';
    networkElement.innerHTML = 'Connecting...';

    signer = await getWeb3Signer();
    if(signer){
        signerAddress = await signer.getAddress();
        provider = getWeb3Provider();
        network = await provider.getNetwork();

        addressElement.innerHTML = signerAddress;
        let chainName = chainByChainId[network.chainId]
        chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1);
        networkElement.innerHTML = chainName;
    } else {
        disconnect();
    }
}

function disconnect(){
    provider = network = signer = signerAddress = undefined;
    addressElement.innerHTML = 'Not connected';
    networkElement.innerHTML = 'Not connected';
}

onAccountChanged(async (accounts) => {
    let change = true;
    if(currentProcesses > 0){
        if(confirm(onAccountChangedWarning)) accountChanged = true;
        else change = false;
    }
    if(change){
        if(accounts.length){
            connectWallet()
            initCollection();
        } else {
            disconnect();
        }
    }
});

onChainChanged(async () => {
    try{
        provider = getWeb3Provider();
        network = await provider.getNetwork();
        let chainName = chainByChainId[network.chainId];
        chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1);
        networkElement.innerHTML = chainName;
    } catch (error) {
        networkElement.innerHTML = 'Not available';
    }
});

function initCollection(){
    chains.forEach((chain) => {
        document.getElementById(`${chain}_content`).innerHTML = '';
        document.getElementById(`${chain}_load`).innerHTML = `Load my flekos at ${chain}`;
        document.getElementById(`${chain}_load`).onclick = () => {
            if(signer){
                load(getContract(chain), chain, false);
            } else {
                alert("Connect your wallet first!")
            }
        };
    });
}

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
            if(removeLocal) window.localStorage.removeItem(chain + signerAddress);
            await loadFromChain(contract, chain);
        }
    } else {
        if(removeLocal) window.localStorage.removeItem(chain + signerAddress);
        await loadFromChain(contract, chain);
    }
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
    document.title = documentTitle + ' (Loading...)';
    let contentElement = document.getElementById(`${chain}_content`);
    contentElement.innerHTML = await loadCanvas(chain);
    let loadingElement = document.getElementById(`${chain}_loading`);
    let canvasElement = document.getElementById(`${chain}_canvas`);
    let loadElement = document.getElementById(`${chain}_load`);

    loadingAnimatation(loadingElement, 150);
    currentProcesses++;
    loadElement.disabled = true;
    let searchAtSameTime = 10;
    let ids = [];
    for(let c = 0; c <= supply && !accountChanged; c += searchAtSameTime){
        loadElement.innerHTML = `Loading from the blockchain... ${c}/${supply}`;
        let owners = await ownerOfParallel(contract, c, searchAtSameTime);
        for(let i = 0; i < owners.length; i++){
            if(owners[i] == signerAddress){
                loadNFT(c + i, `${chain}_canvas`);
                ids.push(c + i);
            }
        }
    }
    
    finishLoadingAnimation(loadingElement);
    currentProcesses--;
    document.title = documentTitle;
    loadingState[chain] = false;
    if(accountChanged){
        setTimeout(() => {
            loadElement.disabled = false;
        }, 1000);
        if(currentProcesses == 0){
            accountChanged = false;
        }
    } else {
        window.localStorage.setItem(chain + signerAddress, JSON.stringify(ids));
        loadElement.innerHTML = 'Load completed!';
        if(canvasElement.childElementCount == 0) contentElement.innerHTML = '<p>No results.</p>';
        setTimeout(() => {
            loadElement.onclick = () => load(contract, chain, true);
            loadElement.innerHTML = 'Update';
            loadElement.disabled = false;
        }, 1000);
    }
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