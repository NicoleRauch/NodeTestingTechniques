'use strict';

var Resource = require('nconf').get('beans').get('resource');

function RenderingInformation(url, displayText) {
  this.url = url;
  this.displayText = displayText;
  return this;
}

RenderingInformation.prototype.representsButton = function () {
  return !!this.url;
};

RenderingInformation.prototype.isWithdrawal = function () {
  return this.representsButton() && (this.url.indexOf('un') === 0 || this.url.indexOf('remove') === 0);
};

module.exports.htmlRepresentationOf = function (activity, resourceName, memberId) {
  var resource = activity.resourceNamed(resourceName);
  var url = encodeURIComponent(activity.url()) + '/' + encodeURIComponent(resourceName);
  var state = resource.registrationStateFor(memberId);
  var isSingle = activity.resourceNames().length === 1;
  if (state === Resource.registered) {
    return new RenderingInformation('unsubscribe/' + url, isSingle ? 'I cannot participate…' : 'Unsubscribe');
  }
  if (state === Resource.registrationPossible) {
    return new RenderingInformation('subscribe/' + url, isSingle ? 'I\'m in!' : 'Subscribe');
  }
  if (state === Resource.registrationElsewhere) {
    return new RenderingInformation(null, 'Subscription is not possible via Softwerkskammer.');
  }
  if (state === Resource.registrationClosed) {
    return new RenderingInformation(null, 'Subscription is currently not allowed.');
  }
  if (state === Resource.fixed) {
    return new RenderingInformation(null, 'Subscribed');
  }
  return new RenderingInformation(null, 'All spots are taken.', true);
};
