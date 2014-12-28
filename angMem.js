
(function(angular, _){

  function MemoryGame(numberOfPairs) {
    this.numberOfPairs = numberOfPairs;
  }

  MemoryGame.prototype.initialize = function() {
    this.actualNumberOfPairs = 0;
    this.uncoveredCards = {};
    this.done = false;
    this.numberOfSteps = 0;

    this.cards = [];
    for(var i = 0; i < this.numberOfPairs; i++) {
      this.cards.push({ covered: false, paired: false, value: i });
      this.cards.push({ covered: false, paired: false, value: i });
    }
    this.cards = _.shuffle(this.cards);
  }

  MemoryGame.prototype.cardAlreadyPaired = function(index) {
    return this.cards[index].paired;
  }

  MemoryGame.prototype.coverCards = function() {
    var keys = _.keys(this.uncoveredCards);
    this.cards[keys[0]].covered = false;
    this.cards[keys[1]].covered = false;
  }

  MemoryGame.prototype.flipCard = function(indexOfCard) {
    return this.cards[indexOfCard].covered = !this.cards[indexOfCard].covered;
  }

  MemoryGame.prototype.pairUncoveredCards = function() {
    var keys = _.keys(this.uncoveredCards);
    this.cards[keys[0]].paired = true;
    this.cards[keys[1]].paired = true;
  }

  MemoryGame.prototype.uncoveredCardsIdentical = function() {
    var keys = _.keys(this.uncoveredCards);
    return this.cards[keys[0]].value === this.cards[keys[1]].value;
  }

  MemoryGame.prototype.handleCardSelection = function(indexOfCard) {
    this.numberOfSteps++;

    if (this.cardAlreadyPaired(indexOfCard)) {
      return;
    }

    if(_.size(this.uncoveredCards) === 2) {
      this.coverCards();
      this.uncoveredCards = {};
    }

    if (_.size(this.uncoveredCards) < 2) {
      var cardUncovered = this.flipCard(indexOfCard);
      if (cardUncovered === true) {
        this.uncoveredCards[indexOfCard] = true;
      } else {
        delete this.uncoveredCards[indexOfCard];
      }
    }

    if (_.size(this.uncoveredCards) === 2 && this.uncoveredCardsIdentical()) {
      this.pairUncoveredCards();
      this.actualNumberOfPairs++;
      this.uncoveredCards = {};
      if (this.actualNumberOfPairs === this.numberOfPairs) {
        this.done = true;
      }
    }
  }

  var NUMBER_OF_CARD_PAIRS = 3;

  angular.module('AngMemApp', [])
    .controller('AngMemController', ['$scope', function($scope) {

      function setScopeValues() {
        $scope.done = game.done;
        $scope.numberOfSteps = game.numberOfSteps;
        $scope.cards = game.cards;
      }

      var game = new MemoryGame(NUMBER_OF_CARD_PAIRS);
      game.initialize();
      setScopeValues();

      $scope.cardClicked = function(event) {
        event.preventDefault();
        event.stopPropagation();

        var indexOfCard  = parseInt(event.target.id);
        game.handleCardSelection(indexOfCard);
        setScopeValues();
      };

    }]);

})(angular, _);