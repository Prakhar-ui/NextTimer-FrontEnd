const taskFormFields = [
  {
    label: "Task Name",
    as: "input",
    type: "text",
    name: "taskName",
    required: true,
  },
  {
    label: "Task Description",
    as: "textarea",
    name: "taskDescription",
    rows: 2,
    maxLength: 150,
    required: true,
  },
  {
    label: "Hours",
    as: "input",
    type: "number",
    name: "hours",
    min: "0",
    required: true,
  },
  {
    label: "Minutes",
    as: "input",
    type: "number",
    name: "minutes",
    min: "0",
    max: "59",
    required: true,
  },
  {
    label: "Seconds",
    as: "input",
    type: "number",
    name: "seconds",
    min: "0",
    max: "59",
    required: true,
  },
];

export default taskFormFields;
