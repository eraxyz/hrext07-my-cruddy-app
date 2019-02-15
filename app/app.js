
$(document).ready(function(){

  var collection;
  var wishlist;
  var currentCard;

  //Bug fix for case of empty Collection or wishlist
  if (localStorage.getItem('Collection') === ''){
    collection = [];
  }
  if (localStorage.getItem('Wishlist') === ''){
    wishlist = [];
  }

  // Get collection and wishlist from localStorage
  if (collection === undefined && wishlist === undefined){
    collection = JSON.parse(localStorage.getItem('Collection'));
    wishlist = JSON.parse(localStorage.getItem('Wishlist'));
  }

  // Set collection to empty array if null
  if (collection === null){
    collection = [];
  }

  // Set wishlist to empty array if null
  if (wishlist === null){
    wishlist = [];
  }

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
    $('.qty').text('');
    var searchData = $('.input-key').val();

    $.getJSON("https://api.magicthegathering.io/v1/cards?name=" + searchData, function(data){

      for(value of data.cards){
        $('.container-data').append('<div class="display-result" id='+value.id+'>' + value.name + '</div>');
      }
      getCardImage(data.cards, searchData);

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

    // If collection is empty display "how to use" message and mtg card back
    if (collection.length === 0){
      $('.container-data').text(`My MTG Card Collection is a tool to help you keep track of your physical card collection. It can also serve as a way to look up cards and create a wishlist. To begin, search the name of a card and click on the card you're looking for from the results. From there you can add it to your collection or wishlist. To view your collection or wishlist, click on the "My Collection" or "My Wishlist" buttons. To clear all cards from a list, click on the corresponding reset button.`);
      $('.qty').text('');
      $('.card-image').attr('src', 'Card-back.jpg');
      $('.card-image').css("visibility", "visible");
      $('.btns').css("visibility", "hidden");
      $('.c-qty-text').text('');
      $('.w-qty-text').text('');

    } else {

      $('.container-data').text('');
      $('.qty').text('');
      $('.container-data').prepend('<h3>Collection</h3>');
      for (var value of collection){
        $('.qty').append('<div>' + value.collectionQuantity + '\t</div>')
        $('.container-data').append('<div class="display-result" id='+value.id+'>' + value.name + '</div>');
      }
      // Call function to display card
      getCardImage(collection);
    }
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
    $('.qty').text('');
    $('.container-data').prepend('<h3>Wishlist</h3>');
    for (var value of wishlist){
      $('.qty').append('<div>' + value.wishlistQuantity + '\t</div>')
      $('.container-data').append('<div class="display-result" id='+value.id+'>' + value.name + '</div>');
    }
    // Call function to display card
    getCardImage(wishlist);

  });

  // Display clicked card
  $('.container-data').on('click', '.display-result', function(e){

    $.getJSON("https://api.magicthegathering.io/v1/cards?id=" + e.currentTarget.id, function(data){
      if (data.cards[0].hasOwnProperty('imageUrl')){
        $('.card-image').attr("src", data.cards[0].imageUrl);
        $('.btns').css("visibility", "visible");
        currentCard = data.cards[0];
        delete currentCard.foreignNames;
        searchQuantities();
      } else {
        $.getJSON("https://api.magicthegathering.io/v1/cards?name=" + e.currentTarget.innerText, function(data){
          getCardImage(data.cards, e.currentTarget.innerText);
        });
      }
    });
  });

  // delete collection
  $('.btn-clear-collection').click(function(){

    if(window.confirm("Are you sure you want to delete all data from your collection?")){
      collection = [];
      localStorage.setItem('Collection', collection);
      $('.btn-view-collection').trigger('click');
    }

  });

  // delete wishlist
  $('.btn-clear-wishlist').click(function(){

    if(window.confirm("Are you sure you want to delete all data from your wishlist?")){
      wishlist = [];
      localStorage.setItem('Wishlist', []);
      $('.btn-view-collection').trigger('click');
    }

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
      }
    }
    if (currentCard.collectionQuantity === undefined){
      currentCard.collectionQuantity = 1;
      collection.push(currentCard);
    }
    localStorage.setItem("Collection", JSON.stringify(collection));
    searchQuantities();
    var title = document.getElementsByTagName('h3');
    if (title[0].textContent === 'Collection'){
      // Set current card to temp variable so card image doesn't change if already in collection
      var temp = currentCard;
      $('.btn-view-collection').trigger('click');
      getCardImage(collection, temp.name);
    }

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
      }
    }
    if (currentCard.wishlistQuantity === undefined){
      currentCard.wishlistQuantity = 1;
      wishlist.push(currentCard);
    }
    localStorage.setItem("Wishlist", JSON.stringify(wishlist));
    searchQuantities();
    var title = document.getElementsByTagName('h3');
    if (title[0].textContent === 'Wishlist'){
      // Set current card to temp variable so card image doesn't change if already in wishlist
      var temp = currentCard;
      $('.btn-view-wishlist').trigger('click');
      getCardImage(wishlist, temp.name);
    }

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
    var title = document.getElementsByTagName('h3');
    if (title[0].textContent === 'Collection'){
      // Set current card to temp variable so card image doesn't change if already in collection
      var temp = currentCard;
      $('.btn-view-collection').trigger('click');
      getCardImage(collection, temp.name);
    }
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
    var title = document.getElementsByTagName('h3');
    if (title[0].textContent === 'Wishlist'){
      // Set current card to temp variable so card image doesn't change if already in wishlist
      var temp = currentCard;
      $('.btn-view-wishlist').trigger('click');
      getCardImage(wishlist, temp.name);
    }
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

  function getCardImage(array, name){
    // if name is not passed in, return url of first card in array
    // if name is passed in, loop through array until card is found
    // display card

    $('.card-image').css("visibility", "visible");

    for (var value of array){
      if (name === undefined){
        $('.card-image').attr("src", value.imageUrl);
        $('.btns').css("visibility", "visible");
        currentCard = value;
        delete currentCard.foreignNames;
        searchQuantities();
        break;
      } else if (value.name === name){
        $('.card-image').attr("src", value.imageUrl);
        $('.btns').css("visibility", "visible");
        currentCard = value;
        delete currentCard.foreignNames;
        searchQuantities();
        break;
      }
    }
  }

  $('.btn-view-collection').trigger('click');

});
