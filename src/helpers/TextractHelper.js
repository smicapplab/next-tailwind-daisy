const {
  FeatureType,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
  TextractClient,
} = require("@aws-sdk/client-textract");

let credentials = {};
if (process.env.EXT_ACCESS_KEY_ID && process.env.EXT_SECRET_ACCESS_KEY) {
  credentials = {
    credentials: {
      accessKeyId: process.env.EXT_ACCESS_KEY_ID,
      secretAccessKey: process.env.EXT_SECRET_ACCESS_KEY,
    },
  };
}

const findValueBlock = (keyId, valueMap, blockMap) => {
  const keyBlock = blockMap[keyId];
  if (!keyBlock.Relationships) return null;
  const valueRelationship = keyBlock.Relationships.find(
    (rel) => rel.Type === "VALUE"
  );
  if (!valueRelationship || !valueRelationship.Ids) return null;
  return valueRelationship.Ids[0]; // Assuming one value per key
};

const getText = (blockId, blockMap) => {
  let text = "";
  const block = blockMap[blockId];
  if (block.Relationships) {
    block.Relationships.forEach((relationship) => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach((childId) => {
          const childBlock = blockMap[childId];
          if (childBlock.BlockType === "WORD") {
            text += `${childBlock.Text} `;
          } else if (childBlock.BlockType === "SELECTION_ELEMENT") {
            if (childBlock.SelectionStatus === "SELECTED") {
              text += `✔ `;
            }
          }
        });
      }
    });
  }
  return text.trim();
};

const removeColonOrSemicolonAtEnd = (str) => {
  return toCamelCase(str.replace(/[:;]$/, '').trim());
}

const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .split(/[\s_\-\.]+/)
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}


const parseForm = (response) => {
  if (!response || !response.Blocks) {
    return;
  }

  const keyMap = {};
  const valueMap = {};
  const blockMap = {};

  response.Blocks.forEach((block) => {
    blockMap[block.Id] = block;
    if (block.BlockType === "KEY_VALUE_SET") {
      if (block.EntityTypes.includes("KEY")) {
        keyMap[block.Id] = block;
      } else {
        valueMap[block.Id] = block;
      }
    }
  });

  // Now, extract the key-value pairs
  const keyValuePairs = {};
  Object.keys(keyMap).forEach((keyId) => {
    const valueId = findValueBlock(keyId, valueMap, blockMap);
    if (valueId) {
      const keyText = removeColonOrSemicolonAtEnd(getText(keyId, blockMap));
      const valueText = getText(valueId, blockMap);
      keyValuePairs[keyText] = valueText;
    }
  });

  return keyValuePairs;
};

const parseTables = (response) => {
  if (!response || !response.Blocks) {
    return;
  }

  const blocks = response.Blocks;
  const tables = [];

  // Filter for table blocks and their children (cells)
  for (const block of blocks) {
    if (block.BlockType === "TABLE") {
      const tableId = block.Id;
      const rows = {};

      if (block.Relationships) {
        for (const relationship of block.Relationships) {
          if (relationship.Type === "CHILD") {
            for (const childId of relationship.Ids) {
              const cell = blocks.find(
                (b) => b.Id === childId && b.BlockType === "CELL"
              );
              if (!cell) continue;

              const rowIndex = cell.RowIndex;
              const colIndex = cell.ColumnIndex;

              // Initialize row array if it doesn't exist
              rows[rowIndex] = rows[rowIndex] || {};
              // Extract text from the cell
              const cellTextBlocks = cell.Relationships
                ? cell.Relationships.flatMap((rel) =>
                    rel.Ids.map((id) =>
                      blocks.find((b) => b.Id === id && b.BlockType === "WORD")
                    )
                  ).filter(Boolean)
                : [];

              const cellText = cellTextBlocks.map((b) => b.Text).join(" ");
              rows[rowIndex][colIndex] = cellText;
            }
          }
        }
      }

      const tableRows = Object.keys(rows)
        .sort((a, b) => a - b)
        .map((rowIndex) => {
          const row = rows[rowIndex];
          return Object.keys(row)
            .sort((a, b) => a - b)
            .map((colIndex) => row[colIndex]);
        });

      tables.push({ tableId, rows: tableRows });
    }
  }

  return tables;
};

const startTextExtractAsync = async ({
  fileName,
  featureTypes = [FeatureType.FORMS, FeatureType.TABLES],
  bucket,
  // queueUrl,
  // queueHandler,
}) => {
  try {
    if (!fileName || !bucket) {
      return {
        success: false,
        message: "fileName and bucket are required",
        fileName,
        bucket,
      };
    }

    let FeatureTypes = featureTypes;
    const client = new TextractClient({
      region: "ap-southeast-1",
      ...credentials,
    });

    const input = {
      DocumentLocation: {
        S3Object: {
          Bucket: bucket,
          Name: fileName,
        },
      },
      FeatureTypes,
    };

    const command = new StartDocumentAnalysisCommand(input);
    const data = await client.send(command);
    // await sendSQSMessage({
    //   queueUrl,
    //   messageBody: {
    //     action: queueHandler,
    //     data: {
    //       jobId: data.JobId,
    //       featureTypes,
    //     },
    //   },
    //   delaySeconds: 240,
    // });

    return data;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error starting text extraction",
      error: err,
    };
  }
};

const getTextExtractAsync = async ({ jobId }) => {
  try {
    const client = new TextractClient({
      region: "ap-southeast-1",
      ...credentials,
    });

    let nextToken = undefined;
    const allBlocks = [];
    do {
      const params = {
        JobId: jobId,
        NextToken: nextToken,
      };

      const command = new GetDocumentAnalysisCommand(params);
      try {
        const response = await client.send(command);
        allBlocks.push(...response.Blocks);
        nextToken = response.NextToken; // Update nextToken for pagination
      } catch (error) {
        console.error("Error getting document analysis:", error);
        return null;
      }
    } while (nextToken);

    const parsedForm = parseForm({ Blocks: allBlocks });
    const parsedTable = parseTables({ Blocks: allBlocks });
    return { parsedTable, parsedForm };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error getting text extraction",
      error: err,
    };
  }
};

module.exports = {
  startTextExtractAsync,
  getTextExtractAsync,
};
