import { chains } from "./contracts_module.js";

function loadContent(){
    let content = `<div class="signer">
                        <button id="connect">Connect wallet</button>
                        <h>My address:</h>
                        <p id="address">Not connected</p>
                        <h>Connected to:</h>
                        <p id="network">Not connected</p>
                    </div>
                    <div class="title">
                        <h>My collection</h>
                    </div>`;

    content += `<div class="collection">`;
    chains.forEach((chain) => {
        let title = chain.charAt(0).toUpperCase() + chain.slice(1);
        let hide = (window.localStorage.getItem(`${chain}_hide`) == 1);
        content += `<div class="network_title" id="${chain}_title">
                        <img src="img/logos/${chain}.svg" alt="${chain}_logo">
                        <button id="${chain}_hideShow" onclick="hideShowCollection('${chain}')" title="${title} (hide/show)">${title} `;
                        if(hide){
                            content += `ʌ`
                        } else {
                            content += `v`
                        }
                        content += `</button>
                        <p id="${chain}_loading"><p>
                    </div>
                    <div class="network_content" id="${chain}"`;
                    if(hide) {
                        content += ` style="display: none;"`
                    }
                    content += `>
                        <button id="${chain}_load"></button>
                        <div id="${chain}_content"></div>
                    </div>`;
    });
    content += `</div>`;

    return content;
}

export{ loadContent }