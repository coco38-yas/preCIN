import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import provincesData from "./templates/provincesData"; //  Importation correcte des données
import { ClientSideRowModelModule } from "ag-grid-community";




const ExpandableTable = () => {
  const [gridApi, setGridApi] = useState(null);

  // Définition des colonnes
  const columnDefs = useMemo(() => [
    { field: "province", headerName: "Province", sortable: true, filter: true },
    { field: "region", headerName: "Région", sortable: true, filter: true },
    { field: "district", headerName: "District", sortable: true, filter: true },
  ], []);

  // Transformation des données pour le tableau AG Grid
  const rowData = useMemo(() => {
    return provincesData.flatMap((province) =>
      province.regions.flatMap((region) =>
        region.districts.map((district) => ({
          province: province.province,
          region: region.region,
          district: district,
        }))
      )
    );
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        modules={[ClientSideRowModelModule]}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1 }}
        groupDisplayType="groupRows"
        animateRows={true}
        rowGroupPanelShow="always"
        enableSorting={true}
        enableFilter={true}
        onGridReady={(params) => setGridApi(params.api)}
      />
    </div>
  );
};

export default ExpandableTable;
