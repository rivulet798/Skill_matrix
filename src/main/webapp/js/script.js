$(document).ready(loadSkillMatrix());


function loadSkillMatrix() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var categories = JSON.parse(this.responseText);
            for(var index = 0; index < categories.length; index++) {
                var name = categories[index].name;
                var number_of_subcategories = categories[index].subCategories.length;
                insert_main_categories(name, number_of_subcategories);
            }
        }
    };
    xhttp.open("GET", "skills", true);
    xhttp.send();
}

function insert_main_categories(categoryName, number_of_subcategories){
    var category = document.createElement('input');
    category.id = categoryName;
    category.type = 'button';
    category.className = 'button main_button';
    category.value = categoryName+" "+number_of_subcategories;
    category.onclick = function(event) {
        open_close_subcategories(this.id);
    };
    category.ondblclick = function (ev) {
        open_close_edit(this.id);
    };

    var add = document.createElement('input');
    add.id = categoryName+"_add";
    add.type = 'button';
    add.className = 'button add';
    add.value = "Add";
    add.onclick = function(event) {
        addSubcategory(categoryName);
    };

    var del = document.createElement('input');
    del.id = categoryName+"_del";
    del.type = 'button';
    del.className = 'button del';
    del.value = "Delete";
    del.onclick = function(ev) {
        deleteCategory(categoryName);
    };

    var div = document.createElement('div');
    div.id = categoryName + "_categoryContainer";
    div.className = 'child';
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.append(add);
    div.append(category);
    div.append(del);

    $("#main_categories").append(div);
}

var previous_click = null;
function open_close_subcategories(categoryName){
    var save = document.getElementById(previous_click + "_save");
    var cancel = document.getElementById(previous_click + "_cancel");
    if(categoryName !== previous_click || previous_click===null || save === null) {
        delete_edit_block(previous_click);
        deleteAddBlock();
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

                    var add = document.createElement('input');
                    add.id = name+"_add";
                    add.type = 'button';
                    add.className = 'button add';
                    add.value = "Add";
                    add.onclick = function(event) {
                        var catName = this.id.substr(0, this.id.length-4);
                        addSubcategory(catName);
                    };

                    var del = document.createElement('input');
                    del.id = name+"_del";
                    del.type = 'button';
                    del.className = 'button del';
                    del.value = "Delete";
                    del.onclick = function(ev) {
                        var catName = this.id.substr(0, this.id.length-4);
                        deleteCategory(catName);
                    };

                    var category = document.createElement('input');
                    category.id = name;
                    category.type = 'button';
                    category.className = 'button';
                    category.value = name + " " + categories[index].subCategories.length;
                    var colorNumber = categories[index].level;
                    if(colorNumber > 9){
                        colorNumber = colorNumber
                    }
                    category.onclick = function (event) {
                        open_close_subcategories(this.id);
                    };
                    category.ondblclick = function (ev) {
                        open_close_edit(this.id);
                    };
                    category.style.backgroundColor = colorsArray[colorNumber];

                    var categoryContainer = document.createElement('div');
                    categoryContainer.id = categoryName + "_categoryContainer";
                    categoryContainer.className = 'categoryContainer';
                    categoryContainer.style.display = 'flex';
                    categoryContainer.style.flexDirection = 'row';
                    categoryContainer.append(add);
                    categoryContainer.append(category);
                    categoryContainer.append(del);

                    div.append(categoryContainer);
                }
                var parentCategory = document.getElementById(categoryName);
                var container = document.getElementById("main_categories");
                if (parentCategory.parentElement.parentElement === container) {
                    var content = document.getElementById("subCategories");
                    while (content.firstChild) {
                        content.removeChild(content.firstChild);
                    }
                    content.append(div);
                } else {
                    parentCategory.parentElement.parentElement.insertBefore(div, parentCategory.parentElement.nextSibling);
                }
            }

        };
        categoryName = categoryName.replace("/","@");
        xhttp.open("GET", "skills/category/" + categoryName +"/subCategories", true);
        xhttp.send();
}



function open_close_edit(categoryName){
    var save = document.getElementById(categoryName + "_save");
    var cancel = document.getElementById(categoryName + "_cancel");
    if(save===null){
        insert_edit_block(categoryName);
    }else{
        delete_edit_block(categoryName);
    }
}

function delete_edit_block(categoryName) {
    var changeSave = document.getElementById(categoryName + "_save");
    var changeCancel = document.getElementById(categoryName + "_cancel");
    if(changeSave!==null) {
        changeSave.value = "Add";
        changeSave.id = categoryName+"_add";
        changeSave.className = "button add";
        changeSave.onclick = function(event) {
            addSubcategory(categoryName);
        };
        changeCancel.value = "Delete";
        changeCancel.id = categoryName+"_del";
        changeCancel.className = "button del";
        changeCancel.onclick = function(ev) {
            deleteCategory(categoryName);
        };

        var category = document.getElementById(categoryName);
        var parent = category.parentElement.parentElement;
        var container = document.getElementById("main_categories");
        if(parent == container){
            category.parentElement.className = 'child';
            category.type = 'button';
            category.className = 'button main_button';
            category.value = categoryName;
        }else{
            category.parentElement.className = 'categoryContainer';
            category.type = 'button';
            category.className = 'button';
            category.value = categoryName;
        }
    }
}

function insert_edit_block(categoryName) {
    var category = document.getElementById(categoryName);
    category.type = "input";
    category.value = categoryName;
    category.parentElement.className = 'edit_container';

    var changeAdd = document.getElementById(categoryName+"_add");
    changeAdd.id = categoryName+"_save";
    changeAdd.value = "Save";
    changeAdd.className = "button save";

    changeAdd.onclick = function(event) {
        var editCategoryName = category.value;
        edit(categoryName, editCategoryName);
    };

    var changeDel = document.getElementById(categoryName+"_del");
    changeDel.id = categoryName+"_cancel";
    changeDel.value = "Cancel";
    changeAdd.className = "button cancel";
    changeDel.onclick = function(event) {
        delete_edit_block(categoryName);
    };

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
    editCategoryName = editCategoryName.replace("/","@");
    var json = JSON.stringify({
        editCategoryName: editCategoryName
    });

    if(categoryName !== editCategoryName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if(result === true){
                    categoryName = categoryName.replace("@","/");
                    editCategoryName = editCategoryName.replace("@","/");
                    delete_edit_block(categoryName);
                    var category = document.getElementById(categoryName);
                    category.value = editCategoryName;
                    category.id = editCategoryName;
                    var add = document.getElementById(categoryName+"_add");
                    var del = document.getElementById(categoryName+"_del");
                    var subcategories = document.getElementById(categoryName+"child");
                    add.id = editCategoryName+"_add";
                    add.onclick = function (ev) {
                        addSubcategory(editCategoryName);
                    };
                    del.id = editCategoryName+"_del";
                    del.onclick = function (ev) {
                        deleteCategory(editCategoryName);
                    };
                    subcategories.id = editCategoryName+"child";
                }
            }
        };

        categoryName = categoryName.replace("/","@");
        xhttp.open("PUT", "skills/category/" + categoryName , true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(json);
    }
}

function deleteCategory(categoryName) {
    alert(categoryName);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            if(result === true){
                categoryName = categoryName.replace("@","/");
                var category = document.getElementById(categoryName);
                var child = document.getElementById(categoryName+"child");
                category.parentElement.remove();
                if(child !== null){
                    child.remove();
                }
            }
        }
    };
    categoryName = categoryName.replace("/","@");
    xhttp.open("DELETE", "skills/category/" + categoryName , true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send();

}

function addSubcategory(categoryName){
    deleteAddBlock();
    var save = document.getElementById(previous_click + "_save");
    var cancel = document.getElementById(previous_click + "_cancel");
    if(categoryName !== previous_click || previous_click===null || save === null) {
        delete_edit_block(previous_click);
        var div = document.getElementById(categoryName+'child');
        if(div !== null){
            div.remove();
        }
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

                    var add = document.createElement('input');
                    add.id = name+"_add";
                    add.type = 'button';
                    add.className = 'button add';
                    add.value = "Add";
                    add.onclick = function(event) {
                        var catName = this.id.substr(0, this.id.length-4);
                        addSubcategory(catName);
                    };

                    var del = document.createElement('input');
                    del.id = name+"_del";
                    del.type = 'button';
                    del.className = 'button del';
                    del.value = "Delete";
                    del.onclick = function(ev) {
                        var catName = this.id.substr(0, this.id.length-4);
                        deleteCategory(catName);
                    };

                    var category = document.createElement('input');
                    category.id = name;
                    category.type = 'button';
                    category.className = 'button';
                    category.value = name + " " + categories[index].subCategories.length;
                    var colorNumber = categories[index].level;
                    if(colorNumber > 9){
                        colorNumber = colorNumber
                    }
                    category.onclick = function (event) {
                        open_close_subcategories(this.id);
                    };
                    category.ondblclick = function (ev) {
                        open_close_edit(this.id);
                    };
                    category.style.backgroundColor = colorsArray[colorNumber];

                    var categoryContainer = document.createElement('div');
                    categoryContainer.id = categoryName + "_categoryContainer";
                    categoryContainer.className = 'categoryContainer';
                    categoryContainer.style.display = 'flex';
                    categoryContainer.style.flexDirection = 'row';
                    categoryContainer.append(add);
                    categoryContainer.append(category);
                    categoryContainer.append(del);

                    div.append(categoryContainer);
                }
                var parentCategory = document.getElementById(categoryName);
                var container = document.getElementById("main_categories");
                if (parentCategory.parentElement.parentElement === container) {
                    var content = document.getElementById("subCategories");
                    while (content.firstChild) {
                        content.removeChild(content.firstChild);
                    }
                    content.append(div);
                } else {
                    parentCategory.parentElement.parentElement.insertBefore(div, parentCategory.parentElement.nextSibling);
                }
                insertAddInput(categoryName, colorsArray[colorNumber]);
            }

        };
        categoryName = categoryName.replace("/","@");
        xhttp.open("GET", "skills/category/" + categoryName +"/subCategories", true);
        xhttp.send();
    }
    previous_click = categoryName;
}

function insertAddInput(categoryName, color){
    var addBlock = document.getElementById("newCategoryContainer");
    if(addBlock === null) {
        var save = document.createElement('input');
        save.id = "saveNewCategory";
        save.type = 'button';
        save.className = 'button save';
        save.value = "Save";
        save.onclick = function (event) {
            var subCategoryName = newCategory.value;
            add(categoryName, subCategoryName);
        };

        var cancel = document.createElement('input');
        cancel.id = "cancelNewCategory";
        cancel.type = 'button';
        cancel.className = 'button cancel';
        cancel.value = "Cancel";
        cancel.onclick = function (ev) {
             deleteAddBlock();
        };

        var newCategory = document.createElement('input');
        newCategory.id = "newCategory";
        newCategory.type = 'input';
        newCategory.className = 'button';
        newCategory.value = " ";
        newCategory.style.backgroundColor = color;

        var categoryContainer = document.createElement('div');
        categoryContainer.id = "newCategoryContainer";
        categoryContainer.className = 'categoryContainer';
        categoryContainer.style.display = 'flex';
        categoryContainer.style.flexDirection = 'row';
        categoryContainer.append(save);
        categoryContainer.append(newCategory);
        categoryContainer.append(cancel);

        var div = document.getElementById(categoryName + "child");
        div.insertBefore(categoryContainer, div.firstChild);
    }
 }

function add(categoryName, subCategoryName) {
    alert(categoryName + " " + subCategoryName);
    subCategoryName = subCategoryName.replace("/","@");
    var json = JSON.stringify({
        subCategoryName: subCategoryName
    });

    if(subCategoryName.length != 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if(result === true){
                    var div = document.getElementById("newCategoryContainer");
                    div.id = categoryName+"_categoryContainer";

                    var changeSaveToAdd = document.getElementById("saveNewCategory");
                    changeSaveToAdd.id = subCategoryName+"_add";
                    changeSaveToAdd.className = "button add";
                    changeSaveToAdd.value = "Add";
                    changeSaveToAdd.onclick = function(event) {
                        addSubcategory(subCategoryName);
                    };

                    var category = document.getElementById("newCategory");
                    category.type = "button";
                    category.value = subCategoryName;

                    var changeCancelToDel = document.getElementById("cancelNewCategory");
                    changeCancelToDel.id = subCategoryName+"_del";
                    changeCancelToDel.className = "button del";
                    changeCancelToDel.value = "Delete";
                    changeCancelToDel.onclick = function(ev) {
                        deleteCategory(subCategoryName);
                    };

                }
            }
        };

        categoryName = categoryName.replace("/","@");
        xhttp.open("POST", "skills/category/" + categoryName , true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(json);
    }
}

function deleteAddBlock(){
    var addBlock = document.getElementById("newCategoryContainer");
    if(addBlock !== null){
        addBlock.remove();
    }
}