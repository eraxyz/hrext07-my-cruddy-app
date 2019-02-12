/*
Init app
interact with DOM
interact with localstorage

 */

 // write to db
 //localStorage.setItem(keyData, valueData);

 // read from db
 //var displayText = keyData + ' | ' + localStorage.getItem(keyData);
 // this only displays the last one? might want to switch to html
 // and append a div
 // <div class="display-data-item" data-keyValue="keyData">valueData</div>
 // if you use backticks ` you can use ${templateLiterals}
 // TODO make this vars make sense across the app

$(document).ready(function(){

  var collection = JSON.parse(localStorage.getItem('Collection'));
  var wishlist = JSON.parse(localStorage.getItem('Wishlist'));

  if (collection === null){
    collection = [];
  }
  if (wishlist === null){
    wishlist = [];
  }
  console.log(collection);

  // Curent Card
  var currentCard;

  $('.btn-add').on('click', function(e){

    //0. Clear results box1
    //1. Get input string
    //2. Search for matching cards using mtg api
    //3. Display matches in container-data
    //4. If any perfect matches, get card image and display in card-image
    //5. Show "Results for 'search'"
    //6. Clear input string
    //7. (Opt) Display card text under card image

    $('.container-data').text('');
    var searchData = $('.input-key').val();

      $.getJSON("https://api.magicthegathering.io/v1/cards?name=" + searchData, function(data){
      console.log(data);

      for(value of data.cards){
        $('.container-data').append('<div class="display-result">' + value.name + '</div>');
        if (value.name === searchData){
          $('.card-image').attr("src", value.imageUrl);
          $('.buttons').css("visibility", "visible");
          currentCard = value;
          delete currentCard.foreignNames;
          //localStorage.setItem(cardName, JSON.stringify(value));
          break;
        }
      }

      $('.container-data').prepend("<h3> Results for: " + searchData+ " </h3>");

    });

    //$('.container-data').html('<div class="display-data-item" data-keyValue="'+ searchData +'"></div>');
    $('.input-key').val('');
  });


  // update db
    // need to expand when  more than 1 item is added

  // delete item
  $('.container-data').on('click', '.display-result', function(e){
    //console.log(e.currentTarget.innerText);
      $.getJSON("https://api.magicthegathering.io/v1/cards?name=" + e.currentTarget.innerText, function(data){
        console.log(data);

        for(value of data.cards){
          if (value.name === e.currentTarget.innerText){
            $('.card-image').attr("src", value.imageUrl);
            currentCard = value;
            delete currentCard.foreignNames;
            //localStorage.setItem(cardName, JSON.stringify(value));
            break;
          }
        }

      });
  });
  // delete all?
  $('.btn-clear').click(function(){
    localStorage.clear();
    $('.container-data').text('');
  });

  // View previous card
  $('.btn-previous-card').click(function(){

  });

  // View next card
  $('.btn-next-card').click(function(){

  });

  // Add to collection
  $('.btn-add-collection').click(function(){

    // Search through collection for card currently being displayed
    // If found, add 1 to quantity
    // Else, add to collection with quantity 1.
    // Update collection on localStorage.
    // Update quantity in collection text shown below the card

    for (var card of collection){
      if(card.name === currentCard.name){
        card.quantity++;
        localStorage.setItem("Collection", JSON.stringify(collection));
        return;
      }
    }
    currentCard.quantity = 1;
    collection.push(currentCard);
    localStorage.setItem("Collection", JSON.stringify(collection));
  });

  // Add to wishlist
  $('.btn-add-wishlist').click(function(){

  });


});
