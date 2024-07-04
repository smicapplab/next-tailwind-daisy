export const CheckLegalRequirement = ({ documents }) => {
  let isPass = documents.length === 0;
  const legalComplianceFlags = [];

  if (documents.includes("Mayor's Permit")) {
    legalComplianceFlags.push({
      docType: "11 Mayor's Permit",
      flag: "document expired",
    });
  }

  if (documents.includes("General Information Sheet (GIS)")) {
    legalComplianceFlags.push({
      docType: "56 General Information Sheet (GIS)",
      flag: "not provided",
    });
  }

  if (documents.includes("SEC Certificate of Registration")) {
    legalComplianceFlags.push({
      docType: "57 SEC Certificate of Registration",
      flag: "not provided",
    });
  }

  if (documents.includes("Articles of Incorporation & By-Laws")) {
    legalComplianceFlags.push({
      docType: "133 Articles of Incorporation & By-Laws",
      flag: "not provided",
    });
  }

  return { isPass, legalComplianceFlags };
};
