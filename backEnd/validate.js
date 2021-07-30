const validate = (data) => {
  console.log(data)
  if (JSON.stringify(data) === "{}" || data === undefined) {
    return false;
  }
  if (
    data.address.streetAddress === "" ||
    data.address.cityName === "" ||
    data.email === "" ||
    data.phoneNumber === "" ||
    data.description === "" ||
    data.address.streetAddress === undefined ||
    data.address.cityName === undefined ||
    data.email === undefined ||
    data.phoneNumber === undefined ||
    data.description === undefined
  ) {
    return false;
  }
  return true;
};

export default validate;
