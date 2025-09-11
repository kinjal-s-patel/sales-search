import * as React from "react";
import * as XLSX from "xlsx";
import styles from "./salesform.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import logo from "../assets/logo.png";

// PnP SP
import { spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/files";

export interface ICsvSearchFormProps {
  context: WebPartContext;
}

// normalization helper
const normalizeKey = (key: string): string =>
  key
    ? key
        .toString()
        .trim()
        .replace(/\s+|\(|\)|-+/g, "_")
        .replace(/^_+|_+$/g, "")
    : key;

const CsvSearchForm: React.FC<ICsvSearchFormProps> = ({ context }) => {
  const [data, setData] = React.useState<any[]>([]);
  const [results, setResults] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const rowsPerPage = 20;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = results.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(results.length / rowsPerPage));

  // SP init
  const sp = React.useMemo(() => spfi().using(SPFx(context)), [context]);

  // Load Excel/CSV from SharePoint
  React.useEffect(() => {
    const loadFile = async () => {
      try {
        const filePath = "/sites/salesdata/Shared Documents/apollo data.csv";

        const blob = await sp.web.getFileByServerRelativePath(filePath).getBlob();
        const buffer = await blob.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: "" });
        if (!rows || rows.length < 2) {
          setData([]);
          return;
        }

        const rawHeaders = rows[0] as string[];
        const normalizedHeaders = rawHeaders.map((h) => normalizeKey(String(h || "")));

        const dataRows = rows.slice(1);
        const formatted = dataRows.map((r) =>
          normalizedHeaders.reduce((acc, h, i) => {
            acc[h] = r[i] ?? "";
            return acc;
          }, {} as Record<string, any>)
        );

        setData(formatted);
        console.log(`Parsed ${formatted.length} rows with ${normalizedHeaders.length} headers`);
      } catch (err) {
        console.error("Error fetching CSV file:", err);
        setData([]);
      }
    };

    loadFile();
  }, [sp]);

  // Fields for search
  const searchFields: Record<string, string> = {
    person_title: "Designation",
    person_detailed_function: "Function",
    person_email: "Email",
    person_location_city: "City",
    person_location_state: "State",
    person_location_country: "Country",
    person_seniority: "Seniority",
  };

  const formFields = React.useMemo(
    () =>
      Object.entries(searchFields).map(([raw, label]) => {
        const key = normalizeKey(raw);
        return { raw, key, label };
      }),
    []
  );

  // Fields for result display
  const displayFields: Record<string, string> = {
    person_name: "Full Name",
    person_first_name_unanalyzed: "First Name",
    person_last_name_unanalyzed: "Last Name",
    person_title: "Designation",
    person_functions: "Functions",
    person_seniority: "Seniority",
    person_email: "Email",
    person_phone: "Phone",
    person_linkedin_url: "LinkedIn",
    person_location_city: "City",
    person_location_state: "State",
    person_location_country: "Country",
  };

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Search
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const filtered = data.filter((row) =>
          Object.entries(query).every(([k, v]) => {
            if (!v || v.toString().trim() === "") return true;
            const cell = row?.[k];
            const text =
              cell === null || cell === undefined
                ? ""
                : typeof cell === "object"
                ? JSON.stringify(cell)
                : String(cell);
            return text.toLowerCase().includes(v.toLowerCase());
          })
        );
        setResults(filtered);
        setCurrentPage(1);
      } catch (e) {
        console.error("Search error:", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  // Clear
  const handleClear = () => {
    setQuery({});
    setResults([]);
    setCurrentPage(1);
  };

  // Hide SharePoint chrome
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #SuiteNavWrapper,#spSiteHeader,#spLeftNav,.spAppBar,.sp-appBar,.sp-appBar-mobile,
      div[data-automation-id="pageCommandBar"],div[data-automation-id="pageHeader"],
      div[data-automation-id="pageFooter"]{display:none!important;height:0!important;overflow:hidden!important}
      html,body{margin:0!important;padding:0!important;height:100% !important;width:100% !important;overflow:hidden!important;background:#fff!important}
      #spPageCanvasContent,.CanvasComponent,.CanvasZone,.CanvasSection,.control-zone{width:100vw!important;height:100vh!important;margin:0!important;padding:0!important;overflow:hidden!important;max-width:100vw!important}
      .ms-FocusZone{overflow:hidden!important}
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
       <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "auto",
        backgroundColor: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" style={{ width: "120px", height: "auto" }} />
        </div>
        <div className={styles.titleBlock}>
          <h1>Search Keywords</h1>
          <p>Search Sales Data Easily</p>
        </div>
      </header>

      {/* Form */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🔎 Search Keywords</h2>
        <div className={styles.form}>
          {formFields.map(({ key, label }) => (
            <input
              key={key}
              name={key}
              placeholder={label}
              className={styles.input}
              value={query[key] || ""}
              onChange={handleChange}
            />
          ))}

          <div className={styles.buttonGroup}>
            <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>
              {loading ? <span className={styles.loading}></span> : "Search"}
            </button>
            <button className={styles.clearBtn} onClick={handleClear} disabled={loading}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>📊 Results</h3>
        {results.length === 0 ? (
          <p className={styles.noResults}>No records found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  {Object.entries(displayFields).map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(displayFields).map((key) => (
                      <td key={key}>
                        {Array.isArray(row[key]) ? row[key].join(", ") : String(row[key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ◀ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>© 2025 Sales Search. All rights reserved.</footer>
    </div>
    </div>
  );
};

export default CsvSearchForm;
