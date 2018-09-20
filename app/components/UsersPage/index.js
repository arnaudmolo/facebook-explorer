/**
 *
 * UsersPage
 *
 */

import React from 'react';
import Users from 'containers/Users';
import fuzzyFilterFactory from 'react-fuzzy-filter';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3';

import { Container, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap';
import User from './User';

const { InputFilter, FilterResults } = fuzzyFilterFactory();

const friendshipStatus = [
  'own',
  'friend',
  'received',
  'rejected',
  'removed',
  'sent',
  'unknow',
];

const scale = scaleOrdinal(['😀', '😘', '🖐', '🙃', '😡', '😢', '🤔']).domain(
  friendshipStatus,
);

const fuseConfig = {
  keys: ['name'],
};

class UsersPage extends React.PureComponent {
  static propTypes = {
    users: PropTypes.array,
    requestUser: PropTypes.func,
  };

  state = {
    checkedStatus: friendshipStatus.filter(e => e === 'friend' || e === 'own'),
    user: {},
  };

  onChange = event => {
    if (!event.target.checked) {
      return this.setState({
        checkedStatus: this.state.checkedStatus.filter(
          status => status !== event.target.value,
        ),
      });
    }
    return this.setState({
      checkedStatus: [...this.state.checkedStatus, event.target.value],
    });
  };

  selectUser = user => () => {
    this.props.requestUser(user.id);
    this.setState({ user });
  };

  render() {
    const selected =
      this.state.user.id &&
      this.props.users.find(user => user.id === this.state.user.id);
    return (
      <Container>
        <Row>
          <Col>
            <Form>
              <FormGroup check>
                {friendshipStatus.map(status => (
                  <Label key={status} check>
                    <Input
                      type="checkbox"
                      value={status}
                      onChange={this.onChange}
                      checked={this.state.checkedStatus.includes(status)}
                    />{' '}
                    <p>{status}</p>
                  </Label>
                ))}
              </FormGroup>
            </Form>
            {this.props.users.length && (
              <div className="container">
                <InputFilter
                  debounceTime={200}
                  inputProps={{
                    className: 'form-control',
                    placeholder: 'Type a name',
                  }}
                />
                <FilterResults
                  items={this.props.users.filter(user =>
                    user.relations.some(relation =>
                      this.state.checkedStatus.includes(relation.friendship),
                    ),
                  )}
                  fuseConfig={fuseConfig}
                >
                  {filteredItems => (
                    <div>
                      {filteredItems.map(item => (
                        <div key={item.name}>
                          <button onClick={this.selectUser(item)}>
                            {item.name} {scale(item.relation)}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FilterResults>
              </div>
            )}
          </Col>
          <Col>{this.state.user.id && <User user={selected} />}</Col>
        </Row>
      </Container>
    );
  }
}

export default Users(UsersPage);
