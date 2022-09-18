import Http from "../http";

async function getPreferences() {
  const result = await Http().get("preferences");
  return result.data;
}
export {getPreferences};
