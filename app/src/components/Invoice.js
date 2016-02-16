import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import {FormattedNumber, FormattedDate} from 'react-intl';
import classNames from 'classnames/bind';

class Invoice extends Component {
  render() {
    let a = this.props.attributes;
    let statusClass = classNames({
      'status': true,
      'status--green': a.status == 'Paid',
      'status--yellow': a.status != 'Paid' && !pastDue(a.due),
      'status--red': a.status != 'Paid' && pastDue(a.due)
    });
    return (
      <tr>
        <td>{a.id}</td>
        <td>
          <FormattedNumber value={a.amount} style="currency" currency="USD" />
        </td>
        <td>
          <FormattedDate
            value={a.date}
            day="numeric"
            month="long"
            year="numeric" />
        </td>
        <td>
          <FormattedDate
            value={a.due}
            day="numeric"
            month="long"
            year="numeric" />
        </td>
        <td className={statusClass}>{a.status}</td>
      </tr>
    );

    function pastDue(date) {
      let y, m, d;
      [y, m, d] = date.split('-');
      let dueDate = new Date(y, m - 1, d);
      return dueDate < Date.now()
    }
  }
}

Invoice.propTypes = {
  id: PropTypes.string,
  attributes: PropTypes.shape({
    id: PropTypes.string,
    amount: PropTypes.number,
    date: PropTypes.string,
    due: PropTypes.string,
    status: PropTypes.string
  })
};

const mapStateToProps = (state, json) => {
  return {
    id: json.children.id,
    attributes: json.children.attributes
  }
};

export default connect(mapStateToProps)(Invoice)