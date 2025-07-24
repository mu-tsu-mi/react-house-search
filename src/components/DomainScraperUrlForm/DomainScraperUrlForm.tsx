import "./DomainScraperUrlForm.css";

export default function DomainScraperUrlForm({
  newUrl,
  handleUrlInput,
  handleAddUrls,
  errorMsg,
}) {
  return (
    <form className="urls-to-add" onSubmit={handleAddUrls}>
      <input
        type="url"
        placeholder="Add URL"
        value={newUrl}
        pattern=".*\.domain\.com\.au.*"
        onChange={handleUrlInput}
        className="url"
        required
      />
      <button type="submit" id="get-house-button">
        Get a new house
      </button>
      <span id="error-message" role="alert">
        {errorMsg}
      </span>
    </form>
  );
}
