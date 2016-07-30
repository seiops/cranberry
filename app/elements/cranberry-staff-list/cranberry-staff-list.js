class cranberryStaffList {
  beforeRegister() {
    this.is = 'cranberry-staff-list';
    this.properties = {
      items: {
        type: Object,
        value: []
      }
    };
  }

  _computeStaffImage(imageObject) {
    if (typeof imageObject.small !== 'undefined') {
      return 'http://www.standard.net/' + imageObject.small;
    } else {
      return 'http://imgsrc.me/200x113/9c9c9c/000000/Image Unavailable?showDimensions=0&font=arial';
    }
  }

  _handleResponse (data) {
    let restResponse = JSON.parse(data.detail.Result);

    this.set('items', restResponse);
  }

}
Polymer(cranberryStaffList);
