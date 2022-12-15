const darkModeActive = (): boolean => {
  return document.documentElement.classList.contains("dark");
};
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
const randomString = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersCount = characters.length;

  let result = "";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersCount));
  }
  return result;
};
const randomColor = () => {
  const result = Math.floor(Math.random() * 16777215).toString(16);

  if (result.length === 6) {
    return result;
  }
  return "9ca3af";
};
const generateAvatarUrl = () => {
  return `https://avatars.dicebear.com/api/initials/${randomString(
    2
  )}.svg?b=%23${randomColor()}`;
};
const getMimeType = (type: string): string => {
  switch (type) {
    case "image/jpeg":
      return "jpeg";

    case "image/jpg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/svg+xml":
      return "svg";

    case "image/webp":
      return "webp";

    case "image/gif":
      return "gif";

    case "application/pdf":
      return "pdf";

    default:
      return "unsupported";
  }
};

export { darkModeActive, wait, generateAvatarUrl, getMimeType };
