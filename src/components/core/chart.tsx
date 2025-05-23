import React, { Suspense } from 'react';
import { styled } from '@mui/material/styles';

// Dynamically import the ApexChart component
const ApexChart = React.lazy(() => import('react-apexcharts'));

// Styled component using MUI's styled API
export const Chart = styled((props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <ApexChart {...props} />
  </Suspense>
))``;
