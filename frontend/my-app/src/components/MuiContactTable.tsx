import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer
} from "@mui/x-data-grid";
import {
  randomId
} from "@mui/x-data-grid-generator";
import * as React from "react";
import { useEffect } from "react";
import api from "../services/api";
import { Contact } from "../types/appTypes";

//const roles = ["Manager", "Worker", "Junior"];
//const department = ["Market", "Finance", "Development"];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface GridRowContact extends Contact {
  isNew?: boolean; // Optional property for managing row state in UI
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    // Create a new row with temporary values
    const newRow: GridRowContact = {
      id: randomId(), // Temporary ID for local state
      name: "",
      email: "",
      phone: "",
      department: "",
      role: "", // Default value or handle based on your needs
      isNew: true,
    };

    // Add the new row to the DataGrid
    setRows((oldRows) => [newRow, ...oldRows]);

    // Set the row mode to 'edit' for the new row
    setRowModesModel((oldModel) => ({
      [newRow.id]: { mode: GridRowModes.Edit },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add contact
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState<GridRowContact[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts`, {});
      const contacts = response.data.contacts.map((contact: any) => ({
        id: contact._id, // Use _id as id
        ...contact,
      }));
      setRows(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // const handleRowEditStop: GridEventListener<"rowEditStop"> = (
  //   params,
  //   event
  // ) => {
  //   if (params.reason === GridRowEditStopReasons.rowFocusOut) {
  //     event.defaultMuiPrevented = true;
  //   }
  // };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

const [loading, setLoading] = React.useState(false);

  const handleDeleteClick = (id: GridRowId) => async () => {
    setLoading(true);
    try {
      await api.delete(`/contacts/${id}`); // Correct API route with contact ID
      setRows(rows.filter((row) => row.id !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Could not delete contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowContact) => {
    try {
      if (newRow.isNew) {
        // Call API to create a new contact
        const response = await api.post(`/contacts`, {
          name: newRow.name,
          email: newRow.email,
          phone: newRow.phone,
          role: newRow.role,
          department: newRow.department,
        });

        // Extract the server-generated ID from the response
        const serverGeneratedId = response.data._id;

        // Update the row with the server-generated ID
        const updatedRow = { ...newRow, id: serverGeneratedId, isNew: false };

        // Update state
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      } else {
        // Call API to update an existing contact
        console.log("going to send put request");
        const response = await api.put(`/contacts/${newRow.id}`, {
          name: newRow.name,
          email: newRow.email,
          phone: newRow.phone,
          role: newRow.role,
          department: newRow.department,
        });

        // Update state
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      return newRow; // Return the row with errors to keep it in edit mode
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 180,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Manager", "Worker", "Junior"],
    },
    {
      field: "department",
      headerName: "Department",
      width: 220,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Market", "Finance", "Development"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        checkboxSelection
        editMode="row"
      />
    </Box>
  );
}
