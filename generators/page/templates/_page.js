import React from 'react';
import Layout from '@root/components/layout';
import { func } from 'prop-types';
import { withI18next } from '@root/lib/withI18next';

export const <%= component %> = ({ t }) => (
  <Layout title="asfasfa" className="<%= className %>">
    <div className="container pt-4 pb-4">
      <h1 className="title text-center pb-3">{t('<%= i18n %>:title')}</h1>
    </div>
  </Layout>
);

<%= component %>.propTypes = {
  t: func,
};

export default withI18next(['common', '<%= i18n %>'])(<%= component %>);
