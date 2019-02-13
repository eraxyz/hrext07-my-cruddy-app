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

  // Get collection and wishlist from localStorage
  var collection = JSON.parse(localStorage.getItem('Collection'));
  var wishlist = JSON.parse(localStorage.getItem('Wishlist'));

  // Set collection to empty array if null
  if (collection === null){
    collection = [];
  }

  // Set wishlist to empty array if null
  if (wishlist === null){
    wishlist = [];
  }

  // Curent Card
  var currentCard;

  // Search for input
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
          // Call function to display card
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

    $('.input-key').val('');
  });

  // Display collection
  $('.btn-view-collection').click(function(){

    // Clear data container
    // Add "Collection" heading
    // Add all cards in collection
    // Display first card in collection
    // Display number of cards in collection
    // Display number of each individual card in collection

    $('.container-data').text('');
    $('.container-data').prepend('<h3> Collection </h3>');
    for (var value of collection){
      $('.container-data').append('<div class="display-result">' + value.name + '</div>');
    }

    // Call function to display card

  });

  // Display wishlist
  $('.btn-view-wishlist').click(function(){

    // Clear data container
    // Add "Wishlist" heading
    // Add all cards in wishlist
    // Display first card in wishlist
    // Display number of cards in wishlist
    // Display number of each individual card in wishlist

    $('.container-data').text('');
    $('.container-data').prepend('<h3> Wishlist </h3>');
    for (var value of wishlist){
      $('.container-data').append('<div class="display-result">' + value.name + '</div>');
    }

    // Call function to display card

  });

  // Display clicked card
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
            break;
          }
        }
      });
  });

  // delete all?
  $('.btn-clear').click(function(){
    localStorage.clear();
    // $('.container-data').text('');
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

  // Remove from collection
  $('.remove-collection').click(function(){

    // remove current card being displayed from collection
    // If in the collection, subtract 1 to quantity
    // If quantity is now 0, remove from collection
    // Update collection on localStorage.
    // Update quantity in collection text shown below the card

    for (var card of collection){
      if(card.name === currentCard.name){
        if (card.collectionQuantity > 0){
            card.collectionQuantity--;
        }
        if (card.collectionQuantity === 0){
            for (var index in collection){
              if (collection[index].name === card.name){
                collection.splice(index, 1);
              }
            }
            delete card.collectionQuantity;
        }
        currentCard.collectionQuantity = card.collectionQuantity;
      }
    }

    localStorage.setItem("Collection", JSON.stringify(collection));
    searchQuantities();

  });

  // Remove from wishlist
  $('.remove-wishlist').click(function(){

    // Search through wishlist for card currently being displayed
    // If found, add 1 to quantity
    // If quantity now equals 0, remove from wishlist
    // Update wishlist on localStorage.
    // Update quantity in wishlist text shown below the card

    for (var card of wishlist){
      if(card.name === currentCard.name){
        if (card.wishlistQuantity > 0){
            card.wishlistQuantity--;
        }
        if (card.wishlistQuantity === 0){
            for (var index in wishlist){
              if (wishlist[index].name === card.name){
                wishlist.splice(index, 1);
              }
            }
            delete card.wishlistQuantity;
        }
        currentCard.wishlistQuantity = card.wishlistQuantity;
      }
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
