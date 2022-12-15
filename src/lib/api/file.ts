import { getMimeType } from "#lib/utils";
import { Schemas } from ".";
import { createAPIFunction } from "./connection";

const getUploadUrl = createAPIFunction<
  void,
  Schemas["S3UploadDto"],
  { mimeType: string; folderName: string }
>("GET", "/api/user/s3-upload-url");
const uploadFile = async (file: File, folderName: string) => {
  const fileMimeType = getMimeType(file.type);
  const fileName = file.name;
  const response = await getUploadUrl(
    {
      query: { folderName, mimeType: fileMimeType },
    },
    null
  );
  const uploadUrl = response.data?.s3UploadUrl!;
  const fileUrl = uploadUrl.split("?")[0];
  const fileLocation = `${folderName}${fileUrl.split(folderName)[1]}`;

  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  return { fileMimeType, fileName, fileLocation };
};

export { uploadFile };
