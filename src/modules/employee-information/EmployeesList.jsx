import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  X,
} from "lucide-react";
import Pagination from "../../components/common/Pagination/Pagination";
import Filter from "../../components/common/Filter/Filter";
import { useNavigate } from "react-router-dom";

import "./EmployeesList.css";

const mockEmployees = [
  {
    id: "EMP025SKD",
    name: "Fghdt",
    gender: "Female",
    department: "Accountant",
    designation: "Director",
    contact: "5687585654",
    joiningDate: "21-08-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP024SKD",
    name: "Demo",
    gender: "Female",
    department: "Counsellar",
    designation: "Administration Staff",
    contact: "5678990860",
    joiningDate: "21-08-2026",
    employeeType: "Contractual",
    status: "Active",
    image: null,
  },
  {
    id: "EMP022SKD",
    name: "Kashvi",
    gender: "Female",
    department: "Administration",
    designation: "Director",
    contact: "8895965896",
    joiningDate: "10-08-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP021SKD",
    name: "Shyam Tiwati",
    gender: "Male",
    department: "Teaching",
    designation: "Primary Teacher (PRT)",
    contact: "7878478758",
    joiningDate: "10-08-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP009SKD",
    name: "Keshi",
    gender: "Female",
    department: "Administration",
    designation: "Principal",
    contact: "8851460348",
    joiningDate: "01-04-2012",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP008SKD",
    name: "Golu Yadav",
    gender: "Male",
    department: "Non-Teaching",
    designation: "Administration Staff",
    contact: "7722180322",
    joiningDate: "20-07-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP007SKD",
    name: "Sonu Pal",
    gender: "Male",
    department: "Teaching",
    designation: "Primary Teacher (PRT)",
    contact: "2222121221",
    joiningDate: "01-08-2026",
    employeeType: "Ad-Hoc",
    status: "Active",
    image: null,
  },
  {
    id: "EMP006SKD",
    name: "Apsara",
    gender: "Female",
    department: "Teaching",
    designation: "Trained Graduate Teacher (TGT)",
    contact: "6397851453",
    joiningDate: "15-07-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP006SKD",
    name: "ARVAD KHAN SAIFI",
    gender: "Male",
    department: "Teaching",
    designation: "Director",
    contact: "6397163668",
    joiningDate: "01-07-2026",
    employeeType: "Contractual",
    status: "Active",
    image: null,
  },
  {
    id: "EMP005SKD",
    name: "Arzoo",
    gender: "Female",
    department: "Teaching",
    designation: "Trained Graduate Teacher (TGT)",
    contact: "7845769823",
    joiningDate: "01-07-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP004SKD",
    name: "Support Employee",
    gender: "Male",
    department: "Administration",
    designation: "Office Staff",
    contact: "7895949732",
    joiningDate: "07-07-2026",
    employeeType: "Part-Time",
    status: "Active",
    image: null,
  },
  {
    id: "EMP003SKD",
    name: "Rahul Sharma",
    gender: "Male",
    department: "Teaching",
    designation: "Primary Teacher (PRT)",
    contact: "9638527412",
    joiningDate: "01-06-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
  {
    id: "EMP002SKD",
    name: "Priya",
    gender: "Female",
    department: "Teaching",
    designation: "Trained Graduate Teacher (TGT)",
    contact: "8756231456",
    joiningDate: "01-07-2026",
    employeeType: "Permanent",
    status: "Active",
    image: null,
  },
];

// Field definitions for the common Filter component.
// Filter.jsx already renders its own "All {label}" option,
// so these lists only contain the real values.
const filterFields = [
  {
    name: "employeeType",
    label: "Employee Type",
    options: [
      { value: "Permanent", label: "Permanent" },
      { value: "Contractual", label: "Contractual" },
      { value: "Ad-Hoc", label: "Ad-Hoc" },
      { value: "Part-Time", label: "Part-Time" },
      { value: "Probationary", label: "Probationary" },
    ],
  },
  {
    name: "department",
    label: "Department",
    options: [
      { value: "Administration", label: "Administration" },
      { value: "Teaching", label: "Teaching" },
      { value: "Non-Teaching", label: "Non-Teaching" },
      { value: "Accountant", label: "Accountant" },
    ],
  },
  {
    name: "gender",
    label: "Gender",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
];

function EmployeeList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    employeeType: "",
    department: "",
    gender: "",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);
  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mockEmployees.filter((employee) => {
      const matchesSearch =
        !keyword ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.id.toLowerCase().includes(keyword) ||
        employee.contact.toLowerCase().includes(keyword) ||
        employee.department.toLowerCase().includes(keyword) ||
        employee.designation.toLowerCase().includes(keyword);

      const matchesEmployeeType =
        !appliedFilters.employeeType ||
        employee.employeeType === appliedFilters.employeeType;

      const matchesDepartment =
        !appliedFilters.department ||
        employee.department === appliedFilters.department;

      const matchesGender =
        !appliedFilters.gender ||
        employee.gender === appliedFilters.gender;

      return (
        matchesSearch &&
        matchesEmployeeType &&
        matchesDepartment &&
        matchesGender
      );
    });
  }, [search, appliedFilters]);

  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApplyFilter = (newFilters) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilter = (newFilters) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  // =====================================================
// CLOSE ACTION MENU ON OUTSIDE CLICK
// =====================================================

useEffect(() => {
  if (openActionId === null) {
    return;
  }
  const handleOutsideClick = (event) => {
    if (!event.target.closest(".employee-more-wrapper")) {
      setOpenActionId(null);
    }
  };
  document.addEventListener("mousedown", handleOutsideClick);
  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, [openActionId]);

  return (
    <div className="employee-page">
      <div className="employee-page-title">
        Employee List
      </div>
      {/* Main Table Container */}
      <div className="employee-table-container">
        
        {/* Table */}
        <div className="employee-table-wrapper">

          {/* Toolbar */}
          <div className="employee-toolbar">
          {/* Left */}
          <div className="employee-toolbar-left">
            <Filter
              filters={filterFields}
              value={appliedFilters}
              onApply={handleApplyFilter}
              onReset={handleResetFilter}
            />

            <div className="employee-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="employee-search-clear"
                  onClick={() => handleSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="employee-toolbar-right">
            <button
              type="button"
              className="employee-add-button"
              onClick={() => navigate("/employee-information/addEmployee")}
            >
              <Plus size={17} />
              <span>Add</span>
            </button>

            <Pagination
              variant="compact"
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee Details</th>
                <th>Employee ID</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact No.</th>
                <th>Joining Date</th>
                <th className="employee-actions-header">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={`${employee.id}-${employee.name}`}>

                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {employee.image ? (
                          <img src={employee.image} alt={employee.name} />
                        ) : (
                          getInitial(employee.name)
                        )}
                      </div>

                      <span className="employee-name">
                        {employee.name}
                      </span>
                    </div>
                  </td>

                  <td>{employee.id}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.contact}</td>
                  <td>{employee.joiningDate}</td>

                  <td>
                    <div className="employee-actions">
                      <button
                        type="button"
                        className="employee-action-button"
                        title="View"
                        onClick={() => console.log("View", employee)}
                      >
                        <Eye size={17} />
                      </button>

                      <div className="employee-more-wrapper">
                        <button
                          type="button"
                          className="employee-action-button"
                          title="More"
                          onClick={() =>
                            setOpenActionId(
                              openActionId === employee.id ? null : employee.id
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openActionId === employee.id && (
                          <div className="employee-action-menu">
                            <button
                              type="button"
                              onClick={() => {
                                console.log("Edit", employee);
                                setOpenActionId(null);
                              }}
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              className="danger"
                              onClick={() => {
                                console.log("Delete", employee);
                                setOpenActionId(null);
                              }}
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="employee-empty">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default EmployeeList;