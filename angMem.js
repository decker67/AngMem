
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

  function coverCards(cards, indexOfFirstCard, indexOfSecondCard) {
    cards[indexOfFirstCard].covered = false;
    cards[indexOfSecondCard].covered = false;
  }

  function flipCard(cards, indexOfCard) {
    return cards[indexOfCard].covered = !cards[indexOfCard].covered;
  }

  function pairUncoveredCards(cards, indexOfFirstCard, indexOfSecondCard) {
    cards[indexOfFirstCard].paired = true;
    cards[indexOfSecondCard].paired = true;
  }

  function uncoveredCardsIdentical(cards, indexOfFirstCard, indexOfSecondCard) {
    return cards[indexOfFirstCard].value === cards[indexOfSecondCard].value;
  }

  angular.module('AngMemApp', [])
    .controller('AngMemController', ['$scope', function($scope) {

      var numberOfPairs = 0;
      var numberOfUncoveredCards = 0;
      var firstUncoveredCardIndex;
      var secondUncoveredCardIndex;

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

        if(numberOfUncoveredCards === 2) {
          coverCards($scope.cards, firstUncoveredCardIndex, secondUncoveredCardIndex);
          numberOfUncoveredCards = 0;
          firstUncoveredCardIndex = undefined;
          secondUncoveredCardIndex = undefined;
        }

        if (numberOfUncoveredCards < 2) {
          var cardUncovered = flipCard($scope.cards, indexOfCard);
          if (cardUncovered === true) {
            secondUncoveredCardIndex = (firstUncoveredCardIndex !== undefined) ? indexOfCard : undefined;
            firstUncoveredCardIndex = (firstUncoveredCardIndex === undefined) ?  indexOfCard : firstUncoveredCardIndex;
            numberOfUncoveredCards++;
          } else {
            if(firstUncoveredCardIndex === indexOfCard) {
              firstUncoveredCardIndex = undefined;
            } else {
              secondUncoveredCardIndex = undefined;
            }
            numberOfUncoveredCards--;
          }
        }

        if (numberOfUncoveredCards === 2 && uncoveredCardsIdentical($scope.cards, firstUncoveredCardIndex, secondUncoveredCardIndex)) {
          pairUncoveredCards($scope.cards, firstUncoveredCardIndex, secondUncoveredCardIndex);
          numberOfPairs++;
          numberOfUncoveredCards = 0;
          firstUncoveredCardIndex = undefined;
          secondUncoveredCardIndex = undefined;
          if (numberOfPairs === NUMBER_OF_CARD_PAIRS) {
            $scope.done = true;
          }
        }

      };

    }]);

})(angular, _);