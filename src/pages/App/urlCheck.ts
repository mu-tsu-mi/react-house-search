const domainUrl = "domain.com.au";

export const validateNewUrls = (url: string) => {
  const newUrls = [url];

  // filter domain URLs only
  const validUrls = newUrls.filter((url) => url.includes(domainUrl));
  const invalidUrls = newUrls
    .filter((url) => !url.includes(domainUrl))
    .filter((url) => url !== "");

  const duplicationCheck = new Set(validUrls);
  // check duplication in the new urls
  const hasDuplication = duplicationCheck.size !== validUrls.length;
  return { invalidUrls, hasDuplication, validUrls };
};
