<!DOCTYPE html>

<html>
    <head>
        <link href="css/style.css" rel="stylesheet">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <script src="js/jquery-3.2.1.min.js"></script>
        <script src="js/script.js"></script>
    </head>

    <body>

    <div id="container">
        <div id="main_categories" class="child">
        </div>

        <div class="child">
            <form id="search_form" method="GET">
                <input id="search_category" type="text" placeholder="Search..." value="" autocomplete="off" onkeyup="searchCategoriesByPartOfName()">
                <button id="find" type="submit" onclick="getCategoriesByPartOfName('search_category')"></button>
            </form>
            <div id="search_advice_wrapper"></div>
        </div>
    </div>

    <div id="subCategories" class="child">
    </div>


    </body>
</html>