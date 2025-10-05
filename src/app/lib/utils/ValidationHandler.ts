type ValidationResult = {
  validationSuccess: boolean;
  msg: string;
};

export const validateObj = <T extends object>(
  obj: T,
  exception: (keyof T)[],
): ValidationResult => {
  for (const key in obj) {
    const value = obj[key as keyof T];

    if (typeof value !== "object" || value === null) {
      if (!value && !exception.includes(key as keyof T)) {
        return { validationSuccess: false, msg: key };
      }
    } else {
      const objChild = value as Record<string, unknown>;
      for (const secKey in objChild) {
        const nestedVal = objChild[secKey];
        if (!nestedVal && !exception.includes(key as keyof T)) {
          return { validationSuccess: false, msg: key };
        }
      }
    }
  }

  return { validationSuccess: true, msg: "ALL OBJECT IS VALID" };
};
