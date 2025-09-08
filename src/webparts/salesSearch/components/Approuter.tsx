import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import CsvSearchForm from './salesform';

import { ISalesSearchProps } from './ISalesSearchProps';

const AppRouter: React.FC<ISalesSearchProps> = ({ context }) => {
  return (
    <Routes>
      <Route path="/" element={<CsvSearchForm context={context} />} />
    </Routes>
  );
};

export default AppRouter;
