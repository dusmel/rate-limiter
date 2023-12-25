import fs from 'fs';

const pathToJsonFile = 'src/api/v1/email/email.json';
export const fetchSampleData = () => {
  const rawdata = fs.readFileSync(pathToJsonFile);
  const emails = JSON.parse(rawdata);
  return emails;
};
