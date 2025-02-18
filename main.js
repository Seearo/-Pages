(function () {
    // создаем переменную для карточек
    // переменные намбер и бтн
    let number = document.querySelector(`.number`);
    let btn = document.querySelector(`#page`);
    let card;
    // пишем функцию в которой название класса нужного элемента будет поставлено в переменную card
    function classOfContent(classOfCard) {
        card = classOfCard;
    }
    // вызываем функцию ставя значение в переменную
    classOfContent(`card`);
    // создаем псевдо коллекцию по классу из функции выще
    let cardCollection = document.getElementsByClassName(card);
    let cardArray = Array.from(cardCollection); // псевдоколлекцию переводим в массив

    // создаем переменную контент и кладем туда класс контент
    let content = document.querySelector(`.content`);


    let plate = `
    
       <figure class="img-container">
           <img src="img/img1.jpg" alt="" class="pic">
           <figcaption class="text-under-img"></figcaption>
       </figure>
        <div class="text-info">
           <h3 class="he-header"></h3>
            <p class="text-card"></p>
       </div>
   
       `;


    //обработка формы из файла index.html и создания на основе этих данных элемента card  с пушем в cardArray

    let form = document.querySelector(`#add-content`);
    form.addEventListener(`submit`, function (event) {
        event.preventDefault(); // Предотвращение стандартного поведения формы
        let name = document.querySelector(`#name`);
        let text = document.querySelector(`#area`);
        let img = document.querySelector(`#img`);
        let caption = document.querySelector(`#caption`);


        if (name.value === "" || text.value === "" || img.value === "" || caption.value === "") {
            alert(`Please fill in all fields`);
        } else {

            let newCard = document.createElement(`div`);
            content.prepend(newCard);

            // download file from #img field to newCard.querySelector(`.pic`).src
            let reader = new FileReader();
            reader.addEventListener(`load`, function () {
                newCard.querySelector(`.pic`).src = reader.result;
            });
            reader.readAsDataURL(img.files[0]);


            newCard.className = `card`;
            newCard.innerHTML = plate;
            // add image from form #add-content to newCard.querySelector(`.pic`).src




            newCard.querySelector(`.he-header`).textContent = name.value;
            newCard.querySelector(`.text-card`).textContent = text.value;
            newCard.querySelector(`.text-under-img`).textContent = caption.value;
            console.log(newCard, 1);

            // Добавление нового элемента card в контент и массив cardArray
            cardArray.unshift(newCard); // тест
            console.log(cardArray, 2);

            // change cardArray on server for add new data from form input
            // создаем переменную дата и кладем туда данные из формы
            let data = {
                name: name.value,
                text: text.value,
                img: reader.result,
                caption: caption.value
            };

            fetch(`http://localhost:3000/add`, {
                // отправляем данные на сервер
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            ).then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
            }
            )
        }
        // read cardArray on server and copy to cardArray on client
        fetch(`http://localhost:3000/get`).then(function (response) {
            return response.json();
        }).then(function (data) {
            cardArray.push(data);
            pagination(index, cardArray);
        });


        name.value = "";
        text.value = "";
        img.value = "";
        caption.value = "";

        pegination(index, cardArray);

    })


    /* let data = {
        name: name.value,
        text: text.value,
        img: reader.result,
        caption: caption.value
    };


    fetch(`http://localhost:3000/add`, {
        // отправляем данные на сервер
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });

    // download data from cardArray on server every 2 sec to client
    setInterval(function () {
        fetch(`http://localhost:3000/get`).then(function (response) {
            return response.json();
        }).then(function (data) {
            cardArray.push(data);
            pagination(index, cardArray);
        });
    }, 2000); */



    let index = content.id; // создаем переменную индекс и кладем контент айди как индекс количества контента на странице
    let indexOf = document.querySelector(`.indexOf`); // создаем переменную и кладем в нее индекс офф
    indexOf.textContent = index; // вставляем текст в переменную в виде индекса страниц

    let backContent = []; // создаем переменную для массива элементов которые были удалены

    for (let i = 0; i < index; i++) {
        backContent.push(cardArray[i]);
    }
    // update content form cardArray after add new content by form button with #add-content id
    
    



    console.log(backContent, 'back');
    // пишем функцию с значениями массива и индекса страниц
    function pegination(index, cardArray) {
        // создаем переменную пейджс и пишем формулу определения страниц
        let pages = cardArray.length / index;

        // пишем переменную максимум и кладем туда класс. Заменяем текст на максимум страниц (округление)
        let max = document.querySelector(`.max`);
        max.textContent = Math.ceil(pages);

        sort()


        // создаем функцию с нажатием кнопки
        btn.addEventListener(`click`, sort )
    


            function sort() {


            // цикл обнуления отображаемых элементов
            for (let i = 0; i < backContent.length; i++) {
                backContent[i].style.display = `none`;
            }
            // условие при котором значение перейдет в изначальное
            if (number.value > max || number.value < 1) {
                number.value = 1;
                indexOf.textContent = "We don't find this page!";
                firstPage();
                return;
            } else {
                // переменная конкретной страницы
                let currentPage = number.value * index;

                // кладем в контент часть из массива карточек взятых по двум индексам

                let contents = cardArray.slice(currentPage - index, currentPage);

                backContent = [];

                for (let i = 0; i < contents.length; i++) {
                    contents[i].style.display = `block`; // меняем стиль у нужных нам элементов
                    backContent.push(contents[i]); // кладем в массив элементы которые были добавлены
                }


            }
        };




    }

    function firstPage() {
        for (let i = 0; i < index; i++) {
            cardArray[i].style.display = `block`;
        }
    }
    firstPage();

    pegination(index, cardArray);
})();

console.log(`Создавалось при советах Giga chat`);


