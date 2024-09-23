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
  Button,
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
import "../styles/Statistics.css";

const COLORS = {
  "Not Sent": "#0088FE", // Blue
  "Sent And Not Clicked": "#4CAF50", // Green
  "Sent And Clicked": "#FF5252", // Red
} as const; // Using 'as const' to make the keys readonly

interface EmailStatusData {
  notSent: number;
  SentNotClicked: number;
  SentClicked: number;
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
  const [showOnlySentAndClicked, setShowOnlySentAndClicked] = useState(false); // Toggle state

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
      SentNotClicked: 0,
      SentClicked: 0,
    };

    contacts.forEach((contact) => {
      if (contact.emailStatus === "Not Sent") {
        statusCounts.notSent++;
      } else if (contact.emailStatus === "Sent") {
        statusCounts.SentNotClicked++;
      } else if (contact.emailStatus === "Clicked") {
        statusCounts.SentClicked++;
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

  const handleToggle = () => {
    setShowOnlySentAndClicked(!showOnlySentAndClicked);
  };

  if (!data) {
    return <Typography>There is no data yet...</Typography>;
  }

  // Determine which data to show based on the toggle
  const chartData = showOnlySentAndClicked
    ? [
        { name: "Sent And Not Clicked", value: data.SentNotClicked },
        { name: "Sent And Clicked", value: data.SentClicked },
      ]
    : [
        { name: "Not Sent", value: data.notSent },
        { name: "Sent And Not Clicked", value: data.SentNotClicked },
        { name: "Sent And Clicked", value: data.SentClicked },
      ];

  const totalSentEmails = data.SentNotClicked + data.SentClicked;
  const clickedPercentage =
    totalSentEmails > 0
      ? ((data.SentClicked / totalSentEmails) * 100).toFixed(2)
      : 0;

  return (
    <Card className="statistics-card">
      <CardContent>
        <Typography className="statistics-title">
          Phishing Simulation Statistics
        </Typography>
        <Typography variant="h6" className="statistics-percentage">
          {clickedPercentage}% of your contacts that received the suspicious
          link clicked on it.
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

        <Button
          variant="contained"
          onClick={handleToggle}
          sx={{ marginTop: "16px" }}
        >
          {showOnlySentAndClicked
            ? "Show All Statistics"
            : "Show Only Sent Links Statistics"}
        </Button>

        <Box className="statistics-chart-container">
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
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Statistics;
