const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

let credentials = {};
if (process.env.accessKeyId && process.env.secretAccessKey) {
  credentials = {
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
  };
}

const dynamoClient = new DynamoDBClient({
  region: "ap-southeast-1",
  ...credentials,
});

let documentClient = DynamoDBDocumentClient.from(dynamoClient, translateConfig);

export const create = async ({ item, tableName }) => {
  const params = {
    Item: item,
    TableName: tableName,
  };

  try {
    const response = await documentClient.send(new PutCommand(params));
    return response;
  } catch (error) {
    throw new Error(error.stack);
  }
};

export const find = async ({
  pk,
  sk,
  FilterExpression,
  ExpressionAttributeValues,
  tableName,
  limit,
  lastEvaluatedKey = null,
  sort = "ASC",
}) => {
  let params = {
    TableName: tableName,
    ScanIndexForward: sort === "ASC" ? true : false,
  };

  if (limit) {
    params["Limit"] = limit;
  }

  if (lastEvaluatedKey) {
    params["ExclusiveStartKey"] = lastEvaluatedKey;
  }

  if (!pk) {
    const data = await documentClient.send(new ScanCommand(params));
    return data;
  }

  if (sk) {
    params["KeyConditionExpression"] = "pk = :pk AND sk = :sk";
    params["ExpressionAttributeValues"] = { ":pk": pk, ":sk": sk };
  } else {
    params["KeyConditionExpression"] = "pk = :pk";
    params["ExpressionAttributeValues"] = { ":pk": pk };
  }

  if (FilterExpression) {
    params = { ...params, FilterExpression };
  }

  if (ExpressionAttributeValues) {
    params["ExpressionAttributeValues"] = {
      ...params["ExpressionAttributeValues"],
      ...(ExpressionAttributeValues || {}),
    };
  }

  const data = await documentClient.send(new QueryCommand(params));
  return data;
};

export const findOne = async ({ pk, sk, tableName }) => {
  let params = {
    TableName: tableName,
    Key: {
      pk,
    },
  };

  try {
    if (sk) {
      params["Key"]["sk"] = sk;
    }

    const data = await documentClient.send(new GetCommand(params));
    return data.Item ? data.Item : {};
  } catch (error) {
    console.error(error, params);
    return null;
  }
};

export const updateOne = async ({ item, tableName, updateOnly = false }) => {
  if (updateOnly) {
    const currentData = await findOne({
      tableName,
      pk: item["pk"],
      ...(item["sk"] ? { sk: item["sk"] } : {}),
    });

    if (!currentData) {
      throw new Error("Data does not exists");
    }
  }

  const itemKeys = Object.keys(item).filter((k) => k !== "pk" && k !== "sk");
  let params = {
    TableName: tableName,
    UpdateExpression: `SET ${itemKeys
      .map((k, index) => `#field${index} = :value${index}`)
      .join(", ")}`,
    ExpressionAttributeNames: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`#field${index}`]: k,
      }),
      {}
    ),
    ExpressionAttributeValues: itemKeys.reduce(
      (accumulator, k, index) => ({
        ...accumulator,
        [`:value${index}`]: item[k],
      }),
      {}
    ),
    ReturnValues: "ALL_NEW",
  };
  try {
    params = {
      ...params,
      Key: {
        pk: item["pk"],
        ...(item.sk ? { sk: item["sk"] } : {}),
      },
    };

    const response = await documentClient.send(new UpdateCommand(params));
    return response;
  } catch (error) {
    console.error(error, { params }, { item });
    return null;
  }
};

export const findByIndex = async ({
  indexName,
  query,
  limit,
  tableName,
  lastEvaluatedKey = null,
  fromDate = null,
  toDate = null,
  range = null,
  FilterExpression,
  ExpressionAttributeValues,
  sort = "ASC",
}) => {
  const queryKeys = Object.keys(query);
  let params = {
    TableName: tableName,
    ScanIndexForward: sort === "ASC" ? true : false,
    KeyConditionExpression: `${queryKeys
      .map((k, index) => `${k} = :value${index}`)
      .join(" AND ")} ${
      fromDate ? `AND ${range} BETWEEN :fromDate AND :toDate` : ""
    }`,
    ExpressionAttributeValues: {
      ...queryKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`:value${index}`]: query[k],
        }),
        {}
      ),
      ...(fromDate ? { ":fromDate": fromDate, ":toDate": toDate } : {}),
    },
  };

  if (indexName) {
    params["IndexName"] = indexName;
  }

  if (limit) {
    params["Limit"] = limit;
  }

  if (lastEvaluatedKey) {
    params["ExclusiveStartKey"] = lastEvaluatedKey;
  }

  if (FilterExpression) {
    params["FilterExpression"] = FilterExpression;
  }

  if (ExpressionAttributeValues) {
    params["ExpressionAttributeValues"] = {
      ...params["ExpressionAttributeValues"],
      ...ExpressionAttributeValues,
    };
  }

  const data = await documentClient.send(new QueryCommand(params));
  return data;
};

export const countRecordsByIndex = async ({
  indexName,
  query,
  tableName,
  fromDate = null,
  toDate = null,
  range = null,
  FilterExpression,
  ExpressionAttributeValues,
}) => {
  const queryKeys = Object.keys(query);
  let params = {
    TableName: tableName,
    Select: "COUNT",
    KeyConditionExpression: `${queryKeys
      .map((k, index) => `${k} = :value${index}`)
      .join(" AND ")} ${
      fromDate ? `AND ${range} BETWEEN :fromDate AND :toDate` : ""
    }`,
    ExpressionAttributeValues: {
      ...queryKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`:value${index}`]: query[k],
        }),
        {}
      ),
      ...(fromDate ? { ":fromDate": fromDate, ":toDate": toDate } : {}),
    },
  };

  if (indexName) {
    params["IndexName"] = indexName;
  }

  if (FilterExpression) {
    params["FilterExpression"] = FilterExpression;
  }

  if (ExpressionAttributeValues) {
    params["ExpressionAttributeValues"] = {
      ...params["ExpressionAttributeValues"],
      ...ExpressionAttributeValues,
    };
  }

  try {
    const command = new QueryCommand(params);
    const response = await documentClient.send(command);
    return response.Count;
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
  }
};

export const findOneByIndex = async ({
  indexName,
  query,
  tableName,
  lastEvaluatedKey = null,
  fromDate = null,
  toDate = null,
  range = null,
  FilterExpression,
  ExpressionAttributeValues,
}) => {
  const data = await findByIndex({
    indexName,
    query,
    tableName,
    lastEvaluatedKey,
    fromDate,
    toDate,
    range,
    FilterExpression,
    ExpressionAttributeValues,
    limit: 1,
  });

  if (data.Items && data.Items.length > 0) {
    return data.Items[0];
  }

  return null;
};

export const findBetween = async ({
  pk,
  range,
  fromDate,
  toDate,
  tableName,
}) => {
  let params = {
    TableName: tableName,
    KeyConditionExpression: "pk = :pk AND #range BETWEEN :fromDate AND :toDate",
    ExpressionAttributeNames: {
      "#range": range,
    },
    ExpressionAttributeValues: {
      ":pk": pk,
      ":fromDate": fromDate,
      ":toDate": toDate,
    },
  };

  const data = await documentClient.send(new QueryCommand(params));
  return data;
};

export const deleteOne = async ({ pk, sk, tableName }) => {
  let params = {
    TableName: tableName,
    Key: {
      pk,
    },
  };

  if (sk) {
    params["Key"]["sk"] = sk;
  }

  const data = await documentClient.send(new DeleteCommand(params));
  return data;
};

export const genericQuery = async ({ params }) => {
  const data = await documentClient.send(new QueryCommand(params));
  return data;
};

export const removeAttributes = async ({ params }) => {
  await documentClient.send(new UpdateCommand(params));
};

export const batchWrite = async ({ params }) => {
  await documentClient.send(new BatchWriteCommand(params));
};
