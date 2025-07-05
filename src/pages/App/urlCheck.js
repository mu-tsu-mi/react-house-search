const domainUrl = "domain.com.au";

export const validateNewUrls = (url) => {
  const newUrls = [url];

  // filter domain URLs only
  const validUrls = newUrls.filter((url) => url.includes(domainUrl));
  const invalidUrls = newUrls
    .filter((url) => !url.includes(domainUrl))
    .filter((url) => url !== "");

  const duplicationCheck = new Set(validUrls);
  // check duplication in the new urls
  const noDuplication = duplicationCheck.size === validUrls.length;
  return { invalidUrls, noDuplication, validUrls };
};
