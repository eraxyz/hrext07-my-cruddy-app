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

  $('.btn-add').on('click', function(e){

    //1. Get input string
    //2. Search for matching cards using mtg api
    //3. Display matches in container-data
    //4. If any perfect matches, get card image and display in card-image
    //5. Show "Results for 'search'"
    //6. Clear input string
    //7. (Opt) Display card text under card image


    var searchData = $('.input-key').val();

      $.getJSON("https://api.magicthegathering.io/v1/cards?name=" + searchData, function(data){
      console.log(data);

      for(value of data.cards){
        $('.container-data').append("<div>" + value.name + "</div>");
        if (value.name === searchData){
          var cardImage = value.imageUrl;
          $('.card-image').attr("src", value.imageUrl);
          //localStorage.setItem(cardName, JSON.stringify(value));
          break;
        }
      }

      $('.container-data').prepend("<h2> Results for: " + searchData+ " </h2>");

    });

    //$('.container-data').html('<div class="display-data-item" data-keyValue="'+ searchData +'"></div>');
    $('.input-key').val('');
  });


  // update db
    // need to expand when  more than 1 item is added

  // delete item
  $('.container-data').on('click', '.display-data-item', function(e){
    console.log(e.currentTarget.dataset.keyvalue);
    var keyData = e.currentTarget.dataset.keyvalue;
    localStorage.removeItem(keyData);
    $('.container-data').text('');
  });
  // delete all?
  $('.btn-clear').click(function(){
    localStorage.clear();
    $('.container-data').text('');
  });

});
