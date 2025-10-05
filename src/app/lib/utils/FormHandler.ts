import { Dispatch, SetStateAction } from "react";

type Primitive = string | number | boolean | Blob | Date;
type FormValue = Primitive | FormValue[] | FormObject;

type FormObject = {
  [key: string]: FormValue;
};

export class FormHandler {
  static handleStringInput = <T, K extends keyof T>(
    name: K,
    value: string,
    setter: Dispatch<SetStateAction<T>>,
  ) => {
    setter((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  static handleSelectInput = <T, K extends keyof T>(
    name: K,
    value: string,
    setter: Dispatch<SetStateAction<T>>,
  ) => {
    setter((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  static handleCheckboxInput = <T, K extends keyof T>(
    name: K,
    value: string,
    checked: boolean | string,
    setter: Dispatch<SetStateAction<T>>,
  ) => {
    setter((prevState) => {
      let newValues: string[] = Array.isArray(prevState[name])
        ? prevState[name]
        : [];

      if (checked) {
        if (!newValues.includes(value)) {
          newValues = [...newValues, value];
        }
      } else if (!checked) {
        newValues = newValues.filter((val) => val !== value);
      }

      return {
        ...prevState,
        [name]: newValues,
      };
    });
  };

  static handleFilesInput = <T, K extends keyof T>(
    name: K,
    value: FileList | null,
    multiple: boolean,
    setter: Dispatch<SetStateAction<T>>,
  ) => {
    if (!value || value.length === 0) return;

    setter((prevState) => ({
      ...prevState,
      [name]: multiple ? value : value[0],
    }));
  };

  static appendFormInputs = <T extends object>(
    formData: FormData,
    objectToAppend: T,
    parentKey?: string,
  ): void => {
    for (const [key, value] of Object.entries(objectToAppend)) {
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof Blob) {
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            FormHandler.appendFormInputs(formData, item as object, formKey);
          } else {
            formData.append(formKey, String(item));
          }
        });
      } else if (value instanceof Date) {
        formData.append(formKey, value.toISOString());
      } else if (typeof value === "object" && value !== null) {
        FormHandler.appendFormInputs(formData, value as object, formKey);
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        formData.append(formKey, String(value));
      }
    }
  };

  static createFileList = (files: File[]) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };
}
