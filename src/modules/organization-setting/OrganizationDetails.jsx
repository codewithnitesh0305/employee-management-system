import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Button from "../../components/forms/Button";
import ImageUpload from "../../components/forms/ImageUpload";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import { organizationApi } from "../../api/organization/organizationApi";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../components/common/Toast/useToast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import "./OrganizationDetails.css";

const EMPTY_FORM = {
  id: "",
  name: "",
  code: "",
  affiliationNo: "",
  contactCode: "+91",
  contactNo: "",
  emailId: "",
  currencyId: "",
  webSiteUrl: "",
  isMoreBranch: false,
  address: "",
  countryId: "",
  stateId: "",
  cityId: "",
  pinCode: "",
  faceBookUrl: "",
  instagramUrl: "",
  youTubeUrl: "",
  linkedInUrl: "",
  xUrl: "",
};

function unwrapData(response) {
  if (response?.status === false || response?.success === false) {
    throw new Error(response.message || "The server rejected the request.");
  }

  let data = response?.data;
  while (
    data &&
    !Array.isArray(data) &&
    typeof data === "object" &&
    Object.hasOwn(data, "data")
  ) {
    data = data.data;
  }

  return data;
}

function mapOrganization(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The organization response does not contain organization details.");
  }

  return Object.fromEntries(
    Object.keys(EMPTY_FORM).map((key) => {
      const value = key === "xUrl" ? data.xUrl ?? data.xurl : data[key];
      return [key, value === null || value === undefined ? "" : String(value)];
    })
  );
}

function isOptionRows(value, labelKeys) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (row) =>
        row &&
        typeof row === "object" &&
        getOptionId(row) !== null &&
        getOptionId(row) !== undefined &&
        getOptionName(row, labelKeys) !== undefined
    )
  );
}

function getOptionId(row) {
  return (
    row.id ??
    row.countryId ??
    row.country_id ??
    row.stateId ??
    row.state_id ??
    row.cityId ??
    row.city_id
  );
}

function getOptionName(row, labelKeys) {
  return [
    ...labelKeys,
    "name",
    "label",
    "countryName",
    "country_name",
    "currencyName",
    "currency_name",
    "stateName",
    "state_name",
    "cityName",
    "city_name",
  ]
    .map((key) => row[key])
    .find((value) => typeof value === "string" && value.trim());
}

function mapOptions(source, labelKeys = ["name"], listKeys = [], listName = "options") {
  const rows = findOptionRows(source, listKeys, labelKeys);

  if (!Array.isArray(rows)) {
    throw new Error(`The organization response is missing the ${listName} list.`);
  }

  return rows.map((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error(`The ${listName} option at position ${index + 1} is invalid.`);
    }

    const id = getOptionId(row);
    const name = getOptionName(row, labelKeys);
    if (id === null || id === undefined || name === undefined) {
      const missingFields = [
        id === null || id === undefined ? "id" : null,
        name === undefined ? "name" : null,
      ].filter(Boolean);
      throw new Error(
        `The ${listName} option at position ${index + 1} is missing ${missingFields.join(" and ")}.`
      );
    }

    return {
      label: name,
      value: String(id),
      ...(row.countryCode || row.country_code
        ? { code: String(row.countryCode ?? row.country_code) }
        : {}),
    };
  });
}

function findOptionRows(source, listKeys, labelKeys, depth = 0) {
  if (Array.isArray(source)) {
    return source.length === 0 || isOptionRows(source, labelKeys)
      ? source
      : null;
  }
  if (!source || typeof source !== "object" || depth > 4) {
    return null;
  }

  const namedListKeys = [
    ...listKeys,
    "countryList",
    "country_list",
    "currencyList",
    "currency_list",
    "stateList",
    "state_list",
    "cityList",
    "city_list",
    "allStates",
    "all_states",
    "allCities",
    "all_cities",
    "data_array",
    "dataArray",
    "dataList",
    "data_list",
    "list",
    "rows",
  ];
  for (const key of namedListKeys) {
    if (Array.isArray(source[key])) {
      return source[key];
    }
  }

  const envelopeKeys = [
    "data",
    "result",
    "content",
  ];
  for (const key of envelopeKeys) {
    const rows = findOptionRows(source[key], listKeys, labelKeys, depth + 1);
    if (rows) {
      return rows;
    }
  }

  for (const [key, value] of Object.entries(source)) {
    if (!namedListKeys.includes(key) && !envelopeKeys.includes(key)) {
      const rows = findOptionRows(value, [], labelKeys, depth + 1);
      if (rows) {
        return rows;
      }
    }
  }

  return null;
}

function appendFormValue(formData, key, value) {
  if (value !== null && value !== undefined) {
    formData.append(key, String(value));
  }
}

function OrganizationDetails() {
  const { user } = useAuth();
  const showToast = useToast();
  const organizationId = user?.organization?.organizationId;
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [organizationLogo, setOrganizationLogo] = useState(null);
  const [savedLogo, setSavedLogo] = useState(null);
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [states, setStates] = useState([]);
  const [savedStates, setSavedStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const loadSequence = useRef(0);
  const stateSequence = useRef(0);
  const citySequence = useRef(0);

  useEffect(() => {
    const requestId = ++loadSequence.current;
    let isCurrent = true;

    const loadOrganization = async () => {
      setIsLoaded(false);
      if (organizationId === null || organizationId === undefined) {
        setIsLoading(false);
        showToast("Organization ID is missing from the login details.", "error");
        return;
      }

      setIsLoading(true);
      try {
        const organizationResponse =
          await organizationApi.getOrganizationById(organizationId);

        if (!isCurrent || requestId !== loadSequence.current) return;

        const organizationData = unwrapData(organizationResponse);
        const organizationForm = mapOrganization(organizationData);
        const referenceDataMap = organizationData?.referenceDataMap ?? organizationData?.reference_data_map ?? organizationData?.referenceData ?? organizationData;
        if (!referenceDataMap ||typeof referenceDataMap !== "object" ||
          Array.isArray(referenceDataMap)) {
          throw new Error("The organization response is missing its reference data.");
        }
        const loadedCountries = mapOptions(
          referenceDataMap,
          ["countryName", "country_name", "name"],
          ["countryList", "country_list"],
          "country"
        );
        const loadedCurrencies = mapOptions(
          referenceDataMap,
          ["name", "currencyName", "currency_name"],
          ["currencyList", "currency_list"],
          "currency"
        );

        const [statesResponse, citiesResponse] = await Promise.all([
          organizationForm.countryId ? organizationApi.getStatesByCountry(organizationForm.countryId)
            : Promise.resolve(null),
          organizationForm.stateId
            ? organizationApi.getCitiesByState(organizationForm.stateId)
            : Promise.resolve(null),
        ]);

        if (!isCurrent || requestId !== loadSequence.current) return;
        setForm(organizationForm);
        setSavedForm(organizationForm);
        const loadedLogo = organizationData?.organizationImage
          ? { url: organizationData.organizationImage }
          : null;
        setOrganizationLogo(loadedLogo);
        setSavedLogo(loadedLogo);
        setIsLogoChanged(false);
        setCountries(loadedCountries);
        setCurrencies(loadedCurrencies);
        const loadedStates = statesResponse
          ? mapOptions(
              unwrapData(statesResponse),
              ["name", "stateName", "state_name"],
              ["states", "allStates", "all_states", "stateList", "state_list"],
              "state"
            )
          : [];
        const loadedCities = citiesResponse
          ? mapOptions(
              unwrapData(citiesResponse),
              ["name", "cityName", "city_name"],
              ["cities", "allCities", "all_cities", "cityList", "city_list"],
              "city"
            )
          : [];
        setStates(loadedStates);
        setSavedStates(loadedStates);
        setCities(loadedCities);
        setSavedCities(loadedCities);
        setIsLoaded(true);
      } catch (error) {
        if (isCurrent && requestId === loadSequence.current) {
          showToast(getApiErrorMessage(error), "error");
        }
      } finally {
        if (isCurrent && requestId === loadSequence.current) {
          setIsLoading(false);
        }
      }
    };

    loadOrganization();
    return () => {
      isCurrent = false;
      loadSequence.current += 1;
    };
  }, [organizationId, loadAttempt, showToast]);

  const stateOptions = states;
  const cityOptions = cities;
  const contactCodeOptions = useMemo(() => {
    const countryCodes = countries
      .filter((country) => country.code)
      .map((country) => ({ label: country.code, value: country.code }));
    if (
      form.contactCode &&
      !countryCodes.some((option) => option.value === form.contactCode)
    ) {
      countryCodes.push({ label: form.contactCode, value: form.contactCode });
    }
    return countryCodes;
  }, [countries, form.contactCode]);

  const handleCountryChange = async (countryId) => {
    const requestId = ++stateSequence.current;
    citySequence.current += 1;
    setForm((current) => ({
      ...current,
      countryId,
      stateId: "",
      cityId: "",
    }));
    setStates([]);
    setCities([]);
    setIsLoadingCities(false);

    if (!countryId) {
      setIsLoadingStates(false);
      return;
    }

    setIsLoadingStates(true);
    try {
      const response = await organizationApi.getStatesByCountry(countryId);
      if (requestId === stateSequence.current) {
        setStates(
          mapOptions(
            unwrapData(response),
            ["name", "stateName", "state_name"],
            ["states", "allStates", "all_states", "stateList", "state_list"],
            "state"
          )
        );
      }
    } catch (error) {
      if (requestId === stateSequence.current) {
        showToast(getApiErrorMessage(error), "error");
      }
    } finally {
      if (requestId === stateSequence.current) {
        setIsLoadingStates(false);
      }
    }
  };

  const handleStateChange = async (stateId) => {
    const requestId = ++citySequence.current;
    setForm((current) => ({ ...current, stateId, cityId: "" }));
    setCities([]);

    if (!stateId) {
      setIsLoadingCities(false);
      return;
    }

    setIsLoadingCities(true);
    try {
      const response = await organizationApi.getCitiesByState(stateId);
      if (requestId === citySequence.current) {
        setCities(
          mapOptions(
            unwrapData(response),
            ["name", "cityName", "city_name"],
            ["cities", "allCities", "all_cities", "cityList", "city_list"],
            "city"
          )
        );
      }
    } catch (error) {
      if (requestId === citySequence.current) {
        showToast(getApiErrorMessage(error), "error");
      }
    } finally {
      if (requestId === citySequence.current) {
        setIsLoadingCities(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleLogoChange = (value) => {
    setOrganizationLogo(value);
    setIsLogoChanged(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.id ||
      !form.name.trim() ||
      !form.code.trim() ||
      !form.affiliationNo.trim() ||
      !form.contactCode.trim() ||
      !form.contactNo.trim() ||
      !form.emailId.trim() ||
      !form.currencyId ||
      !form.address.trim() ||
      !form.countryId ||
      !form.stateId ||
      !form.cityId ||
      !/^\d{6}$/.test(form.pinCode)
    ) {
      showToast(
        "Complete all required organization fields. The PIN code must contain 6 digits.",
        "error"
      );
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      appendFormValue(payload, key, value);
    });
    appendFormValue(payload, "isChange", isLogoChanged);
    if (organizationLogo?.file) {
      payload.append("file", organizationLogo.file);
    }

    setIsSaving(true);
    try {
      const response = await organizationApi.saveUpdateOrganization(payload);
      const result = unwrapData(response);
      const savedOrganization = result;
      if (savedOrganization && typeof savedOrganization === "object") {
        const updatedForm = {
          ...form,
          ...Object.fromEntries(
            Object.keys(EMPTY_FORM)
              .filter((key) => savedOrganization[key] !== undefined)
              .map((key) => [
                key,
                String(
                  (key === "xUrl"
                    ? savedOrganization.xUrl ?? savedOrganization.xurl
                    : savedOrganization[key]) ?? ""
                ),
              ])
          ),
        };
        setForm(updatedForm);
        setSavedForm(updatedForm);
        let nextLogo = organizationLogo;
        if (savedOrganization.organizationImage) {
          nextLogo = { url: savedOrganization.organizationImage };
        } else if (organizationLogo?.previewUrl) {
          nextLogo = { url: organizationLogo.previewUrl };
        }
        if (
          savedLogo?.url?.startsWith("blob:") &&
          savedLogo.url !== organizationLogo?.previewUrl
        ) {
          URL.revokeObjectURL(savedLogo.url);
        }
        setOrganizationLogo(nextLogo);
        setSavedLogo(nextLogo);
      } else {
        setSavedForm(form);
        const nextLogo = organizationLogo?.previewUrl
          ? { url: organizationLogo.previewUrl }
          : organizationLogo;
        if (
          savedLogo?.url?.startsWith("blob:") &&
          savedLogo.url !== organizationLogo?.previewUrl
        ) {
          URL.revokeObjectURL(savedLogo.url);
        }
        setOrganizationLogo(nextLogo);
        setSavedLogo(nextLogo);
      }
      setSavedStates(states);
      setSavedCities(cities);
      setIsLogoChanged(false);
      showToast(response.message || "Organization details saved successfully.");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    stateSequence.current += 1;
    citySequence.current += 1;
    setForm(savedForm);
    setStates(savedStates);
    setCities(savedCities);
    setIsLoadingStates(false);
    setIsLoadingCities(false);
    setIsLogoChanged(false);
    setOrganizationLogo((current) => {
      if (
        current?.previewUrl &&
        current.previewUrl !== savedLogo?.previewUrl
      ) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return savedLogo;
    });
  };

  if (isLoading) {
    return (
      <div className="organization-details-page">
        <Breadcrumb
          items={[
            { label: "Organization Settings", path: "/organization-settings" },
            { label: "Organization Details" },
          ]}
        />
        <div className="organization-loading" role="status">
          <LoaderCircle size={18} className="organization-loading-icon" />
          Loading organization details...
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="organization-details-page">
        <Breadcrumb
          items={[
            { label: "Organization Settings", path: "/organization-settings" },
            { label: "Organization Details" },
          ]}
        />
        <div className="organization-load-failed">
          <span>Organization details could not be loaded.</span>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-details-page">
      <Breadcrumb
        items={[
          { label: "Organization Settings", path: "/organization-settings" },
          { label: "Organization Details" },
        ]}
      />

      <form className="organization-form-card" onSubmit={handleSubmit}>
        <div className="organization-general-grid">
          <div className="organization-logo-column">
            <ImageUpload
              label="Organization Logo"
              value={organizationLogo}
              onChange={handleLogoChange}
            />
          </div>

          <div className="organization-fields-grid">
            <Input
              label="Organization Name"
              required
              placeholder="Enter Organization Name"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
            <Input
              label="Organization Code"
              required
              placeholder="Enter Organization Code"
              value={form.code}
              onChange={(event) => handleChange("code", event.target.value)}
            />
            <Input
              label="Affiliation No."
              required
              placeholder="Enter Affiliation No."
              value={form.affiliationNo}
              onChange={(event) =>
                handleChange("affiliationNo", event.target.value)
              }
            />

            <div className="form-field">
              <label>
                Contact No.
                <Required />
              </label>
              <div className="input-group">
                <div className="country-code-input">
                  <Select
                    clearable={false}
                    value={form.contactCode}
                    options={contactCodeOptions}
                    onChange={(value) => handleChange("contactCode", value)}
                  />
                </div>
                <Input
                  required
                  type="tel"
                  placeholder="Enter Contact No."
                  value={form.contactNo}
                  onChange={(event) =>
                    handleChange("contactNo", event.target.value)
                  }
                />
              </div>
            </div>

            <Input
              label="Email ID"
              required
              type="email"
              placeholder="Enter Email ID"
              value={form.emailId}
              onChange={(event) => handleChange("emailId", event.target.value)}
            />
            <Select
              id="organization-currency"
              label="Currency"
              required
              searchable
              placeholder="Select Currency"
              value={form.currencyId}
              options={currencies}
              onChange={(value) => handleChange("currencyId", value)}
            />
            <Input
              label="Website URL"
              type="url"
              placeholder="Enter Website URL"
              value={form.webSiteUrl}
              onChange={(event) =>
                handleChange("webSiteUrl", event.target.value)
              }
            />
            <div className="form-field">
              <label>Do you have more than one branch?</label>
              <ToggleSwitch
                checked={form.isMoreBranch === "true"}
                onChange={(checked) =>
                  handleChange("isMoreBranch", String(checked))
                }
              />
            </div>
          </div>
        </div>

        <FormSection title="Address Details">
          <div className="four-column-grid">
            <Input
              label="Address"
              required
              placeholder="Enter Address"
              value={form.address}
              onChange={(event) => handleChange("address", event.target.value)}
            />
            <Select
              id="organization-country"
              searchable
              label="Country"
              required
              placeholder="Select Country"
              value={form.countryId}
              options={countries}
              onChange={handleCountryChange}
            />
            <Select
              id="organization-state"
              searchable
              label="State"
              required
              placeholder={isLoadingStates ? "Loading states..." : "Select State"}
              value={form.stateId}
              options={stateOptions}
              disabled={!form.countryId || isLoadingStates}
              onChange={handleStateChange}
            />
            <Select
              id="organization-city"
              searchable
              label="City"
              required
              placeholder={isLoadingCities ? "Loading cities..." : "Select City"}
              value={form.cityId}
              options={cityOptions}
              disabled={!form.stateId || isLoadingCities}
              onChange={(value) => handleChange("cityId", value)}
            />
            <Input
              label="PIN/ZIP Code"
              required
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Enter 6-digit PIN/ZIP Code"
              value={form.pinCode}
              onChange={(event) =>
                handleChange("pinCode", event.target.value.replace(/\D/g, ""))
              }
            />
          </div>
        </FormSection>

        <FormSection title="Social Media Links">
          <div className="four-column-grid">
            <Input
              label="Facebook URL"
              type="url"
              placeholder="https://www.facebook.com/username"
              value={form.faceBookUrl}
              onChange={(event) =>
                handleChange("faceBookUrl", event.target.value)
              }
            />
            <Input
              label="Instagram URL"
              type="url"
              placeholder="https://www.instagram.com/username"
              value={form.instagramUrl}
              onChange={(event) =>
                handleChange("instagramUrl", event.target.value)
              }
            />
            <Input
              label="YouTube URL"
              type="url"
              placeholder="https://www.youtube.com/@username"
              value={form.youTubeUrl}
              onChange={(event) =>
                handleChange("youTubeUrl", event.target.value)
              }
            />
            <Input
              label="LinkedIn URL"
              type="url"
              placeholder="https://www.linkedin.com/in/username"
              value={form.linkedInUrl}
              onChange={(event) =>
                handleChange("linkedInUrl", event.target.value)
              }
            />
            <Input
              label="X URL"
              type="url"
              placeholder="https://x.com/username"
              value={form.xUrl}
              onChange={(event) => handleChange("xUrl", event.target.value)}
            />
          </div>
        </FormSection>

        <div className="organization-form-actions">
          <Button
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSaving}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="organization-form-section">
      <div className="organization-section-header">{title}</div>
      <div className="organization-section-body">{children}</div>
    </section>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle-switch ${checked ? "toggle-switch-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-switch-thumb" />
    </button>
  );
}

function Required() {
  return <span className="required">*</span>;
}

export default OrganizationDetails;
