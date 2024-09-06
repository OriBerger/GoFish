import { useEffect, useState } from "react";
import api from "../services/api";
import AddContactForm from "./AddContactForm";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // You can set this to any value

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts`, {
        params: {
          page,
          limit,
        },
      });

      setContacts(response.data.contacts);
      setTotalPages(
        response.data.totalPages > 0 ? response.data.totalPages : 1
      );
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleAddContact = async () => {};

  return (
    <div>
      <p>here youe can see your contact list</p>
      <p></p>
      <button onClick={() => console.log("add contact info button clicked")}>
        add contact info
      </button>
      <button onClick={() => console.log("add contact info button clicked")}>
        delete contact info
      </button>
      <div>
        <h3>Contacts</h3>
        <ul>
          {contacts.map((contact) => (
            <li key={contact._id}>
              {contact.name} - {contact.email}
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>
          <span>
            {" "}
            Page {page} of {totalPages}{" "}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
      <AddContactForm onContactAdded={fetchContacts} />
    </div>
  );
};

export default ContactList;
