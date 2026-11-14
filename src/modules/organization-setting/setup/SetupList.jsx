import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Plus,
  Power,
  Trash2,
} from "lucide-react";
import {
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb/Breadcrumb";
import { organizationSetupApi } from "../../../api/organization/organizationSetupApi";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { useToast } from "../../../components/common/Toast/useToast";
import SetupTable from "../../../components/common/SetupTable/SetupTable";
import { ORGANIZATION_SETUP_TYPES } from "./setupConfig";
import "./Setup.css";

function getRows(response) {
  if (response?.status === false) {
    throw new Error(response.message || "Unable to load setup items.");
  }

  const rows =
    response?.data?.data_array ??
    response?.data_array ??
    response?.data?.dataArray ??
    response?.dataArray ??
    response?.data?.data ??
    response?.data;

  if (!Array.isArray(rows)) {
    throw new Error("The setup list response does not contain a dataArray.");
  }

  return rows.map((row) => {
    const rawStatus =
      row.is_active ?? row.status ?? row.active ?? row.isActive ?? true;
    const active =
      rawStatus === true ||
      rawStatus === 1 ||
      ["active", "true", "1"].includes(String(rawStatus).toLowerCase());

    return { ...row, id: row.id, name: row.name, active };
  });
}

function SetupList() {
  const { setupType } = useParams();
  const navigate = useNavigate();
  const setup = ORGANIZATION_SETUP_TYPES[setupType];
  const apiType = setup?.apiType;
  const showToast = useToast();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusIds, setUpdatingStatusIds] = useState(() => new Set());
  const [reloadKey, setReloadKey] = useState(0);
  const requestSequence = useRef(0);
  const notifiedUnavailableType = useRef(null);

  useEffect(() => {
    if (!apiType) {
      setItems([]);
      setIsLoading(false);
      return undefined;
    }

    const requestId = ++requestSequence.current;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await organizationSetupApi.getAll(
          apiType,
          search.trim()
        );
        if (requestId === requestSequence.current) {
          setItems(getRows(response));
          setSelectedItems([]);
        }
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
  }, [apiType, search, reloadKey, showToast]);

  useEffect(() => {
    if (setup && !apiType) {
      if (notifiedUnavailableType.current === setupType) {
        return;
      }
      notifiedUnavailableType.current = setupType;
      showToast(
        "The backend does not provide an API for this setup type yet.",
        "error"
      );
    } else {
      notifiedUnavailableType.current = null;
    }
  }, [apiType, setup, setupType, showToast]);

  if (!setup) {
    return <Navigate to="/organization-settings" replace />;
  }

  const rows = items;
  const allVisibleSelected =
    rows.length > 0 && rows.every((item) => selectedItems.includes(item.id));

  const toggleAll = () => {
    setSelectedItems((current) =>
      allVisibleSelected
        ? current.filter((id) => !rows.some((item) => item.id === id))
        : [
            ...new Set([
              ...current,
              ...rows.map((item) => item.id),
            ]),
          ]
    );
  };

  const saveItem = async (item) => {
    if (!apiType) {
      throw new Error("This setup type has no backend API configured.");
    }

    const response = await organizationSetupApi.save(apiType, item);
    if (response.status === false) {
      throw new Error(response.message || "Unable to save setup item.");
    }
    setReloadKey((current) => current + 1);
  };

  const deleteItems = async (ids) => {
    setIsDeleting(true);
    try {
      const response = await organizationSetupApi.delete(apiType, ids);
      if (response.status === false) {
        throw new Error(response.message || "Unable to delete setup item.");
      }
      setSelectedItems([]);
      setReloadKey((current) => current + 1);
      showToast(
        Array.isArray(ids)
          ? `${ids.length} item${ids.length === 1 ? "" : "s"} deleted successfully.`
          : "Item deleted successfully."
      );
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleItemStatus = async (item) => {
    if (!apiType) {
      showToast("This setup type has no backend API configured.", "error");
      return;
    }

    setUpdatingStatusIds((current) => new Set(current).add(item.id));
    try {
      const nextIsActive = !item.active;
      const response = await organizationSetupApi.updateStatus(
        apiType,
        item.id,
        nextIsActive
      );
      if (response.status === false) {
        throw new Error(response.message || "Unable to update setup status.");
      }
      setReloadKey((current) => current + 1);
      showToast(
        `${setup.title} ${nextIsActive ? "activated" : "deactivated"} successfully.`
      );
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setUpdatingStatusIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  };

  const editItem = (item) => {
    navigate("add", { state: { item } });
  };

  const outletContext = { saveItem };
  const columns = [
    { key: "name", label: setup.nameLabel },
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
    {
      label: "Edit",
      icon: Pencil,
      onClick: editItem,
    },
    {
      labelForRow: (item) => `Mark as ${item.active ? "Inactive" : "Active"}`,
      icon: Power,
      disabled: (item) => updatingStatusIds.has(item.id),
      onClick: toggleItemStatus,
    },
    {
      label: "Delete",
      icon: Trash2,
      disabled: () => isDeleting,
      onClick: (item) => deleteItems(item.id),
    },
  ];

  return (
    <div className="setup-page">
      <Breadcrumb
        items={[
          { label: "Organization Settings", path: "/organization-settings" },
          { label: setup.title },
        ]}
      />

      <SetupTable
        tableLabel={`${setup.title} list`}
        rows={rows}
        columns={columns}
        search={search}
        searchLabel={`Search ${setup.title.toLowerCase()}`}
        onSearchChange={setSearch}
        selectedIds={selectedItems}
        onToggleRow={(id) =>
          setSelectedItems((current) =>
            current.includes(id)
              ? current.filter((selectedId) => selectedId !== id)
              : [...current, id]
          )
        }
        onToggleAll={toggleAll}
        isLoading={isLoading}
        emptyMessage={`No ${setup.title.toLowerCase()}s found.`}
        filteredEmptyMessage={`No ${setup.title.toLowerCase()}s match your search.`}
        actions={actions}
        onBulkDelete={deleteItems}
        isDeleting={isDeleting}
        addAction={
          <Link
            to="add"
            className="setup-add-button"
            aria-label={`Add ${setup.title}`}
            onClick={(event) => {
              if (!setup.apiType) {
                event.preventDefault();
                showToast(
                  "The backend does not provide an API for this setup type yet.",
                  "error"
                );
              }
            }}
          >
            <Plus size={16} />
            Add
          </Link>
        }
      />

      <Outlet context={outletContext} />
    </div>
  );
}

export function useSetupList() {
  return useOutletContext();
}

export default SetupList;
