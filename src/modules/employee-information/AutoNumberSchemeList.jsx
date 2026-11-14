import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Power, Trash2, X } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import SetupTable from "../../components/common/SetupTable/SetupTable";
import { employeeSetupApi } from "../../api/employee/employeeSetupApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useToast } from "../../components/common/Toast/useToast";
import "./AutoNumberSchemeList.css";

const EMPTY_FORM = {
  prefix: "",
  startingNo: "",
  postfix: "",
  financialYearId: "",
  departmentId: "",
};

function getPayload(response) {
  if (response?.status === false) {
    throw new Error(response.message || "Unable to load auto number schemes.");
  }

  let payload = response?.data ?? response;
  if (payload?.data && !Array.isArray(payload.data)) {
    payload = payload.data;
  }
  return payload;
}

function findArray(source, acceptedKeys, listLabel) {
  const visited = new Set();
  const search = (value) => {
    if (!value || typeof value !== "object" || visited.has(value)) {
      return null;
    }
    visited.add(value);

    for (const key of acceptedKeys) {
      if (Array.isArray(value[key])) {
        return value[key];
      }
    }

    for (const valueItem of Object.values(value)) {
      const found = search(valueItem);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const rows = search(source);
  if (!rows) {
    throw new Error(`The response is missing the ${listLabel} list.`);
  }
  return rows;
}

function getOptionId(option) {
  return (
    option.id ??
    option.value ??
    option.financialYearId ??
    option.financial_year_id ??
    option.departmentId ??
    option.department_id
  );
}

function getOptionLabel(option) {
  return (
    option.name ??
    option.label ??
    option.title ??
    option.financialYearName ??
    option.financial_year_name ??
    option.financialYear ??
    option.departmentName ??
    option.department_name ??
    option.department ??
    option.year
  );
}

function mapOptions(rows, listLabel) {
  return rows.map((option, index) => {
    const id = getOptionId(option);
    const label = getOptionLabel(option);
    if (id === undefined || id === null || label === undefined || label === null) {
      throw new Error(
        `The ${listLabel} option at position ${index + 1} is missing its id or name.`
      );
    }
    return { value: String(id), label: String(label) };
  });
}

function mapSchemeRows(rows) {
  return rows.map((row, index) => {
    const id = row.id ?? row.autoNumberSchemeId ?? row.auto_number_scheme_id;
    if (id === undefined || id === null) {
      throw new Error(
        `The auto number scheme at position ${index + 1} is missing its id.`
      );
    }

    const rawStatus =
      row.isActive ?? row.is_active ?? row.active ?? row.status ?? true;
    return {
      ...row,
      id,
      prefix: row.prefix ?? "",
      startingNo: row.startingNo ?? row.starting_no ?? "",
      startingNoStr:
        row.startingNoStr ??
        row.starting_no_str ??
        String(row.startingNo ?? row.starting_no ?? ""),
      currentNumber:
        row.lastNo ??
        row.last_no ??
        row.currentNumber ??
        row.currentNo ??
        row.currentNoStr ??
        "",
      financialYearName:
        row.financialYearName ?? row.financial_year_name ?? "",
      departmentName:
        row.departmentName ?? row.department_name ?? "",
      postfix: row.postfix ?? "",
      financialYearId:
        row.financialYearId ??
        row.financial_year_id ??
        row.financialYearName ??
        row.financial_year_name ??
        "",
      departmentId:
        row.departmentId ??
        row.department_id ??
        row.departmentName ??
        row.department_name ??
        "",
      active:
        rawStatus === true ||
        rawStatus === 1 ||
        ["true", "1", "active"].includes(String(rawStatus).toLowerCase()),
    };
  });
}

function AutoNumberSchemeList() {
  const showToast = useToast();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const requestSequence = useRef(0);

  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const requestId = ++requestSequence.current;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await employeeSetupApi.getAutoNumberSchemes({
          fts: search.trim(),
        });
        if (requestId !== requestSequence.current) {
          return;
        }

        const payload = getPayload(response);
        const schemeRows = findArray(
          payload,
          [
            "autoNumberSchemeList",
          ],
          "auto number scheme"
        );
        const financialYearRows = findArray(
          payload,
          ["financialYearList", "financial_year_list"],
          "financial year"
        );
        const departmentRows = findArray(
          payload,
          ["departmentList", "department_list"],
          "department"
        );

        const mappedSchemes = mapSchemeRows(schemeRows);
        const mappedFinancialYears = mapOptions(
          financialYearRows,
          "financial year"
        );
        const mappedDepartments = mapOptions(departmentRows, "department");
        const schemesWithOptionIds = mappedSchemes.map((scheme) => ({
          ...scheme,
          financialYearId:
            mappedFinancialYears.find(
              (option) =>
                option.label === String(scheme.financialYearId) ||
                option.label === scheme.financialYearName
            )?.value ?? scheme.financialYearId,
          departmentId:
            mappedDepartments.find(
              (option) =>
                option.label === String(scheme.departmentId) ||
                option.label === scheme.departmentName
            )?.value ?? scheme.departmentId,
        }));
        setItems(schemesWithOptionIds);
        setFinancialYearOptions(mappedFinancialYears);
        setDepartmentOptions(mappedDepartments);
      } catch (error) {
        if (requestId === requestSequence.current) {
          showToast(getApiErrorMessage(error), "error");
        }
      } finally {
        if (requestId === requestSequence.current) {
          setIsLoading(false);
        }
      }
    }, search ? 300 : 0);

    return () => {
      window.clearTimeout(timeoutId);
      requestSequence.current += 1;
    };
  }, [reloadKey, search, showToast]);

  const closeForm = () => {
    if (!isSaving) {
      setIsFormOpen(false);
      setEditingItem(null);
      setForm(EMPTY_FORM);
    }
  };

  useEffect(() => {
    if (!isFormOpen) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        setIsFormOpen(false);
        setEditingItem(null);
        setForm(EMPTY_FORM);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen, isSaving]);

  const openAddForm = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setForm({
      prefix: String(item.prefix ?? ""),
      startingNo: String(item.startingNo ?? item.startingNoStr ?? ""),
      postfix: String(item.postfix ?? ""),
      financialYearId: String(item.financialYearId ?? ""),
      departmentId: String(item.departmentId ?? ""),
    });
    setIsFormOpen(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const startingNo = form.startingNo.trim();
    const startingNoValue = Number(startingNo);
    if (!Number.isInteger(startingNoValue) || startingNoValue < 0) {
      showToast("Starting number must be a non-negative whole number.", "error");
      return;
    }

    const payload = {
      id: editingItem?.id ?? null,
      prefix: form.prefix.trim(),
      startingNo,
      postfix: form.postfix.trim(),
      financialYearId: Number(form.financialYearId),
      departmentId: Number(form.departmentId),
    };

    setIsSaving(true);
    try {
      const response = await employeeSetupApi.saveAutoNumberScheme(payload);
      if (response?.status === false) {
        throw new Error(response.message || "Unable to save auto number scheme.");
      }
      showToast(
        `Auto number scheme ${editingItem ? "updated" : "created"} successfully.`
      );
      closeForm();
      setReloadKey((current) => current + 1);
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (item) => {
    setDeletingId(item.id);
    try {
      const response = await employeeSetupApi.deleteAutoNumberScheme(item.id);
      if (response?.status === false) {
        throw new Error(response.message || "Unable to delete auto number scheme.");
      }
      setItems((current) => current.filter((scheme) => scheme.id !== item.id));
      showToast("Auto number scheme deleted successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (item) => {
    setUpdatingStatusId(item.id);
    try {
      const response = await employeeSetupApi.updateAutoNumberSchemeStatus({
        id: item.id,
        isActive: !item.active,
      });
      if (response?.status === false) {
        throw new Error(
          response.message || "Unable to update auto number scheme status."
        );
      }
      setItems((current) =>
        current.map((scheme) =>
          scheme.id === item.id ? { ...scheme, active: !scheme.active } : scheme
        )
      );
      showToast(
        `Auto number scheme ${item.active ? "deactivated" : "activated"} successfully.`
      );
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const columns = [
    { key: "prefix", label: "Prefix" },
    { key: "startingNoStr", label: "Starting Number" },
    { key: "currentNumber", label: "Current Number" },
    { key: "postfix", label: "Postfix" },
    {
      key: "financialYearId",
      label: "Financial Year",
      render: (item) =>
        (item.financialYearName ||
          financialYearOptions.find(
            (option) => option.value === String(item.financialYearId)
          )?.label) ??
        item.financialYearId,
    },
    {
      key: "departmentId",
      label: "Department",
      render: (item) =>
        (item.departmentName ||
          departmentOptions.find(
            (option) => option.value === String(item.departmentId)
          )?.label) ??
        item.departmentId,
    },
    {
      key: "active",
      label: "Status",
      className: "setup-status-column",
      render: (item) => (
        <span className={`setup-status${item.active ? "" : " is-inactive"}`}>
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];
  const actions = [
    { label: "Edit", icon: Pencil, onClick: openEditForm },
    {
      key: "toggle-status",
      labelForRow: (item) => `Mark as ${item.active ? "Inactive" : "Active"}`,
      icon: Power,
      disabled: (item) => updatingStatusId === item.id,
      onClick: toggleStatus,
    },
    {
      label: "Delete",
      icon: Trash2,
      disabled: (item) => deletingId === item.id,
      onClick: deleteItem,
    },
  ];

  return (
    <div className="auto-number-scheme-page">
      <Breadcrumb
        items={[
          {
            label: "Employee Management",
            path: "/employee-information/employeeslist",
          },
          { label: "Setup", path: "/employee-information/setup" },
          { label: "Auto Number Scheme" },
        ]}
      />

      <SetupTable
        tableLabel="Employee auto number schemes"
        rows={items}
        columns={columns}
        search={search}
        searchLabel="Search auto number schemes"
        onSearchChange={setSearch}
        selectable={false}
        actions={actions}
        isLoading={isLoading}
        emptyMessage="No auto number schemes configured yet."
        filteredEmptyMessage="No auto number schemes match your search."
        addActionPlacement="start"
        addAction={
          <button
            type="button"
            className="setup-add-button auto-number-scheme-add-button"
            onClick={openAddForm}
          >
            <Plus size={16} aria-hidden="true" />
            Add
          </button>
        }
      />

      {isFormOpen && (
        <div
          className="auto-scheme-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className="auto-scheme-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auto-scheme-title"
          >
            <header className="auto-scheme-drawer-header">
              <h2 id="auto-scheme-title">
                {editingItem ? "Edit Auto Number Scheme" : "Add Auto Number Scheme"}
              </h2>
              <button
                className="auto-scheme-close"
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </header>

            <form onSubmit={handleSave}>
              <div className="auto-scheme-form-body">
                <label className="auto-scheme-field">
                  <span>Prefix</span>
                  <input
                    autoFocus
                    required
                    value={form.prefix}
                    onChange={(event) => updateField("prefix", event.target.value)}
                    maxLength={50}
                  />
                </label>
                <label className="auto-scheme-field">
                  <span>Starting Number</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.startingNo}
                    onChange={(event) =>
                      updateField("startingNo", event.target.value)
                    }
                  />
                </label>
                <label className="auto-scheme-field">
                  <span>Postfix</span>
                  <input
                    value={form.postfix}
                    onChange={(event) => updateField("postfix", event.target.value)}
                    maxLength={50}
                  />
                </label>
                <label className="auto-scheme-field">
                  <span>Financial Year</span>
                  <select
                    required
                    value={form.financialYearId}
                    onChange={(event) =>
                      updateField("financialYearId", event.target.value)
                    }
                  >
                    <option value="">Select financial year</option>
                    {financialYearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="auto-scheme-field">
                  <span>Department</span>
                  <select
                    required
                    value={form.departmentId}
                    onChange={(event) =>
                      updateField("departmentId", event.target.value)
                    }
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <footer className="auto-scheme-form-actions">
                <button
                  className="auto-scheme-cancel"
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="auto-scheme-save"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default AutoNumberSchemeList;
