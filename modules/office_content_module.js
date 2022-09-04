import {chains, contracts, contractLinks} from "./contracts_module.js";

function loadContent(){
    let content = `<div class="section">
                        <h>Contracts</h>`

    chains.forEach((chain) => {
        let title = chain.charAt(0).toUpperCase() + chain.slice(1);
        content += `<div class="contract">
                        <img src="img/logos/${chain}.svg" alt="${chain}_logo">
                        <h>${title}:</h>
                        <a href="${contractLinks[chain]}">${contracts[chain]}</a>
                    </div>`
    });
    content += `</div>`
    
    content += `<div class="section">
                    <h>Markets</h>
                    <div class="markets">
                        <div>
                            <h>Ethereum</h>
                            <div>
                                <img src="img/logos/opensea.svg" alt="opensea_logo">
                                <a href="https://opensea.io/collection/flekos-eth">Opensea</a>
                            </div>
                            <div>
                                <img src="img/logos/rarible.svg" alt="rarible_logo">
                                <a href="https://rarible.com/flekos_eth/items">Rarible</a>
                            </div>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-eth/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Polygon</h>
                            <div>
                                <img src="img/logos/opensea.svg" alt="opensea_logo">
                                <a href="https://opensea.io/collection/flekos-poly">Opensea</a>
                            </div>
                            <div>
                                <img src="img/logos/rarible.svg" alt="rarible_logo">
                                <a href="https://rarible.com/flekos_poly/items">Rarible</a>
                            </div>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-polygon/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Binance</h>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-bsc/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Avalanche</h>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-avax/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Fantom</h>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-ftm/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Arbitrum</h>
                            <div>
                                <img src="img/logos/stratos.svg" alt="stratos_logo">
                                <a href="https://stratosnft.io/collection/0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42">Stratos</a>
                            </div>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-arbi/items">TofuNFT</a>
                            </div>
                        </div>
                        <div>
                            <h>Optimism</h>
                            <div>
                                <img src="img/logos/quixotic.svg" alt="quixotic_logo">
                                <a href="https://qx.app/collection/0xAAB7A7a301f19b8482d6C4942E0EF977D4361e42">Quixotic</a>
                            </div>
                            <div>
                                <img src="img/logos/tofunft.svg" alt="tofunft_logo">
                                <a href="https://tofunft.com/collection/flekos-opti/items">TofuNFT</a>
                            </div>
                        </div>
                    </div>
                </div>`;
    
    return content;
}

export { loadContent }