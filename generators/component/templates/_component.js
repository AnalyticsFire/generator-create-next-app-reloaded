import React from 'react';
import { func } from 'prop-types';
import { withI18next } from '@root/lib/withI18next';

export const <%= component %> = ({ t }) => (
  <div className="<%= className %>">
    { /* Here it goes the new component */ }
  </div>
);

<%= component %>.propTypes = {
  t: func,
};

export default withI18next(['common', '<%= i18n %>'])(<%= component %>);
