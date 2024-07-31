import React from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";


export default function ReusableForm({ fields, onSubmit }) {
  const handleChange = (e, onChange, fieldType) => {
    switch (fieldType) {
      case "checkbox":
      case "switch":
        onChange(e.target.checked);
        break;
      case "select":
        onChange(e.target.value);
        break;
      default:
        onChange(e.target.value);
    }
  };

  const renderField = (field) => {
    switch (field.as) {
      case "select":
        return (
          <Form.Select
            {...field}
            onChange={(e) => handleChange(e, field.onChange, "select")}
          >
            <option value="" defaultValue>
              {field.placeholder}
            </option>
            {field.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      default:
        return (
          <Form.Control
            {...field}
            onChange={(e) => handleChange(e, field.onChange, "default")}
          />
        );
    }
  };


  return (
    <Form onSubmit={onSubmit}>
      {fields.map((field, index) => (
        <Form.Group key={index} className="mb-3">
          <FloatingLabel
            controlId={field.name}
            label={field.label}
            className="mb-3"
          >
            {renderField(field)}
          </FloatingLabel>
        </Form.Group>
      ))}
      <div className="text-center">
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}
