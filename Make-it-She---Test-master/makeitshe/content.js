
var turn_on = false; // Default
var name_dict = window.name_dict;
var word_dict = window.word_dict;
var all_words = Object.assign( {}, name_dict, word_dict );

var regex_word = new RegExp( "\\b" + Object.keys( word_dict ).join("\\b|\\b"), "gi" );
var regex_name = new RegExp( "\\b" + Object.keys( name_dict ).join("|"), "g" );

var strip = new RegExp(/-ad-|ad|audio|media|video|ai2html|banner|breadcrumbs|citation|combx|comment|community|cover-wrap|disqus|discussion|external|extra|footer|gdpr|head|header|legends|menu|navigation|nav|other|reference|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/gi);

var m_count = 0, f_count = 0;
var m_percent = 0, f_percent = 0;
var processed = false;
var values_name = fnames;
var turnMr = false;

var all_male_words = Object.keys( word_dict).concat( Object.keys( name_dict ) );;
var all_female_words = Object.values( word_dict ).concat( Object.values( name_dict ) );;

var mfnames = ["ETHAN", "CHRIS", "JOE", "NICK", "TOM", "ERIC", "JACOB", "RILEY", "GREG", "CLAY", "GRAHAM", "JUSTIN", "BARACK"];
var ffnames = ["ASHLYN", "CHRISTINA", "CAROLE", "JUSTINE", "ASHLEY", "JENNIFER", "BRITTANY", "ERIKA", "HAILEY"];


for ( var i = 0; i < all_male_words.length; i ++ ) {

    all_male_words[ i ] = all_male_words[ i ].toLowerCase();

}

for ( var i = 0; i < all_female_words.length; i ++ ) {

    all_female_words[ i ] = all_female_words[ i ].toLowerCase();

}

//
var temp_male_words = "male words:\n";
var temp_female_words = "female words:\n";
var temp_male_last_names = [];
var temp_female_last_names = [];





function applyContent () {

    if ( processed ) return;

    $("body").find("p, div,span"). contents().filter( function () { 


        if (this.parentNode.nodeName === "SCRIPT" || this.parentNode.nodeName ==="STYLE" || this.parentNode.nodeName === "IMG"
            || this.parentNode.nodeName === "LI" || this.parentNode.nodeName === "UL" || this.parentNode.nodeName === "IFRAME"
            || this.parentNode.nodeName === "NOSCRIPT" || this.parentNode.nodeName === "CITE"){
            return false;
        }
        
        if (this.nodeType === 1) {
        
            var res1 = [];
            var outertag1 = this.outerHTML;
            outertag1 = outertag1.substring(0, outertag1.indexOf('>'));
            res1 = outertag1.match(strip);
            
            if (Array.isArray(res1) && res1.length > 0){
                
                return false;
            }
        }
                
        var res = [];
        if (this.nodeType === 3)
        {
            if (this.parentNode.parentNode.nodeName === "LI" || this.parentNode.parentNode.parentNode.nodeName === "LI"){
                return false;
            }
            
            var outertag = this.parentNode.outerHTML;
            outertag = outertag.substring(0, outertag.indexOf('>'));
            res = outertag.match(strip);
        }
        else {
            return false;
        }
        if (Array.isArray(res) && res.length > 0) {
            return false;
        }
        /*if (this.nodeValue.split(' ').length < 15) {
            return false;
            }*/
        return true;
        
    }).replaceWith( function () {

        var str = this.nodeValue;
        var temp_words = str.split(/('|:|;|\/|\s+)/);
        var words = [];

        for ( var i = 0; i < temp_words.length; i ++ ) {

            var current_word = temp_words[i].trim().replace( /[.,\/#!$%\^&\*;:{}=\_`'"?~()]/g, "" );

            if ( current_word != '' ) {

                words[ words.length ] = current_word;

            }

        }

        if ( words.length == 0 ) {

            return str;

        }

        // Delete surname after Mr, Ms, M, Mme, Lady, Lord

        for ( var i = 0; i < words.length; i ++ ) {

            var w = words[ i ].replace( /[!?,.;`' ]/, '' );

            if ( w === 'Mr' || w === 'Ms' || w === 'M' || w === 'Mme' || w === 'Lady' || w === 'Lord' ) {

                words.splice( i + 1, 1 );

            }

        }

        //Delete surname after female name

                for ( var i = 0; i < words.length - 1; i ++ ) {

            if ( ffnames.indexOf( words[ i ].toUpperCase() ) !== -1 || name_dict[ words[ i ] ] && name_dict[ words[ i + 1 ] ] ) {

                nextWord = words[i+1];
                if (/[A-Z]/.test(nextWord[0]) && temp_female_last_names.indexOf(nextWord) === -1) {
                
                    temp_female_last_names.push(words[i + 1]);
                    words.splice( i + 1, 1 );
                    
                }

            }

        }

        for ( var i = 0; i < temp_female_last_names.length; i ++) {
        
            temp_female_last_names[i] = temp_female_last_names[i].toLowerCase();
            
        }
        
        //Delete surname after male name
        
        for ( var i = 0; i < words.length - 1; i ++ ) {

            if ( mfnames.indexOf( words[ i ].toUpperCase() ) !== -1 || name_dict[ words[ i ] ] && name_dict[ words[ i + 1 ] ] ) {

                nextWord = words[i+1];
                if (/[A-Z]/.test(nextWord[0]) && temp_male_last_names.indexOf(nextWord) === -1) {
                
                    temp_male_last_names.push(words[i + 1]);
                    words.splice( i + 1, 1 );
                    
                }

            }

        }
        
        for ( var i = 0; i < temp_male_last_names.length; i ++) {
        
            temp_male_last_names[i] = temp_male_last_names[i].toLowerCase();
            
        }
            

        // Count Male/Female Words

        for ( var i = 0; i < words.length; i ++ ) {

            if ( all_male_words.indexOf( words[ i ].toLowerCase() ) >= 0 || temp_male_last_names.indexOf(words[i].toLowerCase() ) >= 0 || mfnames.indexOf(words[i].toUpperCase() ) >= 0) {

                m_count ++;
                temp_male_words += words[i] + "\n";

            }

            if ( all_female_words.indexOf( words[ i ].toLowerCase() ) >= 0 || temp_female_last_names.indexOf(words[i].toLowerCase() ) >= 0 || ffnames.indexOf(words[i].toUpperCase() ) >= 0) {

                f_count ++;
                temp_female_words += words[i] +"\n";

            }

        }

        // Replace

        str = str.replace( regex_word, function ( matched, index, input ) {

            var lastSymbol = input[ index + matched.length ] || '';

            if ( lastSymbol !== '"' && lastSymbol !== '`' && lastSymbol !== "'" && lastSymbol !== '' && lastSymbol !== ',' && lastSymbol !== '.' && lastSymbol !== ')' && lastSymbol !== ';' && lastSymbol !== '!' && lastSymbol !== '?' && lastSymbol !== ' ' ) {

                return matched;

            }

            if ( matched === 'Mr' || matched === 'M' || matched === 'Lord' ) {

                // Delete surname after Mr, Ms, M, Mme, Lady, Lord
                turnMr = true;

            }

            if ( words.indexOf( matched ) >= 0 ) {

                var replacement = '';
                

                if ( typeof( all_words[ matched ] ) === 'undefined' ) {

                    replacement = all_words[ matched.toLowerCase() ];
                    

                    if ( matched[0] == matched[0].toUpperCase() ) {

                        if ( replacement ) {

                            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);

                        }

                    }

                } else {

                    replacement = all_words[ matched ];

                }

                return '<span class="makeitshe ignore-css replacement">' + replacement + '<span class="ignore-css tooltiptext">' + matched + '</span></span>';

            } else {

                return matched;

            }

        });
        


/**
        str = str.replace( regex_name, function ( matched ) {

            if ( turnMr === true && words.length === 1 ) {

                turnMr = false;
                return matched;

            }

            if ( words.indexOf( matched ) >= 0 ) {

                replacement = all_words[ matched ];
                return '<span class="makeitshe ignore-css replacement">' + replacement + '<span class="ignore-css tooltiptext">' + matched + '</span>' + '</span>';

            } else {

                return matched;

            }

        });

        return str;


    });

    **/
    
    m_percent = Math.round( m_count / (m_count + f_count) * 100 );
    f_percent = Math.round( f_count / (m_count + f_count) * 100 );

    processed = true;
  

});

let a = document.createElement('a');
a.href = "data:application/octet-stream,"+encodeURIComponent(temp_male_words + temp_female_words);
a.download = 'list.txt';
a.click();

};







//

chrome.runtime.onMessage.addListener( function ( msg, sender, sendResponse ) {

    if ( ( msg.from === 'popup' ) && ( msg.action === 'getStats' ) ) {

        var stats = {
            male: m_percent.toFixed(2),
            female: f_percent.toFixed(2)
        };
        
        sendResponse({
            stats: stats
        });
        return true;

    }else if( (msg.from === 'popup' ) && ( msg.action === 'getUrl' ) ){

           var url = window.location.href;
           var content ={
              url:url,
              all_male_words:all_male_words,
              all_female_words:all_female_words,
              name_dict:name_dict,
              word_dict:word_dict
           }
           sendResponse({
            content:content
           });

       return true;
    }

    if ( msg.activate ) {

        applyContent();
        
    } 

    else {

        $('.makeitshe').each( function ( index, el ) {

            var original_html = $( '.tooltiptext', $( this ) ).html();
            el.outerHTML = original_html;

        });

        processed = false;

    }

});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.highlight === true) {
        highlightText(document.body);
        sendResponse({messageStatus: "received"});
    }
});

///////////////// TODO /////////////////
// Fix... This takes ALL text areas and adds this label to them:
// $('textarea').attr("id","email-message");
// $('textarea').attr('class','autocomplete');

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {

    var laststring = this.value.split(' ').pop();

      var valueSuggestion, a, b, i, val = laststring.toLowerCase();
        
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/

       if(message_suggestions.hasOwnProperty(val)){

              valueSuggestion=message_suggestions[val];

              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + valueSuggestion + "</strong>";
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + valueSuggestion + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                   message  = $('#email-message').val();

                   var lastIndex = message.lastIndexOf(" ");

                   message = message.substring(0, lastIndex);

                   if(message=='')
                      inp.value = message;
                   else
                      inp.value = message+' ';

                   inp.value += this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
          });
              

                 a.appendChild(b);  


        }else{

           console.log('Key is not exist in Object!');
        }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

$("#email-message").keyup(function(){

   autocomplete(document.getElementById("email-message"), message_suggestions); 

});



 var message_suggestions = {
   "he": "they",
    "she": "they",
    "his": "theirs",
    "hers": "theirs", 
    "congressman": "congressperson",
    "congressmen": "congresspersons",
    "policeman": "policeperson",
    "policemen": "policepersons",
    "chairman": "chairperson",
    "chairmen": "chairpersons",
    "fireman": "fireperson",
    "firemen": "firepersons",
    "waterman": "waterperson",
    "watermen": "waterpersons",
    "nozzleman": "nozzleperson",
    "nozzlemen": "nozzlepersons",
    "adman": "adperson",
    "admen": "adpersons",
    "agribusinessman": "agribusinessperson",
    "agribusinessmen": "agribusinesspersons",
    "aidman": "aidperson",
    "airmen": "aidpersons",
    "alderman": "alderperson",
    "aldermen": "alderpersons",
  "almsman": "almsperson",
  "almsmen": "almspersons",
  "anchorman": "anchorperson",
  "anchormen": "anchorpersons",
  "antiman": "antiperson",
  "antimen": "antipersons",
  "artilleryman": "artilleryperson",
  "artillerymen": "artillerypersons",
  "ashmen": "ashpersons",
  "assemblyman": "assemblyperson",
  "assemblymen": "assemblypersons",
  "ataman": "ataperson",
  "atamen": "atapersons",
  "attackman": "attackperson",
  "attackmen": "attackpersons",
  "automan": "autoperson",
  "automae": "autopersons",
  "axeman": "axeperson",
  "axemen": "axepersons",
  "axman": "axperson",
  "axmen": "axpersons",
  "backcourtman": "backcourtperson",
  "backcourtmen": "backcourtpersons",
  "backwoodsman": "backwoodsperson",
  "backwoodsmen": "backwoodspersons",
  "badman": "badperson",
  "badmen": "badpersons",
  "bagman": "bagperson",
  "bagmen": "bagpersons",
  "bandsman": "bandsperson",
  "bandsmen": "bandspersons",
  "bargeman": "bargeperson",
  "bargemen": "bargepersons",
  "barman": "barperson",
  "barmen": "barpersons",
  "baseman": "baseperson",
  "basemen": "basepersons",
  "batman": "batperson",
  "batmen": "batpersons",
  "batsman": "batsperson",
  "batsmen": "batspersons",
  "bayman": "bayperson",
  "baymen": "baypersons",
  "beadsman": "beadsperson",
  "beadsmen": "beadspersons",
  "bedesman": "bedesperson",
  "bedesmen": "bedespersons",
  "bellman": "bellperson",
  "bellmen": "bellpersons",
  "birdman": "birdperson",
  "birdmen": "birdpersons",
  "bluesman": "bluesperson",
  "bluesmen": "bluespersons",
  "boardman": "boardperson",
  "boardmen": "boardpersons",
  "boatman": "boatperson",
  "boatmen": "boatpersons",
  "boatsman": "boatsperson",
  "boatsmen": "boatspersons",
  "bogyman": "bogyperson",
  "bogymen": "bogypersons",
  "bondman": "bondperson",
  "bondmen": "bondpersons",
  "bondsman": "bondspersons",
  "bondsmen": "bondsperson",
  "boogerman": "boogerperson",
  "boogermen": "boogerpersons",
  "boogeyman": "boogeyperson",
  "boogeymen": "boogeypersons",
  "boogyman": "boogyperson",
  "boogymen": "boogypersons",
  "bookman": "bookperson",
  "bookmen": "bookpersons",
  "bowmen": "bowpersons",
  "brakeman": "brakeperson",
  "brakemen": "brakepersons",
  "bushman": "bushperson",
  "bushmen": "bushpersons",
  "businessman": "businessperson",
  "businessmen": "businesspersons",
  "busman": "busperson",
  "busmen": "buspersons",
  "cabman": "cabperson",
  "cabmen": "cabpersons",
  "cameraman": "cameraperson",
  "cameramen": "camerapersons",
  "carman": "carperson",
  "carmen": "carpersons",
  "cattleman": "cattleperson",
  "cattlemen": "cattlepersons",
  "cavalryman": "cavalryperson",
  "cavalrymen": "cavalrypersons",
  "caveman": "caveperson",
  "cavemen": "caveperson",
  "cayman": "cayperson",
  "caymen": "caypersons",
  "chainman": "chainperson",
  "chainmen": "chainpersons",
  "chairmen": "chairpersons",
  "chapmen": "chappersons",
  "chessman": "chessperson",
  "chessmen": "chesspersons",
  "choreman": "choreperson",
  "choremen": "chorepersons",
  "churchman": "churchperson",
  "churchmen": "churchpersons",
  "clansman": "clansperson",
  "clansmen": "clanspersons",
  "clergyman": "clergyperson",
  "clergymen": "clergypersons",
  "clubman": "clubperson",
  "clubmen": "clubpersons",
  "coachman": "coachperson",
  "coachmen": "coachpersons",
  "coastguardman": "coastguardperson",
  "coastguardmen": "coastguardpersons",
  "coastguardsman": "coastguardsperson",
  "coastguardsmen": "coastguardspersons",
  "cochairman": "cochairperson",
  "cochairmen": "cochairpersons",
  "colorman": "colorperson",
  "colormen": "colorpersons",
  "committeeman": "committeeperson",
  "committeemen": "committeepersons",
  "cornerman": "cornerperson",
  "cornermen": "cornerpersons",
  "corpsman": "corpsperson",
  "corpsmen": "corpspersons",
  "councilman": "councilperson",
  "councilmen": "councilpersons",
  "counterman": "counterperson",
  "countermen": "counterpersons",
  "countryman": "countryperson",
  "countrymen": "countrypersons",
  "cowman": "cowperson",
  "cowmen": "cowpersons",
  "cracksman": "cracksperson",
  "cracksmen": "crackspersons",
  "craftsman": "craftsperson",
  "craftsmen": "craftspersons",
  "cragsman": "cragsperson",
  "cragsmen": "cragspersons",
  "crewman": "crewperson",
  "crewmen": "crewpersons",
  "crossbowman": "crossbowperson",
  "crossbowmen": "crossbowpersons",
  "dairyman": "dairyperson",
  "dairymen": "dairypersons",
  "dalesmen": "dalespersons",
  "damen": "dapersons",
  "daysman": "daysperson",
  "daysmen": "dayspersons",
  "deathsman": "deathsperson",
  "deathsmen": "deathspersons",
  "decumen": "decupersons",
  "everyman": "everyperson",
  "everymen": "everypersons",
  "exciseman": "exciseperson",
  "excisemen": "excisepersons",
  "expressman": "expressperson",
  "expressmen": "expresspersons",
  "firmen": "firpersons",
  "fisherman": "fisherperson",
  "fishermen": "fisherpersons",
  "footman": "footperson",
  "footmen": "footpersons",
  "frontman": "frontperson",
  "frontmen": "frontpersons",
  "funnyman": "funnyperson",
  "funnymen": "funnypersons",
  "guardsman": "guardsperson",
  "guardsmen": "guardspersons",
  "highwayman": "highwayperson",
  "highwaymen": "highwaypersons",
  "horseman": "horseperson",
  "horsemen": "horsepersons",
  "hotelman": "hotelperson",
  "hotelmen": "hotelpersons",
  "houseman": "houseperson",
  "housemen": "housepersons",
  "iceman": "iceperson",
  "icemen": "icepersons",
  "jazzman": "jazzperson",
  "jazzmen": "jazzpersons",
  "journeyman": "journeyperson",
  "journeymen": "journeypersons",
  "kinsman": "kinsperson",
  "kinsmen": "kinspersons",
  "landman": "landperson",
  "landmen": "landpersons",
  "lobsterman": "lobsterperson",
  "lobstermen": "lobsterpersons",
  "madman": "madperson",
  "madmen": "madpersons",
  "mailman": "mailperson",
  "mailmen": "mailpersons",
  "marksman": "marksperson",
  "marksmen": "markspersons",
  "meatman": "meatperson",
  "meatmen": "meatpersons",
  "merchantman": "merchantperson",
  "merchantmen": "merchantpersons",
  "merman": "merperson",
  "mermen": "merpersons",
  "messman": "messperson",
  "messmen": "messpersons",
  "middleman": "middleperson",
  "middlemen": "middlepersons",
  "midshipman": "midshipperson",
  "midshipmen": "midshippersons",
  "militiaman": "militiaperson",
  "militiamen": "militiapersons",
  "milkman": "milkperson",
  "milkmen": "milkpersons",
  "minuteman": "minuteperson",
  "minutemen": "minutepersons",
  "missileman": "missileperson",
  "missilemen": "missilepersons",
  "moneyman": "moneyperson",
  "moneymen": "moneypersons",
  "motorman": "motorperson",
  "motormen": "motorpersons",
  "newsman": "newsperson",
  "newsmen": "newspersons",
  "newspaperman": "newspaperperson",
  "newspapermen": "newspaperpersons",
  "nobleman": "nobleperson",
  "noblemen": "noblepersons",
  "nonman": "nonperson",
  "nonmen": "nonpersons",
  "ottomen": "ottopersons",
  "outdoorsman": "outdoorsperson",
  "outdoorsmen": "outdoorspersons",
  "overman": "overperson",
  "pivotman": "pivotperson",
  "placeman": "placeperson",
  "plainclothesman": "plainclothesperson",
  "plainsman": "plainsperson",
  "plantsman": "plantsperson",
  "plowman": "plowperson",
  "pointman": "pointperson",
  "postman": "postperson",
  "potman": "potperson",
  "poultryman": "poultryperson",
  "prefreshman": "prefreshperson",
  "quarryman": "quarryperson",
  "radioman": "radioperson",
  "raftsman": "raftsperson",
  "ragman": "ragperson",
  "ranchman": "ranchperson",
  "reinsman": "reinsperson",
  "repairman": "repairperson",
  "rifleman": "rifleperson",
  "rodsman": "rodsperson",
  "roundsman": "roundsperson",
  "routeman": "routeperson",
  "safetyman": "safetyperson",
  "sagaman": "sagaperson",
  "salaryman": "salaryperson",
  "salesman": "salesperson",
  "sandman": "sandperson",
  "schoolman": "schoolperson",
  "seaman": "seaperson",
  "seedsman": "seedsperson",
  "selectman": "selectperson",
  "shopman": "shopperson",
  "showman": "showperson",
  "sideman": "sideperson",
  "signalman": "signalperson",
  "skyman": "skyperson",
  "snowman": "snowperson",
  "spaceman": "spaceperson",
  "spokesman": "spokesperson",
  "sportfisherman": "sportfisherperson",
  "sportsman": "sportsperson",
  "statesman": "statesperson",
  "stickman": "stickperson",
  "stillman": "stillperson",
  "stockman": "stockperson",
  "outmen": "outpersons",
  "overmen": "overpersons",
  "pivotmen": "pivotpersons",
  "placemen": "placepersons",
  "plainclothesmen": "plainclothespersons",
  "plainsmen": "plainspersons",
  "plantsmen": "plantspersons",
  "plowmen": "plowpersons",
  "pointmen": "pointpersons",
  "policemen": "policepersons",
  "postmen": "postpersons",
  "potmen": "potpersons",
  "poultrymen": "poultrypersons",
  "prefreshmen": " prefreshpersons",
  "pullmen": "pullpersons",
  "quarrymen": "quarrypersons",
  "radiomen": "radiopersons",
  "raftsenn": "raftspersons",
  "ragmen": "ragpersons",
  "ranchmen": "ranchpersons",
  "reedmen": "reedpersons",
  "reinsmen": "reinspersons",
  "remen": "repersons",
  "repairmen": "repairpersons",
  "riflemen": "riflepersons",
  "rodmen": "rodpersons",
  "rodsmen": "rodspersons",
  "romen": "ropersons",
  "roundsmen": "roundspersons",
  "routemen": "routepersons",
  "safetymen": "safetypersons",
  "sagamen": "sagapersons",
  "salarymen": "salarypersons",
  "salesmen": "salespersons",
  "sandmen": "sandpersons",
  "schoolmen": "schoolpersons",
  "seamen": "seapersons",
  "seedsmen": "seedspersons",
  "selectmen": "selectpersons",
  "shipmen": "shippersons",
  "shopmen": "shoppersons",
  "showmen": "showpersons",
  "sidemen": "sidepersons",
  "signalmen": "signalpersons",
  "skymen": "skypersons",
  "snowmen": "snowpersons",
  "sockmen": "sockpersons",
  "soundmen": "soundman",
  "spacemen": "spaceman",
  "spokesmen": "spokesman",
  "sportfishermen": "sportfisherman",
  "sportsmen": "sportsman",
  "statesmen": "statesman",
  "stickmen": "stickman",
  "stockmen": "stockman",
  "strongman": "strongwoman",
  "superman": "superperson",
  "supermen": "superpersons",
  "supersalesman": "supersalesperson",
  "supersalesmen": "supersalespersons",
  "vanman": "vanperson",
  "vanmen": "vanpersons",
  "venireman": "venireperson",
  "veniremen": "venirepersons",
  "workingman": "workingperson",
  "workingmen": "workingpersons",
  "workman": "workperson",
  "workmen": "workpersons",
  "yachtman": "yachtperson",
  "yachtmen": "yachtpersons",
  "yachtsman": "yachtsperson",
  "yachtsmen": "yachtspersons",
  "yardman": "yardperson",
  "yardmen": "yardpersons "
   
};


