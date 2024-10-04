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
  GridPreProcessEditCellProps,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Contact } from "../types/appTypes";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface GridRowContact extends Contact {
  isNew?: boolean;
}

interface FullFeaturedCrudGridProps {
  setSelectedContacts: (contacts: Contact[]) => void;
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
      role: "",
      emailStatus: "Not sent",
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

export default function FullFeaturedCrudGrid({
  setSelectedContacts,
}: FullFeaturedCrudGridProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = React.useState<GridRowContact[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts`, {});
      const contacts = response.data.contacts.map((contact: any) => ({
        id: contact._id, // Use _id as id
        emailStatus: contact.emailStatus || "Not sent", // Default to 'Not sent' if emailStatus is not set
        ...contact,
      }));
      setRows(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();

    // Set interval to fetch contacts every 180 seconds (180000 ms) , 3 minutes.
    const intervalId = setInterval(fetchContacts, 180000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);

  }, []);

  const navigate = useNavigate(); // Use navigate to redirect

  const handleEditClick = (id: GridRowId) => async () => {
    if (loading) return; // Prevent edit click during loading
    setLoading(true); // Set loading state to true
    try {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    } catch (error) {
      console.error("Error starting edit:", error);
      alert("Could not edit contact. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    if (loading) return; // Prevent save click during loading
    setLoading(true); // Set loading state to true
    try {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View },
      });
      // Save logic here if needed (already handled in processRowUpdate)
    } catch (error) {
      console.error("Error saving:", error);
      alert("Could not save contact. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    if (loading) return; // Prevent save click during loading

    setLoading(true);
    try {
      await api.delete(`/contacts/${id}`); // Correct API route with contact ID
      setRows(rows.filter((row) => row.id !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Could not delete contact. Please try again.");
      navigate("/main");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick =
    (id: GridRowId, row: GridRowContact | undefined) => () => {
      if (loading) return; // Prevent cancel click during loading
      setLoading(true);
      if (row?.name === "") {
        // only time that happen is when we cancelling edditing of new contact. then we want to delete the new contact line.
        setRows(rows.filter((row) => row.id !== id));
      }
      try {
        // Set the row mode back to view
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
      } catch (error) {
        console.error("Error during cancel operation:", error);
        alert("An error occurred while canceling. Please try again.");
        navigate("/main");
      } finally {
        setLoading(false);
      }
    };

  const processRowUpdate = async (
    newRow: GridRowContact,
    oldRow: GridRowContact
  ) => {
    if (loading) return oldRow; // Return the previous row to prevent type mismatch
    setLoading(true); // Start loading when updating the row
    try {
      if (newRow.isNew) {
        // Call API to create a new contact

        const newContactName = newRow.name === "" ? "New contact" : newRow.name;
        if (newContactName === "New contact") {
          alert(
            "You must provide contact name, default name is set to 'New contact'."
          );
        }
        const response = await api.post(`/contacts`, {
          name: newContactName,
          email: newRow.email,
          phone: newRow.phone,
          role: newRow.role,
          department: newRow.department,
          emailStatus: "Not sent", // Save default status to the DB
        });

        // Extract the server-generated ID from the response
        const serverGeneratedId = response.data._id;

        // Update the row with the server-generated ID
        const updatedRow = {
          ...newRow,
          name: newContactName,
          id: serverGeneratedId,
          emailStatus: "Not sent", // Now show the email status as Not sent
          isNew: false,
        };

        // Update state
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      } else {
        if (newRow.name === "") {
          alert("please add contact name. changes unsaved. ");
          return oldRow;
        }
        // Call API to update an existing contact
        await api.put(`/contacts/${newRow.id}`, {
          name: newRow.name,
          email: newRow.email,
          phone: newRow.phone,
          role: newRow.role,
          department: newRow.department,
          emailStatus: newRow.emailStatus,
        });

        // Update state
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      return newRow; // Keep in edit mode on failure
    } finally {
      setLoading(false); // End loading after completion
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    // Find the selected contacts based on their IDs
    const selectedContacts = rows.filter((row) =>
      newSelection.includes(row.id)
    );
    setSelectedContacts(selectedContacts);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 165,
      editable: true,
      align: "center",
      headerAlign: "center",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === "";
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      width: 210,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      width: 165,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 165,
      editable: true,
      type: "singleSelect",
      align: "center",
      headerAlign: "center",
      valueOptions: ["Manager", "Mid-Worker", "Junior", "Senior"],
    },
    {
      field: "department",
      headerName: "Department",
      width: 165,
      editable: true,
      type: "singleSelect",
      align: "center",
      headerAlign: "center",
      valueOptions: ["Marketing", "Finance", "R&D", "HR"],
    },
    {
      field: "emailStatus",
      headerName: "Email status",
      width: 165,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let color = "blue"; // Default color
        if (params.value === "Sent") color = "green";
        if (params.value === "Clicked") color = "red";

        return <span style={{ color }}>{params.value}</span>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      align: "center",
      headerAlign: "center",
      getActions: ({ id }) => {
        const row: GridRowContact | undefined = rows.find(
          (row) => row.id === id
        );
        if (!row) {
          return [];
        }

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              disabled={loading} // Disable Save during loading
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              disabled={loading} // Disable Cancel during loading
              onClick={handleCancelClick(id, row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            disabled={loading} // Disable Edit during loading
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            disabled={loading} // Disable Delete during loading
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
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        checkboxSelection
        editMode="row"
        onRowSelectionModelChange={(newRowSelectionModel) => {
          handleSelectionChange(newRowSelectionModel);
        }}
      />
    </Box>
  );
}
