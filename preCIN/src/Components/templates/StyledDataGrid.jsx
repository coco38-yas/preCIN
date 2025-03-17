import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    border: "none",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },
  '& .MuiDataGrid-columnHeaders': {
    background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
    borderBottom: 'none',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: 'rgba(23,235,23,0.5)',
  },
  '& .MuiDataGrid-footerContainer': {
    background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
    borderTop: 'none',
  },
  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: 'inherit',
  },
}));

export default StyledDataGrid;
