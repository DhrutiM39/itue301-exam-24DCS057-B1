function formatValidationError(err) {
  return {
    error: "Validation failed",
    details: Object.values(err.errors).map(({ path, message }) => ({
      field: path,
      message,
    })),
  };
}

module.exports = { formatValidationError };
