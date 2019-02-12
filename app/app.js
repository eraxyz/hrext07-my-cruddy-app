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
          $('.btns').css("visibility", "visible");
          currentCard = value;
          delete currentCard.foreignNames;
          searchQuantities();
          break;
        }
      }

      $('.container-data').prepend('<h3> Results for: "' + searchData+ '" </h3>');

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
            searchQuantities();
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

  // Add to collection
  $('.add-collection').click(function(){

    // Search through collection for card currently being displayed
    // If found, add 1 to quantity
    // Else, add to collection with quantity 1.
    // Update collection on localStorage.
    // Update quantity in collection text shown below the card

    for (var card of collection){
      if(card.name === currentCard.name){
        card.collectionQuantity++;
        currentCard.collectionQuantity = card.collectionQuantity;
        // localStorage.setItem("Collection", JSON.stringify(collection));
        // return;
      }
    }
    if (currentCard.collectionQuantity === undefined){
      currentCard.collectionQuantity = 1;
      collection.push(currentCard);
    }
    localStorage.setItem("Collection", JSON.stringify(collection));
    searchQuantities();

  });

  // Add to wishlist
  $('.add-wishlist').click(function(){

    // Search through wishlist for card currently being displayed
    // If found, add 1 to quantity
    // Else, add to wihslist with quantity 1.
    // Update wishlist on localStorage.
    // Update quantity in wishlist text shown below the card

    for (var card of wishlist){
      if(card.name === currentCard.name){
        card.wishlistQuantity++;
        currentCard.wishlistQuantity = card.wishlistQuantity;
        // localStorage.setItem("Wishlist", JSON.stringify(wishlist));
        // return;
      }
    }
    if (currentCard.wishlistQuantity === undefined){
      currentCard.wishlistQuantity = 1;
      wishlist.push(currentCard);
    }
    localStorage.setItem("Wishlist", JSON.stringify(wishlist));
    searchQuantities();

  });


  function searchQuantities(){

    var collectionFound = false;
    var wishlistFound = false;

    // Search collection for quantity
    for (var collectionItem of collection){
      if (collectionItem.name === currentCard.name){
        $('.c-qty-text').text('# in collection: ' + collectionItem.collectionQuantity);
        collectionFound = true;
      }
    }
    // If not in collection display 0
    if (collectionFound === false){
      $('.c-qty-text').text('# in collection: 0');
    }
    // Search wishlist for quantity
    for (var wishlistItem of wishlist){
      if (wishlistItem.name === currentCard.name){
        $('.w-qty-text').text('# in wishlist: ' + wishlistItem.wishlistQuantity);
        wishlistFound = true;
      }
    }
    // If not in wishlist display 0
    if (wishlistFound === false){
      $('.w-qty-text').text('# in wishlist: 0');
    }
  }

});
