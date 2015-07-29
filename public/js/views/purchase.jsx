import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { Connector } from 'react-redux';

import * as purchaseActions from 'actions/purchase';
import * as userActions from 'actions/user';

import DefaultCardDetails from 'views/card-details';
import DefaultCardListing from 'views/card-listing';
import DefaultCompletePayment from 'views/complete-payment';
import DefaultBraintreeToken from 'views/braintree-token';


export default class Purchase extends Component {

  static propTypes = {
    BraintreeToken: PropTypes.func.isRequired,
    CardDetails: PropTypes.func.isRequired,
    CardListing: PropTypes.func.isRequired,
    CompletePayment: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
    CardDetails: DefaultCardDetails,
    CardListing: DefaultCardListing,
    CompletePayment: DefaultCompletePayment,
    BraintreeToken: DefaultBraintreeToken,
  }

  selectData(state) {
    return {
      purchase: state.purchase,
      user: state.user,
    };
  }

  render () {
    var props = this.props;
    var BraintreeToken = props.BraintreeToken;
    var CompletePayment = props.CompletePayment;
    var CardListing = props.CardListing;
    var CardDetails = props.CardDetails;
    return (
      <Connector select={this.selectData}>
        {function(result) {
          if (result.purchase.completed) {
            return (
              <CompletePayment
                productId={props.productId}
                userEmail={props.user.email} />
            );
          } else if (result.purchase.payment_methods.length > 0) {
            console.log('rendering card listing');
            return (
              <CardListing
                productId={props.productId}
                paymentMethods={result.purchase.payment_methods}
                {...bindActionCreators(purchaseActions, result.dispatch)}
              />
            );
          } else if (!result.user.braintreeToken) {
            console.log('Retreiving Braintree Token');
            return (
              <BraintreeToken
                {...bindActionCreators(userActions, result.dispatch) }
              />
            );
          } else {
            console.log('rendering card entry');
            return (
              <CardDetails
                braintreeToken={result.user.braintreeToken}
                productId={props.productId}
              />
            );
          }
       }}
      </Connector>
    );
  }
}
