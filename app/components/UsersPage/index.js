/**
 *
 * UsersPage
 *
 */

import React, { useState } from 'react';
import fuzzyFilterFactory from 'react-fuzzy-filter';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap';
import './styles.css';

import User from './User';
import messages from './messages';

const { InputFilter, FilterResults } = fuzzyFilterFactory();

const friendshipStatus = [
  'friend',
  'received',
  'rejected',
  'removed',
  'sent',
  'unknow',
];

const scale = scaleOrdinal(['😀', '😘', '🖐', '🙃', '😡', '😢', '🤔']).domain([
  'own',
  ...friendshipStatus,
]);

const fuseConfig = {
  keys: ['name'],
};

const UsersPage = props => {
  const [user, setUser] = useState({});
  const [checkedStatus, setCheckedStatus] = useState(
    friendshipStatus.filter(e => e === 'friend' || e === 'own'),
  );
  const selected = user.id && props.users.find(_user => _user.id === user.id);
  const onChange = event =>
    setCheckedStatus(
      event.target.checked
        ? [...checkedStatus, event.target.value]
        : checkedStatus.filter(status => status !== event.target.value),
    );
  const selectUser = u => () => {
    props.requestUser(u.id);
    setUser(u);
  };
  return (
    <Container style={{ width: 550 }}>
      <Row>
        <Col>
          <Form>
            {friendshipStatus.map(status => (
              <FormGroup
                key={status}
                check
                inline
                className="users-page__form-group"
              >
                <Label check>
                  <Input
                    type="checkbox"
                    className="users-page__hidden-input"
                    value={status}
                    onChange={onChange}
                    checked={checkedStatus.includes(status)}
                  />
                  <FormattedMessage {...messages[status]} />
                </Label>
              </FormGroup>
            ))}
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {props.users.length && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </Col>
        {user.id && (
          <Col>
            <User user={selected} />
          </Col>
        )}
      </Row>
    </Container>
  );
};

UsersPage.propTypes = {
  users: PropTypes.array,
  requestUser: PropTypes.func,
};

export default UsersPage;
