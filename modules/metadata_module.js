const ipfsGateway = 'https://ipfs.io/ipfs/';
const baseURI = 'QmamdHKM2wjds8vEYmV1oyreBns49Aj9P9bmGnNdFFPFkA';
const supply = 10000;

async function getTokenJson(token){
    return await fetch(ipfsGateway + baseURI + '/' + token).then(async (response) => {
        return await response.json();
    });
}

function getTokenImage(tokenJson){
    return ipfsGateway + tokenJson.image.slice(7);
}

export{
    supply,
    getTokenJson,
    getTokenImage
};