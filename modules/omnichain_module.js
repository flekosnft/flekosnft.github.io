import { chains, getContract } from './contracts_module.js';

async function getNetworkByTokenId(tokenId){
    let network;
    for(var i = 0; !network && i < chains.length; i++){
        try {
            let contract = getContract(chains[i]);
            await contract.tokenURI(tokenId);
            network = chains[i];
        } catch (error) {
            console.error();
        }
    }
    return network;
}

export{getNetworkByTokenId}