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
// import styled from 'styled-components';
import { Container, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap';

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

  getInfos = user => () => {
    this.props.requestUser(user.id);
  };

  render() {
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
                <InputFilter debounceTime={200} />
                <FilterResults
                  items={this.props.users.filter(user =>
                    this.state.checkedStatus.includes(user.friendship),
                  )}
                  fuseConfig={fuseConfig}
                >
                  {filteredItems => (
                    <div>
                      {filteredItems.map(item => (
                        <div key={item.id}>
                          <button onClick={this.getInfos(item)}>
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
        </Row>
      </Container>
    );
  }
}

export default Users(UsersPage);
