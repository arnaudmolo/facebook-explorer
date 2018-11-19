/**
 *
 * UsersPage
 *
 */

import React, { useState } from 'react';
import Users from 'containers/Users';
import fuzzyFilterFactory from 'react-fuzzy-filter';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap';

import User from './User';
import messages from './messages';

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

const UsersPage = props => {
  const [user, setUser] = useState({});
  const [checkedStatus, setCheckedStatus] = useState(
    friendshipStatus.filter(e => e === 'friend' || e === 'own'),
  );
  const selected = user.id && props.users.find(_user => _user.id === user.id);
  const onChange = event => {
    setCheckedStatus(
      event.target.checked
        ? [...checkedStatus, event.target.value]
        : checkedStatus.filter(status => status !== event.target.value),
    );
  };
  const selectUser = u => () => {
    props.requestUser(u.id);
    setUser(u);
  };
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
                    onChange={onChange}
                    checked={checkedStatus.includes(status)}
                  />{' '}
                  <p>
                    <FormattedMessage {...messages[status]} />
                  </p>
                </Label>
              ))}
            </FormGroup>
          </Form>
          {props.users.length && (
            <div className="container">
              <InputFilter
                debounceTime={200}
                inputProps={{
                  className: 'form-control',
                  placeholder: 'Type a name',
                }}
              />
              <FilterResults
                items={props.users.filter(_user =>
                  _user.relations.some(relation =>
                    checkedStatus.includes(relation.friendship),
                  ),
                )}
                fuseConfig={fuseConfig}
              >
                {filteredItems => (
                  <div>
                    {filteredItems.map(item => (
                      <div key={item.name}>
                        <button onClick={selectUser(item)}>
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
        <Col>{user.id && <User user={selected} />}</Col>
      </Row>
    </Container>
  );
};

UsersPage.propTypes = {
  users: PropTypes.array,
  requestUser: PropTypes.func,
};

export default Users(UsersPage);
