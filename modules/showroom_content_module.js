function loadContent(){
    return `<div id="filers" class="filters">
                <h>Filters</h>
                <div class="search">
                    <form action="details.html">
                        <label for="search">Look for id: </label>
                        <input type="number" id="searchId" name="id" min="1" max="10000">
                        <input type="submit">
                    </form>
                    <form action="showroom.html">
                        <label for="search">Start showing from: </label>
                        <input type="number" id="searchStart" name="start" min="1" max="10000">
                        <input type="submit">
                    </form>
                </div>
            </div>
            <div class="canvas" id="canvas"></div>
            <div class="bottom">
                <button id="loadMore" style="display: block;">Load more</button>
            </div>`;
}

export { loadContent }