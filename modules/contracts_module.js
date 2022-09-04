import flekosABI from '../flekos_eth_abi.json' assert { type: "json" };

//Chains
const chains =[
    'ethereum',
    'polygon',
    'binance',
    'avalanche',
    'fantom',
    'arbitrum',
    'optimism'
];

//Networks
const networks = {
    ethereum: 'homestead',
    polygon: 'matic',
    binance: 'binance',
    avalanche: 'avalanche',
    fantom: 'fantom',
    arbitrum: 'arbitrum',
    optimism: 'optimism'
}

//Networks chainId
const chainsIds ={
    ethereum: 1,
    polygon: 137,
    binance: 56,
    avalanche: 43114,
    fantom: 250,
    arbitrum: 42161,
    optimism: 10
}

//Networks RPC
const rpcs = {
    ethereum: 'https://mainnet.infura.io/v3/',
    polygon: 'https://polygon-rpc.com/',
    binance: 'https://bsc-dataseed.binance.org/',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc',
    fantom: 'https://rpc.ftm.tools',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    optimism: 'https://mainnet.optimism.io/'
}

//Contracts
const contracts = {
    ethereum: "0x16dfc67641218a1d6404b2b91350ac78110d56ac",
    polygon: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42",
    binance: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42",
    avalanche: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42",
    fantom: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42",
    arbitrum: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42",
    optimism: "0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42"
}

//Contract links
const contractLinks = {
    ethereum: "https://etherscan.io/address/0x16dfc67641218a1d6404b2b91350ac78110d56ac",
    polygon: "https://polygonscan.com/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42",
    binance: "https://bscscan.com/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42",
    avalanche: "https://ftmscan.com/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42",
    fantom: "https://snowtrace.io/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42",
    arbitrum: "https://arbiscan.io/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42",
    optimism: "https://optimistic.etherscan.io/address/0xaab7a7a301f19b8482d6c4942e0ef977d4361e42"
}


function getContract(chain){return getSpecifiedContract(networks[chain], chainsIds[chain], rpcs[chain], contracts[chain]);}

function getSpecifiedContract(chain, chainId, chainRPC, contractAddress){
    let network = new ethers.providers.getNetwork(chainId);
    network = {
        name: (network.name ? network.name : chain),
        chainId: (network.chainId ? network.chainId : chainId),
        ensAddress:(network.ensAddress ? network.ensAddress : null),
        _defaultProvider: (network._defaultProvider ? network._defaultProvider : (providers) => new providers.JsonRpcProvider(chainRPC))
    };
    let provider = new ethers.providers.getDefaultProvider(network);
    return new ethers.Contract(contractAddress, flekosABI, provider);
}

export {
    chains,
    chainsIds,
    rpcs,
    contracts,
    contractLinks,
    getContract
};