import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import api from "../services/api";

const COLORS = {
  "Not Sent": "#0088FE", // Blue
  Sent: "#4CAF50", // Green
  Clicked: "#FF5252", // Red
} as const; // Using 'as const' to make the keys readonly

interface EmailStatusData {
  notSent: number;
  sent: number;
  clicked: number;
}

interface Contact {
  _id: string;
  name: string;
  emailStatus: string;
  role: string;
  department: string;
}

const Statistics: React.FC = () => {
  const [data, setData] = useState<EmailStatusData | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const response = await api.get("/statistics");
        const fetchedContacts = response.data.contacts;
        setContacts(fetchedContacts);
        setFilteredContacts(fetchedContacts);
        countEmailStatuses(fetchedContacts);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchStatisticsData();
  }, []);

  const countEmailStatuses = (contacts: Contact[]) => {
    const statusCounts = {
      notSent: 0,
      sent: 0,
      clicked: 0,
    };

    contacts.forEach((contact) => {
      if (contact.emailStatus === "Not Sent") {
        statusCounts.notSent++;
      } else if (contact.emailStatus === "Sent") {
        statusCounts.sent++;
      } else if (contact.emailStatus === "Clicked") {
        statusCounts.clicked++;
      }
    });

    setData(statusCounts);
  };

  const roles = Array.from(new Set(contacts.map((c) => c.role))).filter(
    (role) => role
  ) || ["All"];
  const departments = Array.from(
    new Set(contacts.map((c) => c.department))
  ).filter((department) => department) || ["All"];

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const role = event.target.value as string;
    setSelectedRole(role);
    filterContacts(role, selectedDepartment);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const department = event.target.value as string;
    setSelectedDepartment(department);
    filterContacts(selectedRole, department);
  };

  const filterContacts = (role: string, department: string) => {
    const filtered = contacts.filter((contact) => {
      const matchesRole = role ? contact.role === role : true;
      const matchesDepartment = department
        ? contact.department === department
        : true;
      return matchesRole && matchesDepartment;
    });
    setFilteredContacts(filtered);
    countEmailStatuses(filtered);
  };

  if (!data) {
    return <Typography>There is no data yet...</Typography>;
  }

  const chartData = [
    { name: "Not Sent", value: data.notSent },
    { name: "Sent", value: data.sent },
    { name: "Clicked", value: data.clicked },
  ].filter((entry) => entry.value > 0);

  const totalEmails = data.notSent + data.sent + data.clicked;
  const clickedPercentage =
    totalEmails > 0 ? ((data.clicked / totalEmails) * 100).toFixed(2) : 0;

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Phishing Simulation Statistics
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary">
          {clickedPercentage}% of your contacts clicked the suspicious link.
        </Typography>

        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select value={selectedRole} onChange={handleRoleChange} label="Role">
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                label={({ value }: { value: number }) => `${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />{" "}
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Statistics;
