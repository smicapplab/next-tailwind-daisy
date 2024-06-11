import axios from "axios";

const postApi = async (url, data) => {
  console.log('url', `${process.env.NEXT_PUBLIC_URL}/api/${url}`);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/${url}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.data.success && res.data.error == "Unauthorized") {
    await postApi("auth/do-logout");
    throw "Unauthorized";
  }

  return res.data;
};

const getApi = async (url) => {  
  const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export { getApi, postApi };
