import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'ramda';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
`;

// If two samples have the same value, an error will occur:
const makeKey = key => `${key}-${Math.random()}`;

const Samples = ({ samples }) => (
  <List>
    {map(sample => <li key={makeKey(sample)}>{sample}</li>, samples)}
  </List>);
Samples.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.string).isRequired,
};
Samples.displayName = 'Samples';

export default Samples;
