class cranberryQuote {
  beforeRegister() {
    this.is = 'cranberry-quote';
    this.properties = {
      quote: {
        type: Object,
        observer: 'quoteChanged'
      }
    };
    // Function to return the encoded URL Twitter text component for Twitter Link
    this.returnEncodedQuote = function(quote) {
      // Max length = 140 - 16 (' via @StandardEx') - 3 ('...')
      let maxLength = 121;
      // Trim text to specified length including '... via @StandardEx'
      let twitterText = quote.text.substr(0, maxLength);
      // Re-trim the string if a word was cut off
      twitterText = twitterText.substr(0, Math.min(twitterText.length, twitterText.lastIndexOf(" ")));
      // Add the elipsis
      twitterText += '...';
      // Return the string
      return encodeURI(twitterText);
    }
    // Function to return the current window loaction href
    this.returnWindowLocation = function() {
      return window.location.href;
    }
  }

  quoteChanged() {
    // Add textContent for the quote text
    this.$.quote.textContent = this.quote.text;
    // Add textContent for the credit text
    this.$.credit.textContent = '-- ' + this.quote.credit;

    // Switch on the float direction
    // Case 0 ::: do nothing
    // Case 1 & 2 ::: add class for left or right to the wrapper div
    switch(this.quote.direction) {
      case '0':
        break;
      case '1':
        this.$.wrapper.className += ' ut-float-left';
        break;
      case '2':
        this.$.wrapper.className += ' ut-float-right';
        break;
    }
  }
}
Polymer(cranberryQuote);
