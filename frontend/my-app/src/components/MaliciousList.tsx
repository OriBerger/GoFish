import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
//import AddIcon from "@mui/icons-material/Add";
import { useMaliciousFormat } from "./MaliciousListHook";
import { MaliciousFormat } from "../types/appTypes";
import "../styles/MaliciousList.css"; // Import the CSS

type MaliciousListProps = {
  choosenFormatId: string | null;
  setChoosenFormatId: React.Dispatch<React.SetStateAction<string | null>>;
};

const MaliciousList: React.FC<MaliciousListProps> = ({
  choosenFormatId,
  setChoosenFormatId,
}) => {
  console.log("malicious list render");

  //const [choosenFormatId, setchoosenFormatId] = useState<string | null>(null);
  const [formatBeingEdit, setFormatBeingEdit] = useState<string | null>(null);
  const [maliciousFormatsEditingFields, setMaliciousFormatsEditingFields] =
    useState({
      sourceEmail: "",
      sourcePhone: "",
      message: "",
      subject: "",
    });
  const {
    maliciousFormats,
    handleEditApiCall,
    handleDeleteApiCall,
    handleCreateApiCall,
    loading,
  } = useMaliciousFormat();
  useEffect(() => {
    console.log("Malicious formats updated:", maliciousFormats);
  }, [maliciousFormats]);
  ///לא עובד!!
  const handleDelete = (id: string) => {
    handleDeleteApiCall(id);
  };

  const handleEditClick = (maliciousFormat: MaliciousFormat) => {
    setFormatBeingEdit(maliciousFormat.id);
    setMaliciousFormatsEditingFields({
      sourceEmail: maliciousFormat.sourceEmail,
      sourcePhone: maliciousFormat.sourcePhone,
      message: maliciousFormat.message,
      subject: maliciousFormat.subject,
    });
  };

  const handleEditSave = (id: string) => {
    if (maliciousFormatsEditingFields === undefined) {
      return;
    }

    handleEditApiCall(
      {
        sourceEmail: maliciousFormatsEditingFields.sourceEmail,
        sourcePhone: maliciousFormatsEditingFields.sourcePhone,
        message: maliciousFormatsEditingFields.message,
        subject: maliciousFormatsEditingFields.subject,
        id: id,
      },
      id
    );
    setFormatBeingEdit(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setMaliciousFormatsEditingFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  return (
    <div className="malicious-history-list">
      <h2>choose a format or create a new one</h2>
      <List>
        {maliciousFormats.map((maliciousFormat: MaliciousFormat) => (
          <ListItem key={maliciousFormat.id} disablePadding>
            <Accordion sx={{ flexGrow: 1, flex: 7 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={maliciousFormat.id === choosenFormatId}
                      onChange={() => setChoosenFormatId(maliciousFormat.id)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label=""
                  onClick={(event) => event.stopPropagation()}
                />
                {maliciousFormat.id === formatBeingEdit ? (
                  <>
                    <TextField
                      label="Malicious Link"
                      value={maliciousFormatsEditingFields.subject}
                      onChange={(e) =>
                        handleFieldChange("subject", e.target.value)
                      }
                      fullWidth
                      sx={{ verticalAlign: "middle" }}
                    />
                    <TextField
                      label="Source Email"
                      value={maliciousFormatsEditingFields.sourceEmail}
                      onChange={(e) =>
                        handleFieldChange("sourceEmail", e.target.value)
                      }
                      fullWidth
                      sx={{ verticalAlign: "middle" }}
                    />
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1">
                      email:{maliciousFormat.sourceEmail}
                    </Typography>
                    <Typography>link:{maliciousFormat.subject}</Typography>
                    <Typography>phone:{maliciousFormat.sourcePhone}</Typography>
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{maliciousFormat.message}</Typography>
              </AccordionDetails>
            </Accordion>
            <ListItemButton sx={{ flex: 1 }}>
              <Box>
                {maliciousFormat.id === formatBeingEdit ? (
                  <IconButton
                    disabled={loading}
                    onClick={() => handleEditSave(maliciousFormat.id)}
                  >
                    <CheckIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    disabled={loading}
                    onClick={() => handleEditClick(maliciousFormat)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  disabled={loading}
                  onClick={() => handleDelete(maliciousFormat.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
        {/* <ListItem>
            
        </ListItem> */}
      </List>
    </div>
  );
};

export default MaliciousList;
