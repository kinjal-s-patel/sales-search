import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ISalesSearchProps } from './ISalesSearchProps';
import Dashboard from './dashboard';
import CsvSearchForm from './salesform';
import UsaSearch  from './usa-search';

const AppRouter: React.FC<ISalesSearchProps> = (props) => {
  // const navigate = useNavigate();

  return (
    <Routes>
      {/* Pass all props down correctly */}
      <Route path="/" element={<Dashboard {...props} />} />
      <Route path="/salesform" element={<CsvSearchForm {...props} />} />
            <Route path="/usa-search" element={<UsaSearch  {...props} />} />
    </Routes>
  );
};

export default AppRouter;
