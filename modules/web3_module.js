const web3 = window.ethereum;

const chainByChainId = {
    1: 'ethereum',
    137: 'polygon',
    56: 'binance',
    43114: 'avalanche',
    250: 'fantom',
    42161: 'arbitrum',
    10: 'optimism'
}

async function getWeb3Signer(){
    if(web3){
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            await provider.send("eth_requestAccounts", []);
            return provider.getSigner();
        } catch (error) {
            return undefined;
        }
    } else {
        alert('Web3Provider not detected.');
        return undefined;
    }
}

function getWeb3Provider(){
    if(web3){
        try {
            return new ethers.providers.Web3Provider(window.ethereum, 'any');
        } catch (error) {
            alert('Error connecting to Web3Provider.');
        }
    } else {
        alert('Web3Provider not detected.');
    }
}

function onAccountChanged(handle){
    if(web3) web3.on('accountsChanged', handle);
}

function onChainChanged(handle){
    if(web3) web3.on('chainChanged', handle);
}

function onConnect(handle){
    if(web3) web3.on('connect', handle);
}

function onDisconnect(handle){
    if(web3) web3.on('disconnect', handle);
}

export{
    chainByChainId,
    getWeb3Signer,
    getWeb3Provider,
    onAccountChanged,
    onChainChanged,
    onConnect,
    onDisconnect
}