import "./DomainScraperUrlForm.css";

export default function DomainScraperUrlForm({
  newUrl,
  handleUrlInput,
  handleAddUrls,
  errorMsg,
}) {
  return (
    <form type="submit" className="urls-to-add">
      <input
        type="url"
        placeholder="Add URL"
        value={newUrl}
        pattern=".*\.domain\.com\.au.*"
        onChange={handleUrlInput}
        className="url"
        required
      />
      <button type="submit" id="get-house-button" onClick={handleAddUrls}>
        Get a new house
      </button>
      <span id="error-message" role="alert">
        {errorMsg}
      </span>
    </form>
  );
}
