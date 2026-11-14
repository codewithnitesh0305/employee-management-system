import { useState } from "react";
import Button from "../components/forms/Button";
import Input from "../components/forms/Input";
import Select from "../components/forms/Select";
import DatePicker from "../components/forms/DatePicker";
import ImageUpload from "../components/forms/ImageUpload";
import Checkbox from "../components/forms/Checkbox";
import Textarea from "../components/forms/Textarea";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

function ComponentTest() {
  const [date, setDate] = useState(null);
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [checked, setChecked] = useState(false);

  const departments = [
    {
      value: "hr",
      label: "Human Resources",
    },
    {
      value: "it",
      label: "Information Technology",
    },
    {
      value: "finance",
      label: "Finance",
    },
    {
      value: "admin",
      label: "Administration",
    },
  ];

  const genders = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            EMS Design System
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Phase 2 component preview
          </p>
        </div>

        <Card
          title="Form Components"
          description="Reusable components for the EMS application"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Employee Name"
              required
              placeholder="Enter Employee Name"
            />

            <Input
              label="Employee Number"
              type="number"
              placeholder="Enter Employee Number"
            />

            <Select
              label="Gender"
              required
              placeholder="Select Gender"
              options={genders}
              value={gender}
              onChange={setGender}
            />

            <Select
              label="Department"
              required
              searchable
              placeholder="Select Department"
              options={departments}
              value={department}
              onChange={setDepartment}
            />

            <DatePicker
              label="Date of Birth"
              required
              selected={date}
              onChange={setDate}
            />

            <Checkbox
              label="Active Employee"
              checked={checked}
              onChange={(event) =>
                setChecked(event.target.checked)
              }
            />

            <div className="lg:col-span-2">
              <Textarea
                label="Address"
                placeholder="Enter address"
              />
            </div>

            <ImageUpload
              label="Employee Photograph"
              required
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button>
              Save Employee
            </Button>

            <Button variant="secondary">
              Cancel
            </Button>

            <Button variant="outline">
              Edit
            </Button>

            <Button variant="danger">
              Delete
            </Button>

            <Badge variant="primary">
              Active
            </Badge>

            <Badge variant="success">
              Approved
            </Badge>

            <Badge variant="warning">
              Pending
            </Badge>

            <Badge variant="danger">
              Rejected
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ComponentTest;