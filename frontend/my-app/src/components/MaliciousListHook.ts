// src/hooks/useItems.js
import { useEffect, useState } from "react";
import api from "../services/api";
import { MaliciousFormat } from "../types/appTypes";

//next: write the functions for edit/delete/add wright

export const useMaliciousFormat = () => {
  const [maliciousFormats, setMaliciousFormats] = useState<MaliciousFormat[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMaliciousFormat = async () => {
    try {
      const response = await api.get(`/malicious`, {});
      console.log("fetch all response:", response);
      const maliciousList = response.data.malicious.map(
        (maliciousFormat: any) => ({
          id: maliciousFormat._id, // Use _id as id
          ...maliciousFormat,
        })
      );
      setMaliciousFormats(maliciousList);
    } catch (error) {
      console.error("Error fetching malicious list:", error);
    }
  };

  useEffect(() => {
    fetchMaliciousFormat();
  }, []);
  useEffect(() => {
    console.log("Malicious formats updated in hook:", maliciousFormats);
  }, [maliciousFormats]);

  const handleEditApiCall = async (
    newMaliciousFormat: MaliciousFormat,
    maliciousFormatId: string
  ) => {
    try {
      const response = await api.put(`/malicious/${maliciousFormatId}`, {
        id: newMaliciousFormat.id,
        sourceEmail: newMaliciousFormat.sourceEmail,
        sourcePhone: newMaliciousFormat.sourcePhone,
        message: newMaliciousFormat.message,
        subject: newMaliciousFormat.subject,
      });
      setMaliciousFormats(
        maliciousFormats.map((maliciousFormat) =>
          maliciousFormat.id === newMaliciousFormat.id
            ? newMaliciousFormat
            : maliciousFormat
        )
      );
      console.log(
        "maliciousFormats at front after editing data:",
        maliciousFormats
      );
    } catch (error) {
      console.error("Error updating malicious message format:", error);
    }
  };

  const handleDeleteApiCall = async (maliciousFormatId: string) => {
    if (loading) return; // Prevent save click during loading

    setLoading(true);
    try {
      await api.delete(`/malicious/${maliciousFormatId}`); // Correct API route with contact ID
      setMaliciousFormats(
        maliciousFormats.filter(
          (malicious) => malicious.id !== maliciousFormatId
        )
      ); // Update UI
    } catch (error) {
      console.error("Error deleting malicious format:", error);
      alert("Could not malicious format. Please try again.");
      //navigate("/main");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiCall = async (
    newMaliciousFormat: Omit<MaliciousFormat, "id">
  ) => {
    try {
      const response = await api.post(`/malicious`, {
        sourceEmail: newMaliciousFormat.sourceEmail,
        sourcePhone: newMaliciousFormat.sourcePhone,
        message: newMaliciousFormat.message,
        subject: newMaliciousFormat.subject,
      });
      const serverGeneratedId = response.data._id;
      const maliciousFormat: MaliciousFormat = {
        sourceEmail: newMaliciousFormat.sourceEmail,
        sourcePhone: newMaliciousFormat.sourcePhone,
        message: newMaliciousFormat.message,
        subject: newMaliciousFormat.subject,
        id: serverGeneratedId,
      };
      setMaliciousFormats([...maliciousFormats, maliciousFormat]);
    } catch (error) {
      console.error("Error creating new malicious message format:", error);
    }
  };

  return {
    maliciousFormats,
    handleEditApiCall,
    handleDeleteApiCall,
    handleCreateApiCall,
    loading,
  };
};
