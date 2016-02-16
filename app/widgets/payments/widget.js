import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PaymentList from '../../src/components/PaymentList'

class Widget extends Component {
  render() {
    const { data, status, isFetching } = this.props;
    return (
      <div>
        <h2>Payments</h2>
        {isFetching &&
          React.createElement('div', {className: 'loading large'},
            status,
            ' ',
            React.createElement('img', {src: '/images/ajax-loader.gif'}))
        }
        {!isFetching &&
        <PaymentList>{data}</PaymentList>
        }
      </div>
    )
  }
}

Widget.propTypes = {
  isFetching: PropTypes.bool,
  status: PropTypes.string,
  data: PropTypes.array
};

function mapStateToProps(state, ownProps) {
  const {
    isFetching,
    status,
    data,
    } = state.dataByService[ownProps.id] || {
    isFetching: true,
    status: 'Loading',
    data: []
  };

  return {
    isFetching,
    status,
    data
  }
}

export default connect(mapStateToProps)(Widget)