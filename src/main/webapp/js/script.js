$(document).ready(loadSkillMatrix());


function loadSkillMatrix() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var categories = JSON.parse(this.responseText);
            for(var index = 0; index < categories.length; index++) {
                var name = categories[index].name;
                var button = document.createElement('input');
                button.id = name;
                button.type = 'button';
                button.className = 'button';
                button.value = name+" "+categories[index].subCategories.length;
                button.onclick = function(event) {
                    button.type = 'button';
                    open_close_subcategories(this.id);
                };
                button.ondblclick = function (ev) {
                    open_close_edit(this.id);
                };
                $("#main_categories").append(button);
            }
        }
    };
    xhttp.open("GET", "skills", true);
    xhttp.send();
}

var previous_click = null;
function open_close_subcategories(categoryName){
    var save = document.getElementById(previous_click + " save");
    var cancel = document.getElementById(previous_click + " cancel");
    if(categoryName !== previous_click || previous_click===null || save === null) {
       delete_edit_block(previous_click);
        var div = document.getElementById(categoryName+'child');
        if(div===null){
            loadSubCategories(categoryName);
        }else{
            div.remove();
        }
    }
    previous_click = categoryName;
}

function loadSubCategories(categoryName) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var categories = JSON.parse(this.responseText);
            categoryName = categoryName.replace("@", "/");
            var div = document.createElement('div');
            div.className = 'container';
            div.id = categoryName + 'child';
            var colorsArray = [ '#FFE4B5', '#98FB98', '#FFB6C1', '#FFA07A', ' #B0E0E6', '#E6E6FA', '#FFB6C1', '#F0FFFF', '#AFEEEE', '#8FBC8F' ];
            for (var index = 0; index < categories.length; index++) {
                var name = categories[index].name;
                var button = document.createElement('input');
                button.id = name;
                button.type = 'button';
                button.className = 'button';
                button.value = name + " " + categories[index].subCategories.length;
                var colorNumber = categories[index].level;
                if(colorNumber > 9){
                    colorNumber = colorNumber
                }
                button.onclick = function (event) {
                    open_close_subcategories(this.id);
                };
                button.ondblclick = function (ev) {
                    open_close_edit(this.id);
                };
                button.style.backgroundColor = colorsArray[colorNumber];
                div.append(button);
            }
            var parentCategory = document.getElementById(categoryName);
            var container = document.getElementById("main_categories");
            if (parentCategory.parentElement === container) {
                var content = document.getElementById("subCategories");
                while (content.firstChild) {
                    content.removeChild(content.firstChild);
                }
                content.append(div);
            } else {
                parentCategory.parentNode.insertBefore(div, parentCategory.nextSibling);
            }
        }
    };
    categoryName = categoryName.replace("/","@");
    xhttp.open("GET", "skills/category/" + categoryName +"/subCategories", true);
    xhttp.send();
}

function open_close_edit(categoryName){
    var save = document.getElementById(categoryName + " save");
    var cancel = document.getElementById(categoryName + " cancel");
    if(save===null){
        insert_edit_block(categoryName);
    }else{
        delete_edit_block(categoryName);
    }
}

function delete_edit_block(categoryName) {
    var save = document.getElementById(categoryName + " save");
    var cancel = document.getElementById(categoryName + " cancel");
    if(save!==null) {
        save.remove();
        cancel.remove();
        var edit_div = document.getElementById(categoryName + "_edit");
        var next = edit_div.nextSibling;
        var parent = edit_div.parentNode;
        var category = document.getElementById(categoryName);
        parent.insertBefore(category, next);
        edit_div.remove();
        category.type = 'button';
        category.className = 'button';
    }
}

function insert_edit_block(categoryName) {
    var category = document.getElementById(categoryName);
    category.type = "input";
    category.value = categoryName;
    category.className = 'edit_child';

    var submit = document.createElement('input');
    submit.id = categoryName+" save";
    submit.type = 'button';
    submit.className = 'save_button';
    submit.value = "Save";
    submit.onclick = function(event) {
        var editCategoryName = category.value;
        edit(categoryName, editCategoryName);
    };

    var cancel = document.createElement('input');
    cancel.id = categoryName+" cancel";
    cancel.type = 'button';
    cancel.className = 'cancel_button';
    cancel.value = "Cancel";
    cancel.onclick = function(event) {
        delete_edit_block(categoryName);
    };


    var div = document.createElement('div');
    div.id = categoryName + "_edit";
    div.className = 'edit_container';
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    var parent = category.parentNode;
    var next = category.nextSibling;
    div.append(category);
    div.append(submit);
    div.append(cancel);

    parent.insertBefore(div, next);



    category.onkeyup = function (I) {
        // определяем какие действия нужно делать при нажатии на клавиатуру
        switch (I.keyCode) {
            // игнорируем нажатия на эти клавишы
            case KEYCODE_ENTER:  // enter
            case KEYCODE_ESC:  // escape
                break;

            default:
                // производим поиск только при вводе более 2х символов
                if (category.value.length > 1 && category.value !== categoryName) {
                    var name = category.value;
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var category = JSON.parse(this.responseText);
                            if (category !== null) {
                                alert("false");
                            }
                        }
                    };
                    categoryName = categoryName.replace("/","@");
                    xhttp.open("GET", "skills/category/" + name, true);
                    xhttp.send();
                }
                break;
        }
    };

    // //считываем нажатие клавишь, уже после вывода подсказки
    // input.onkeydown = function (I) {
    //     switch (I.keyCode) {
    //         // по нажатию клавишь прячем подсказку
    //         case KEYCODE_ENTER: // enter
    //         case KEYCODE_ESC: // escape
    //             $('#search_advice_wrapper').hide();
    //             return false;
    //             break;
    //     }
    // };
    //




    //("<input type='text' value='" + originalContent + "' />");

    // $("#categoryName").addClass("cellEditing");
    // $("#categoryName").html("<input type='text' value='" + OriginalContent + "' />");
    // $("#categoryName").children().first().focus();
    // $("#categoryName").children().first().keypress(function (e) {
    //     if (e.which == 13) {
    //         var newContent = $("#categoryName").val();
    //         $("#categoryName").parent().text(newContent);
    //         $("#categoryName").parent().removeClass("cellEditing");
    //     }
    // });
    // $("#categoryName").children().first().blur(function () {
    //     $("#categoryName").parent().text(OriginalContent);
    //     $("#categoryName").parent().removeClass("cellEditing");
    // });
};



var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;
var KEYCODE_UP_ARROW = 38;
var KEYCODE_DOWN_ARROW = 40;
var suggest_count = 0;
var inputInitialValue = '';
var suggest_selected = 0;
function searchCategoriesByPartOfName() {
    // читаем ввод с клавиатуры
    var input = document.getElementById('search_category');

    input.onkeyup = function (I) {
        // определяем какие действия нужно делать при нажатии на клавиатуру
        switch (I.keyCode) {
            // игнорируем нажатия на эти клавишы
            case KEYCODE_ENTER:  // enter
            case KEYCODE_ESC:  // escape
            case KEYCODE_UP_ARROW:  // стрелка вверх
            case KEYCODE_DOWN_ARROW:  // стрелка вниз
                break;

            default:
                // производим поиск только при вводе более 2х символов
                if (input.value.length > 2) {
                    inputInitialValue = input.value;
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var categories = JSON.parse(this.responseText);
                            suggest_count = categories.length;
                            if (suggest_count > 0) {
                                // перед показом слоя подсказки, его обнуляем
                                $("#search_advice_wrapper").html("").show();
                                for (var index = 0; index < categories.length; index++) {
                                    $('#search_advice_wrapper').append('<div id="advice_variant" class="advice_variant">' + categories[index].name + '</div>')
                                }
                            }
                        }
                    };
                    inputInitialValue = inputInitialValue.replace("/", "@");
                    xhttp.open("GET", "skills/category/search/" + inputInitialValue, true);
                    xhttp.send();
                }
                break;
        }
    };

    //считываем нажатие клавишь, уже после вывода подсказки
    input.onkeydown = function (I) {
        switch (I.keyCode) {
            // по нажатию клавишь прячем подсказку
            case KEYCODE_ENTER: // enter
            case KEYCODE_ESC: // escape
                $('#search_advice_wrapper').hide();
                return false;
                break;
        }
    };

    // делаем обработку клика по подсказке

    $("#advice_variant").onclick = function(){
        alert('hello');
        // ставим текст в input поиска
        $('#search_category').value($(this).text());
        // прячем слой подсказки
        $('#search_advice_wrapper').fadeOut(350).html("");
    };



    // если кликаем в любом месте сайта, нужно спрятать подсказку
    document.onclick = function (e) {
        $('#search_advice_wrapper').hide();
    };
    // если кликаем на поле input и есть пункты подсказки, то показываем скрытый слой
    input.onclick = function (event) {
        if (suggest_count)
            $('#search_advice_wrapper').show();
        event.stopPropagation();
    }
    //
    //
    // function key_activate(n) {
    //     $('#search_advice_wrapper div').eq(suggest_selected - 1).removeClass('active');
    //
    //     if (n == 1 && suggest_selected < suggest_count) {
    //         suggest_selected++;
    //     } else if (n == -1 && suggest_selected > 0) {
    //         suggest_selected--;
    //     }
    //
    //     if (suggest_selected > 0) {
    //         $('#search_advice_wrapper div').eq(suggest_selected - 1).addClass('active');
    //         $("#search_category").val($('#search_advice_wrapper div').eq(suggest_selected - 1).text());
    //     } else {
    //         $("#search_category").val(inputInitialValue);
    //     }
    // }

}


// function getCategoriesByPartOfName(search_category) {
//     var xhttp = new XMLHttpRequest();
//
//     var search_category = document.getElementById(search_category).value;
//     alert(search_category);
//
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             var category = JSON.parse(this.responseText);
//             var button = document.getElementById(category.name);
//             if(button!==null){
//                 button.style.backgroundColor = '#FFFF00';
//             }
//
//
//             // categoryName = categoryName.replace("@", "/");
//             // var div = document.createElement('div');
//             // div.className = 'container';
//             // div.id = categoryName + 'child';
//             // var colorsArray = [ '#FFE4B5', '#98FB98', '#4682B4', '#FFA07A', ' #B0E0E6', '#E6E6FA', '#FFB6C1', '#F0FFFF', '#AFEEEE', '#8FBC8F' ];
//             // for (var index = 0; index < categories.length; index++) {
//             //     var name = categories[index].name;
//             //     alert(name);
//             //     var button = document.createElement('input');
//             //     button.id = name;
//             //     button.type = 'button';
//             //     button.className = 'button';
//             //     button.value = name + " " + categories[index].subCategories.length;
//             //     var colorNumber = categories[index].level;
//             //     if(colorNumber > 9){
//             //         colorNumber = colorNumber
//             //     }
//             //     button.onclick = function (event) {
//             //         openbox(this.id);
//             //     };
//             //     button.style.backgroundColor = colorsArray[colorNumber];
//             //     div.append(button);
//             // }
//             // var parentCategory = document.getElementById(categoryName);
//             // var container = document.getElementById("main_categories");
//             // if (parentCategory.parentElement === container) {
//             //     var content = document.getElementById("subCategories");
//             //     while (content.firstChild) {
//             //         content.removeChild(content.firstChild);
//             //     }
//             //     content.append(div);
//             // } else {
//             //     parentCategory.parentNode.insertBefore(div, parentCategory.nextSibling);
//             // }
//         }
//     };
//     categoryName = categoryName.replace("/","@");
//     xhttp.open("GET", "skills/category/" + categoryName, true);
//     xhttp.send();
// }



function edit(categoryName, editCategoryName) {
    alert('in edit' + " "+ categoryName);
    alert('in edit' + " " + editCategoryName);
    var json = JSON.stringify({
        editCategoryName: editCategoryName
    });

    if(categoryName !== editCategoryName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if(result === true){
                    delete_edit_block(categoryName);
                    var category = document.getElementById(categoryName);
                    category.id = editCategoryName;
                }
            }
        };

        xhttp.open("PUT", "skills/category/" + categoryName , true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(json);
    }
}


