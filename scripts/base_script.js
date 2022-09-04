window.addEventListener('load', (event) => {
    document.getElementById('base').innerHTML = loadBase();
    document.getElementById('social').innerHTML = loadSocial();
});

function loadBase(){
    return `<div class="banner">
                <img class="logo" src="img/flekos_logo.png" alt="FLK">
            </div>
            <nav class="menu">
                <ul>
                    <li id="hall"><a href="/index.html">Hall</a></li>
                    <li id="showroom"><a href="/showroom.html">Showroom</a></li>
                    <li id="office"><a href="/office.html">Office</a></li>
                    <li id="room"><a href="/bedroom.html">Bedroom</a></li>
                </ul>
            </nav>`
}

function loadSocial(){
    return `<a href="https://twitter.com/flekos_nft">
                <img title="twitter" src="img/logos/twitter.svg" alt="twitter_logo">
            </a>
            <a href="https://discord.com/invite/CWbj6zfCEW">
                <img title="discord" src="img/logos/discord.svg" alt="discord_logo">
            </a>
            <a href="https://github.com/flekofather/Flekos">
                <img title="github" src="img/logos/github.svg" alt="github_logo">
            </a>`;
}