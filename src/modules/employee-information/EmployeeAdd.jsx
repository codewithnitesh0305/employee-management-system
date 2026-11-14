import { useRef, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Landmark,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import ReactDatePicker from "react-datepicker";

import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

import Select from "../../components/forms/Select";
import Button from "../../components/forms/Button";
import Checkbox from "../../components/forms/Checkbox";
import DatePicker from "../../components/forms/DatePicker";
import ImageUpload from "../../components/forms/ImageUpload";
import Input from "../../components/forms/Input";

import "./EmployeeAdd.css";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  employeeId: "",
  salutation: "Mr.",
  employeeName: "",
  gender: "",
  dateOfBirth: "",
  contactCountryCode: "+91",
  contactNo: "",
  email: "",
  bloodGroup: "",
  caste: "",
  religion: "",
  nationality: "Indian",
  maritalStatus: "",
  department: "",
  designation: "",
  userRole: "",
  dateOfJoining: "",
  employeeType: "",
  reportingAuthority: "",
  uan: "",
  schoolTimingMaster: "",
  biometricCode: "",

  fatherSalutation: "Mr.",
  fatherName: "",
  fatherContactCountryCode: "+91",
  fatherContactNo: "",
  fatherEmail: "",

  motherSalutation: "Miss",
  motherName: "",
  motherContactCountryCode: "+91",
  motherContactNo: "",
  motherEmail: "",

  spouseSalutation: "Mr.",
  spouseName: "",
  spouseContactCountryCode: "+91",
  spouseContactNo: "",
  spouseEmail: "",

  correspondenceAddress: "",
  correspondenceCountry: "India",
  correspondenceState: "Uttar Pradesh",
  correspondenceCity: "Noida",
  correspondencePinCode: "",

  sameAsCorrespondence: false,

  permanentAddress: "",
  permanentCountry: "",
  permanentState: "",
  permanentCity: "",
  permanentPinCode: "",

  accountName: "",
  accountNumber: "",
  reEnterAccountNumber: "",
  ifsc: "",
  bankName: "",
  bankBranch: "",
};

const educationColumns = [
  { key: "qualification", label: "Qualification", placeholder: "e.g. Bachelor's degree" },
  { key: "institution", label: "Institution", placeholder: "School / college name" },
  { key: "board", label: "Board / University", placeholder: "Board or university" },
  { key: "yearOfPassing", label: "Year of Passing", type: "year" },
  { key: "grade", label: "Grade / Percentage", placeholder: "e.g. 85% or A" },
];

const experienceColumns = [
  { key: "organization", label: "Organization", placeholder: "Company name" },
  { key: "designation", label: "Designation", placeholder: "Job title" },
  { key: "startDate", label: "From", type: "date" },
  { key: "endDate", label: "To", type: "date" },
  { key: "responsibilities", label: "Responsibilities", placeholder: "Key responsibilities" },
];

function parseCalendarDate(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day || 1);
}

function formatCalendarDate(date, type) {
  if (!date) {
    return "";
  }

  if (type === "year") {
    return String(date.getFullYear());
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* =========================================================
   COMMON OPTIONS
========================================================= */

const makeOptions = (values) =>
  values.map((value) => ({
    label: value,
    value,
  }));

const salutationOptions = makeOptions([
  "Mr.",
  "Mrs.",
  "Miss",
  "Ms.",
  "Dr.",
]);

const countryCodeOptions = makeOptions([
  "+91",
  "+1",
  "+44",
  "+971",
]);

const genderOptions = makeOptions([
  "Male",
  "Female",
  "Other",
]);

const bloodGroupOptions = makeOptions([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

const casteOptions = makeOptions([
  "General",
  "OBC",
  "SC",
  "ST",
]);

const religionOptions = makeOptions([
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Other",
]);

const nationalityOptions = makeOptions([
  "Indian",
  "Other",
]);

const maritalStatusOptions = makeOptions([
  "Single",
  "Married",
  "Divorced",
  "Widowed",
]);

const departmentOptions = makeOptions([
  "Administration",
  "Teaching",
  "Non-Teaching",
  "Finance",
  "Human Resources",
]);

const designationOptions = makeOptions([
  "Director",
  "Principal",
  "Primary Teacher (PRT)",
  "Trained Graduate Teacher (TGT)",
  "Administration Staff",
  "Accountant",
  "Office Staff",
]);

const userRoleOptions = makeOptions([
  "Admin",
  "Manager",
  "Employee",
  "Teacher",
]);

const employeeTypeOptions = makeOptions([
  "Permanent",
  "Probationary",
  "Contractual",
  "Part-Time",
  "Ad-Hoc",
  "Guard",
]);

const reportingAuthorityOptions = makeOptions([
  "Director",
  "Principal",
  "HR Manager",
  "Manager",
]);

const schoolTimingOptions = makeOptions([
  "Morning Shift",
  "General Shift",
  "Evening Shift",
]);

const countryOptions = makeOptions([
  "India",
  "United States",
  "United Kingdom",
]);

const stateOptions = makeOptions([
  "Uttar Pradesh",
  "Delhi",
  "Haryana",
  "Maharashtra",
]);

const cityOptions = makeOptions([
  "Noida",
  "Delhi",
  "Ghaziabad",
  "Gurugram",
]);

/* =========================================================
   EMPLOYEE ADD
========================================================= */

function EmployeeAdd() {
  const [form, setForm] = useState(initialForm);
  const [employeePhoto, setEmployeePhoto] = useState(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState("family");
  const nextEducationId = useRef(2);
  const nextExperienceId = useRef(2);
  const [educationRows, setEducationRows] = useState([
    { id: 1, qualification: "", institution: "", board: "", yearOfPassing: "", grade: "" },
  ]);
  const [experienceRows, setExperienceRows] = useState([
    { id: 1, organization: "", designation: "", startDate: "", endDate: "", responsibilities: "" },
  ]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* -------------------------------------------------------
     SAME ADDRESS
  ------------------------------------------------------- */

  const handleSameAddress = (checked) => {
    setForm((previous) => ({
      ...previous,
      sameAsCorrespondence: checked,

      ...(checked
        ? {
            permanentAddress: previous.correspondenceAddress,
            permanentCountry: previous.correspondenceCountry,
            permanentState: previous.correspondenceState,
            permanentCity: previous.correspondenceCity,
            permanentPinCode: previous.correspondencePinCode,
          }
        : {
            permanentAddress: "",
            permanentCountry: "",
            permanentState: "",
            permanentCity: "",
            permanentPinCode: "",
          }),
    }));
  };

  /* -------------------------------------------------------
     SAVE
  ------------------------------------------------------- */

  const handleSave = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      employeePhoto,
      educationDetails: educationRows.map(({ id, ...row }) => row),
      experienceDetails: experienceRows.map(({ id, ...row }) => row),
    };

    console.log("Employee Payload:", payload);

    // API call will be added later
  };

  /* -------------------------------------------------------
     CANCEL
  ------------------------------------------------------- */

  const handleCancel = () => {
    setForm(initialForm);
    setEmployeePhoto(null);
    setActiveDetailsTab("family");
    setEducationRows([
      { id: nextEducationId.current++, qualification: "", institution: "", board: "", yearOfPassing: "", grade: "" },
    ]);
    setExperienceRows([
      { id: nextExperienceId.current++, organization: "", designation: "", startDate: "", endDate: "", responsibilities: "" },
    ]);
  };

  const addEducationRow = () => {
    setEducationRows((rows) => [
      ...rows,
      {
        id: nextEducationId.current++,
        qualification: "",
        institution: "",
        board: "",
        yearOfPassing: "",
        grade: "",
      },
    ]);
  };

  const addExperienceRow = () => {
    setExperienceRows((rows) => [
      ...rows,
      {
        id: nextExperienceId.current++,
        organization: "",
        designation: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  };

  const updateEducationRow = (id, field, value) => {
    setEducationRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const updateExperienceRow = (id, field, value) => {
    setExperienceRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="employee-add-page">
      <Breadcrumb
        items={[
          {
            label: "Employee",
            path: "/employees",
          },
          {
            label: "Add",
          },
        ]}
      />

      <form
        className="employee-form-card"
        onSubmit={handleSave}
      >
        {/* =================================================
            PERSONAL DETAILS
        ================================================== */}

        <FormSection title="Personal Details">
          <div className="personal-details-grid">

            {/* EMPLOYEE PHOTO */}

            <div className="employee-photo-column">
              <ImageUpload
                value={employeePhoto}
                onChange={setEmployeePhoto}
              />
            </div>

            {/* EMPLOYEE ID */}

            <Input
              label="Employee ID"
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={(value) =>
                handleChange("employeeId", value)
              }
            />

            {/* EMPLOYEE NAME */}

            <div className="form-field">
              <label>
                Employee Name
                <Required />
              </label>

              <div className="input-group">
                <div className="salutation-input">
                  <Select
                    required
                    clearable = {false}
                    value={form.salutation}
                    options={salutationOptions}
                    onChange={(value) =>
                      handleChange("salutation", value)
                    }
                  />
                </div>

                <Input
                  placeholder="Enter Name"
                  value={form.employeeName}
                  onChange={(value) =>
                    handleChange("employeeName", value)
                  }
                />
              </div>
            </div>

            {/* GENDER */}

            <Select
              label="Gender"
              required
              placeholder="Select Gender"
              value={form.gender}
              options={genderOptions}
              onChange={(value) =>
                handleChange("gender", value)
              }
            />

            {/* DATE OF BIRTH */}

            <DatePicker
              label="Date Of Birth"
              required
              placeholder="Select Date"
              value={form.dateOfBirth}
              onChange={(value) =>
                handleChange("dateOfBirth", value)
              }
            />

            {/* CONTACT */}

            <div className="form-field">
              <label>
                Contact No.
                <Required />
              </label>

              <div className="input-group">
                <div className="country-code-input">
                  <Select
                    clearable = {false}
                    value={form.contactCountryCode}
                    options={countryCodeOptions}
                    onChange={(value) =>
                      handleChange(
                        "contactCountryCode",
                        value
                      )
                    }
                  />
                </div>

                <Input
                  placeholder="Enter Contact No."
                  value={form.contactNo}
                  onChange={(value) =>
                    handleChange("contactNo", value)
                  }
                />
              </div>
            </div>

            {/* EMAIL */}

            <Input
              label="Email ID"
              required
              placeholder="Enter Email ID"
              value={form.email}
              onChange={(value) =>
                handleChange("email", value)
              }
            />

            {/* BLOOD GROUP */}

            <Select
              label="Blood Group"
              placeholder="Select Blood Group"
              value={form.bloodGroup}
              options={bloodGroupOptions}
              onChange={(value) =>
                handleChange("bloodGroup", value)
              }
            />

            {/* CASTE */}

            <Select
              label="Caste"
              placeholder="Select Caste"
              value={form.caste}
              options={casteOptions}
              onChange={(value) =>
                handleChange("caste", value)
              }
            />

            {/* RELIGION */}

            <Select
              label="Religion"
              placeholder="Select Religion"
              value={form.religion}
              options={religionOptions}
              onChange={(value) =>
                handleChange("religion", value)
              }
            />

            {/* NATIONALITY */}

            <Select
              label="Nationality"
              value={form.nationality}
              options={nationalityOptions}
              onChange={(value) =>
                handleChange("nationality", value)
              }
            />

            {/* MARITAL STATUS */}

            <Select
              label="Marital Status"
              placeholder="Select Marital Status"
              value={form.maritalStatus}
              options={maritalStatusOptions}
              onChange={(value) =>handleChange("maritalStatus", value)
              }
            />

            {/* DEPARTMENT */}

            <Select
              label="Department"
              required
              placeholder="Select Department"
              value={form.department}
              options={departmentOptions}
              onChange={(value) =>
                handleChange("department", value)
              }
            />

            {/* DESIGNATION */}

            <Select
              label="Designation"
              required
              placeholder="Select Designation"
              value={form.designation}
              options={designationOptions}
              onChange={(value) =>
                handleChange("designation", value)
              }
            />

            {/* USER ROLE */}

            <Select
              label="User Role"
              required
              placeholder="Select User Role"
              value={form.userRole}
              options={userRoleOptions}
              onChange={(value) =>
                handleChange("userRole", value)
              }
            />

            {/* DATE OF JOINING */}

            <DatePicker
              label="Date Of Joining"
              required
              placeholder="Select Date"
              value={form.dateOfJoining}
              onChange={(value) =>
                handleChange("dateOfJoining", value)
              }
            />

            {/* EMPLOYEE TYPE */}

            <Select
              label="Employee Type"
              required
              placeholder="Select Employee Type"
              value={form.employeeType}
              options={employeeTypeOptions}
              onChange={(value) =>
                handleChange("employeeType", value)
              }
            />

            {/* REPORTING AUTHORITY */}

            <Select
              label="Reporting Authority"
              placeholder="Select Reporting Authority"
              value={form.reportingAuthority}
              options={reportingAuthorityOptions}
              onChange={(value) =>
                handleChange(
                  "reportingAuthority",
                  value
                )
              }
            />

            {/* UAN */}

            <Input
              label="UAN"
              placeholder="Enter UAN"
              value={form.uan}
              onChange={(value) =>
                handleChange("uan", value)
              }
            />

            {/* SCHOOL TIMING */}

            <Select
              label="School Timing Master"
              placeholder="Select School Timing Master"
              value={form.schoolTimingMaster}
              options={schoolTimingOptions}
              onChange={(value) =>
                handleChange(
                  "schoolTimingMaster",
                  value
                )
              }
            />

            {/* BIOMETRIC */}

            <Input
              label="Biometric Code"
              placeholder="Enter Biometric Code"
              value={form.biometricCode}
              onChange={(value) =>
                handleChange("biometricCode", value)
              }
            />
          </div>
        </FormSection>

        <FormSection title="Address Details">
          <AddressBlock
            title="Correspondence Address"
            prefix="correspondence"
            address={form.correspondenceAddress}
            country={form.correspondenceCountry}
            state={form.correspondenceState}
            city={form.correspondenceCity}
            pinCode={form.correspondencePinCode}
            onChange={handleChange}
          />
          <div className="same-address-checkbox">
            <Checkbox
              checked={form.sameAsCorrespondence}
              onChange={handleSameAddress}
              label="Permanent address is same as correspondence address."
            />
          </div>
          <AddressBlock
            title="Permanent Address"
            prefix="permanent"
            address={form.permanentAddress}
            country={form.permanentCountry}
            state={form.permanentState}
            city={form.permanentCity}
            pinCode={form.permanentPinCode}
            onChange={handleChange}
            disabled={form.sameAsCorrespondence}
          />
        </FormSection>

        <div className="employee-details-tabs">
          <div
            className="employee-details-tab-list"
            role="tablist"
            aria-label="Additional employee details"
          >
            <button
              id="employee-family-tab"
              className={`employee-details-tab${activeDetailsTab === "family" ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeDetailsTab === "family"}
              aria-controls="employee-family-panel"
              tabIndex={activeDetailsTab === "family" ? 0 : -1}
              onClick={() => setActiveDetailsTab("family")}
            >
              <UsersRound size={17} aria-hidden="true" />
              Family Details
            </button>
            <button
              id="employee-bank-tab"
              className={`employee-details-tab${activeDetailsTab === "bank" ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeDetailsTab === "bank"}
              aria-controls="employee-bank-panel"
              tabIndex={activeDetailsTab === "bank" ? 0 : -1}
              onClick={() => setActiveDetailsTab("bank")}
            >
              <Landmark size={17} aria-hidden="true" />
              Bank Details
            </button>
            <button
              id="employee-education-tab"
              className={`employee-details-tab${activeDetailsTab === "education" ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeDetailsTab === "education"}
              aria-controls="employee-education-panel"
              tabIndex={activeDetailsTab === "education" ? 0 : -1}
              onClick={() => setActiveDetailsTab("education")}
            >
              <BookOpen size={17} aria-hidden="true" />
              Education
            </button>
            <button
              id="employee-experience-tab"
              className={`employee-details-tab${activeDetailsTab === "experience" ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeDetailsTab === "experience"}
              aria-controls="employee-experience-panel"
              tabIndex={activeDetailsTab === "experience" ? 0 : -1}
              onClick={() => setActiveDetailsTab("experience")}
            >
              <BriefcaseBusiness size={17} aria-hidden="true" />
              Experience
            </button>
          </div>

          <div
              hidden={activeDetailsTab !== "family"}
              id="employee-family-panel"
              className="employee-details-tab-panel"
              role="tabpanel"
              aria-labelledby="employee-family-tab"
              tabIndex={0}
            >
              <FormSection title="Family Details">

          <FamilyPerson
            title="Father's Details"
            nameLabel="Father's Name"
            namePlaceholder="Enter Father's Name"
            salutation={form.fatherSalutation}
            name={form.fatherName}
            contactCode={form.fatherContactCountryCode}
            contact={form.fatherContactNo}
            email={form.fatherEmail}
            onSalutationChange={(value) =>
              handleChange("fatherSalutation", value)
            }
            onNameChange={(value) =>
              handleChange("fatherName", value)
            }
            onContactCodeChange={(value) =>
              handleChange(
                "fatherContactCountryCode",
                value
              )
            }
            onContactChange={(value) =>
              handleChange(
                "fatherContactNo",
                value
              )
            }
            onEmailChange={(value) =>
              handleChange("fatherEmail", value)
            }
          />

          <FamilyPerson
            title="Mother's Details"
            nameLabel="Mother's Name"
            namePlaceholder="Enter Mother's Name"
            salutation={form.motherSalutation}
            name={form.motherName}
            contactCode={form.motherContactCountryCode}
            contact={form.motherContactNo}
            email={form.motherEmail}
            onSalutationChange={(value) =>
              handleChange("motherSalutation", value)
            }
            onNameChange={(value) =>
              handleChange("motherName", value)
            }
            onContactCodeChange={(value) =>
              handleChange(
                "motherContactCountryCode",
                value
              )
            }
            onContactChange={(value) =>
              handleChange(
                "motherContactNo",
                value
              )
            }
            onEmailChange={(value) =>
              handleChange("motherEmail", value)
            }
          />

          <FamilyPerson
            title="Spouse Details"
            nameLabel="Spouse's Name"
            namePlaceholder="Enter Spouse's Name"
            salutation={form.spouseSalutation}
            name={form.spouseName}
            contactCode={form.spouseContactCountryCode}
            contact={form.spouseContactNo}
            email={form.spouseEmail}
            onSalutationChange={(value) =>
              handleChange("spouseSalutation", value)
            }
            onNameChange={(value) =>
              handleChange("spouseName", value)
            }
            onContactCodeChange={(value) =>
              handleChange(
                "spouseContactCountryCode",
                value
              )
            }
            onContactChange={(value) =>
              handleChange(
                "spouseContactNo",
                value
              )
            }
            onEmailChange={(value) =>
              handleChange("spouseEmail", value)
            }
          />

              </FormSection>
          </div>

          <div
              hidden={activeDetailsTab !== "bank"}
              id="employee-bank-panel"
              className="employee-details-tab-panel"
              role="tabpanel"
              aria-labelledby="employee-bank-tab"
              tabIndex={0}
            >
              <FormSection title="Bank Details">
                <div className="four-column-grid">
                  <Input
                    label="Account Name"
                    placeholder="Enter Account Name"
                    value={form.accountName}
                    onChange={(value) => handleChange("accountName", value)}
                  />
                  <Input
                    label="Account Number"
                    placeholder="Enter Account Number"
                    value={form.accountNumber}
                    onChange={(value) => handleChange("accountNumber", value)}
                  />
                  <Input
                    label="Re-enter Account Number"
                    placeholder="Re-enter Account Number"
                    value={form.reEnterAccountNumber}
                    onChange={(value) =>
                      handleChange("reEnterAccountNumber", value)
                    }
                  />
                  <Input
                    label="IFSC"
                    placeholder="Search IFSC"
                    value={form.ifsc}
                    onChange={(value) => handleChange("ifsc", value)}
                  />
                  <Input
                    label="Bank Name"
                    placeholder="Enter Bank Name"
                    value={form.bankName}
                    onChange={(value) => handleChange("bankName", value)}
                  />
                  <Input
                    label="Branch"
                    placeholder="Enter Branch"
                    value={form.bankBranch}
                    onChange={(value) => handleChange("bankBranch", value)}
                  />
                </div>
              </FormSection>
          </div>

          <div
            hidden={activeDetailsTab !== "education"}
            id="employee-education-panel"
            className="employee-details-tab-panel"
            role="tabpanel"
            aria-labelledby="employee-education-tab"
            tabIndex={0}
          >
            <FormSection title="Education Details">
              <DetailRowsTable
                label="education"
                rows={educationRows}
                columns={educationColumns}
                onAdd={addEducationRow}
                onChange={updateEducationRow}
                onDelete={(id) =>
                  setEducationRows((rows) => rows.filter((row) => row.id !== id))
                }
              />
            </FormSection>
          </div>

          <div
            hidden={activeDetailsTab !== "experience"}
            id="employee-experience-panel"
            className="employee-details-tab-panel"
            role="tabpanel"
            aria-labelledby="employee-experience-tab"
            tabIndex={0}
          >
            <FormSection title="Experience Details">
              <DetailRowsTable
                label="experience"
                rows={experienceRows}
                columns={experienceColumns}
                onAdd={addExperienceRow}
                onChange={updateExperienceRow}
                onDelete={(id) =>
                  setExperienceRows((rows) => rows.filter((row) => row.id !== id))
                }
              />
            </FormSection>
          </div>

          {activeDetailsTab === "experience" && (
            <div className="employee-form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({ title, children }) {
  return (
    <section className="employee-form-section">

      <div className="employee-section-header">
        {title}
      </div>

      <div className="employee-section-body">
        {children}
      </div>

    </section>
  );
}

function DetailRowsTable({ label, rows, columns, onAdd, onChange, onDelete }) {
  const title = label[0].toUpperCase() + label.slice(1);

  return (
    <>
      <div className="employee-details-table-toolbar">
        <span>{title} records</span>
        <button
          className="employee-add-row-button"
          type="button"
          onClick={onAdd}
        >
          <Plus size={15} aria-hidden="true" />
          Add {label}
        </button>
      </div>
      <div className="employee-details-table-scroll">
        <table className="employee-details-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
              <th className="employee-details-delete-column" scope="col">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="employee-details-empty" colSpan={columns.length + 1}>
                  No {label} records. Use “Add {label}” to add one.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.type === "date" || column.type === "year" ? (
                        <ReactDatePicker
                          ariaLabel={`${title} ${rowIndex + 1}: ${column.label}`}
                          selected={
                            column.type === "year"
                              ? row[column.key]
                                ? new Date(Number(row[column.key]), 0, 1)
                                : null
                              : parseCalendarDate(row[column.key])
                          }
                          onChange={(date) =>
                            onChange(
                              row.id,
                              column.key,
                              formatCalendarDate(date, column.type)
                            )
                          }
                          showYearPicker={column.type === "year"}
                          dateFormat={
                            column.type === "year" ? "yyyy" : "dd MMM yyyy"
                          }
                          placeholderText={
                            column.type === "year"
                              ? "Select year"
                              : "Select date"
                          }
                          wrapperClassName="employee-table-datepicker"
                          className="employee-table-date-input"
                          calendarClassName="employee-table-calendar"
                          showMonthDropdown={column.type === "date"}
                          showYearDropdown={column.type === "date"}
                          scrollableYearDropdown={column.type === "date"}
                          yearDropdownItemNumber={100}
                          autoComplete="off"
                        />
                      ) : (
                        <input
                          aria-label={`${title} ${rowIndex + 1}: ${column.label}`}
                          type="text"
                          placeholder={column.placeholder}
                          value={row[column.key]}
                          onChange={(event) =>
                            onChange(row.id, column.key, event.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}
                  <td className="employee-details-delete-column">
                    <button
                      className="employee-delete-row-button"
                      type="button"
                      onClick={() => onDelete(row.id)}
                      aria-label={`Delete ${label} row ${rowIndex + 1}`}
                      title={`Delete ${label} row`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =========================================================
   FAMILY PERSON
========================================================= */

function FamilyPerson({
  title,
  nameLabel,
  namePlaceholder,

  salutation,
  name,
  contactCode,
  contact,
  email,

  onSalutationChange,
  onNameChange,
  onContactCodeChange,
  onContactChange,
  onEmailChange,
}) {
  return (
    <div className="family-person">

      <h4>{title}</h4>

      <div className="family-grid">

        {/* NAME */}

        <div className="form-field family-name-field">

          <label>
            {nameLabel}
          </label>

          <div className="input-group">

            <div className="family-salutation">
              <Select
              clearable = {false}
                value={salutation}
                options={salutationOptions}
                onChange={onSalutationChange}
              />
            </div>

            <Input
              placeholder={namePlaceholder}
              value={name}
              onChange={onNameChange}
            />

          </div>

        </div>

        {/* CONTACT */}

        <div className="form-field family-contact-field">

          <label>
            Contact No.
          </label>

          <div className="input-group">

            <div className="country-code-input">
              <Select
              clearable = {false}
                value={contactCode}
                options={countryCodeOptions}
                onChange={onContactCodeChange}
              />
            </div>

            <Input
              placeholder="Enter Contact No."
              value={contact}
              onChange={onContactChange}
            />

          </div>

        </div>

        {/* EMAIL */}

        <Input
          label="Email ID"
          placeholder="Enter Email ID"
          value={email}
          onChange={onEmailChange}
        />

      </div>

    </div>
  );
}

/* =========================================================
   ADDRESS BLOCK
========================================================= */

function AddressBlock({
  title,
  prefix,

  address,
  country,
  state,
  city,
  pinCode,

  onChange,
  disabled = false,
}) {
  return (
    <div className="address-block">

      <h4>{title}:</h4>

      <div className="address-grid">

        {/* ADDRESS */}

        <Input
          label="Address"
          required
          placeholder="Enter Address"
          value={address}
          disabled={disabled}
          onChange={(value) =>
            onChange(`${prefix}Address`, value)
          }
        />

        {/* COUNTRY */}

        <Select
          label="Country"
          required
          placeholder="Select Country"
          value={country}
          options={countryOptions}
          disabled={disabled}
          onChange={(value) =>
            onChange(`${prefix}Country`, value)
          }
        />

        {/* STATE */}

        <Select
          label="State"
          required
          placeholder="Select State"
          value={state}
          options={stateOptions}
          disabled={disabled}
          onChange={(value) =>
            onChange(`${prefix}State`, value)
          }
        />

        {/* CITY */}

        <Select
          label="City"
          required
          placeholder="Select City"
          value={city}
          options={cityOptions}
          disabled={disabled}
          onChange={(value) =>
            onChange(`${prefix}City`, value)
          }
        />

        {/* PIN CODE */}

        <Input
          label="PIN/ZIP Code"
          placeholder="Enter PIN/ZIP Code"
          value={pinCode}
          disabled={disabled}
          onChange={(value) =>
            onChange(`${prefix}PinCode`, value)
          }
        />

      </div>

    </div>
  );
}

/* =========================================================
   REQUIRED
========================================================= */

function Required() {
  return (
    <span className="required">
      *
    </span>
  );
}

export default EmployeeAdd;