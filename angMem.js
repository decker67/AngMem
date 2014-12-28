
(function(angular, _){

  var NUMBER_OF_CARD_PAIRS = 3;

  function createCards(numberOfCardPairs) {
    var cards = [];
    for(var i = 0; i < numberOfCardPairs; i++) {
      cards.push({ covered: false, paired: false, value: i });
      cards.push({ covered: false, paired: false, value: i });
    }
    return cards;
  }

  function cardAlreadyPaired(cards, index) {
    return cards[index].paired;
  }

  function coverCards(cards, uncoveredCards) {
    var keys = _.keys(uncoveredCards);
    cards[keys[0]].covered = false;
    cards[keys[1]].covered = false;
  }

  function flipCard(cards, indexOfCard) {
    return cards[indexOfCard].covered = !cards[indexOfCard].covered;
  }

  function pairUncoveredCards(cards, uncoveredCards) {
    var keys = _.keys(uncoveredCards);
    cards[keys[0]].paired = true;
    cards[keys[1]].paired = true;
  }

  function uncoveredCardsIdentical(cards, uncoveredCards) {
    var keys = _.keys(uncoveredCards);
    return cards[keys[0]].value === cards[keys[1]].value;
  }

  angular.module('AngMemApp', [])
    .controller('AngMemController', ['$scope', function($scope) {

      var numberOfPairs = 0;
      var uncoveredCards = {};

      $scope.done = false;
      $scope.numberOfSteps = 0;
      $scope.cards = _.shuffle(createCards(NUMBER_OF_CARD_PAIRS));

      $scope.cardClicked = function(event) {
        event.preventDefault();
        event.stopPropagation();

        $scope.numberOfSteps++;

        var indexOfCard  = parseInt(event.target.id);

        if (cardAlreadyPaired($scope.cards, indexOfCard)) {
          return;
        }

        if(_.size(uncoveredCards) === 2) {
          coverCards($scope.cards, uncoveredCards);
          uncoveredCards = {};
        }

        if (_.size(uncoveredCards) < 2) {
          var cardUncovered = flipCard($scope.cards, indexOfCard);
          if (cardUncovered === true) {
            uncoveredCards[indexOfCard] = true;
            numberOfUncoveredCards++;
          } else {
            delete uncoveredCards[indexOfCard];
          }
        }

        if (_.size(uncoveredCards) === 2 && uncoveredCardsIdentical($scope.cards, uncoveredCards)) {
          pairUncoveredCards($scope.cards, uncoveredCards);
          numberOfPairs++;
          uncoveredCards = {};
          if (numberOfPairs === NUMBER_OF_CARD_PAIRS) {
            $scope.done = true;
          }
        }

      };

    }]);

})(angular, _);