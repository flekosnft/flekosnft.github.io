function loadContent(){
    return `<div class="title">
                <h id="name"></h>
                <div class="chainInfo">
                    <p id="chainInfo">Loading current network</p>
                    <p id="loadingChain"></p>
                </div>
                <div class="ownerInfo">
                    <h>Owner:</h>
                    <p id="owner"></p>
                    <p id="loadingOwner"></p>
                </div>
            </div>
            <div class="image">
                <img id="image" title="image" src="img/loading.gif" alt="image">
            </div>
            <div id="attributes" class="attributes">
            </div>`;
}

export { loadContent }