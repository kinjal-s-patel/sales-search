
import * as React from "react";
import styles from "./salesform.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export interface ICsvSearchFormProps {
  context: WebPartContext;
}

interface SearchResult {
  person_name: string;
  person_email: string;
  person_location_state: string;
  person_location_city: string;
  person_location_country: string;
  person_title: string;
  person_functions: string;
  [key: string]: string; // Index signature
}

// interface PaginationInfo {
//   page: number;
//   pageSize: number;
//   total: number | string;
//   totalPages: number | string;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }

const UsaSearch : React.FC<ICsvSearchFormProps> = (props) => {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string>("");
    // pagination
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const rowsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const [seniorityOptions, setSeniorityOptions] = React.useState<string[]>([]);
  const [showOnlyWithEmail, setShowOnlyWithEmail] = React.useState(false);
const [showOnlyWithPhone, setShowOnlyWithPhone] = React.useState(false);

    const navigate = useNavigate();

  // fields
  const searchFields: Record<string, string> = {
    person_name: "Name",
    person_title: "Designation",
    person_functions: "Function",
    person_seniority: "Seniority",
    // person_linkdin_url : "Linkedin",
    person_location_city: "City",
    person_location_state: "State",
 
  };

  const displayFields: Record<string, string> = {
    person_name: "Full Name",
    person_title: "Designation",
    person_functions: "Functions",
    person_seniority: "Seniority",
    person_email: "Email",
    person_phone : "Phone",
    person_linkedin_url : "Linkedin",
    person_location_city: "City",
    person_location_state: "State",
    person_location_country: "Country",
  };

  React.useEffect(() => {
  const fetchSeniorityOptions = async () => {
    try {
      const res = await fetch(
        "https://apollodata-evckd5hbf3evdgg7.southindia-01.azurewebsites.net/api/suggestions?field=person_seniority"
      );
      if (!res.ok) throw new Error("Failed to load seniority options");
      const data = await res.json();
      setSeniorityOptions(data || []);
    } catch (err) {
      console.error("Error fetching seniority options:", err);
    }
  };

  fetchSeniorityOptions();
}, []);

  
  // fetch page from API (replaces results)
  const fetchPage = React.useCallback(
    async (page = 1, filters: Record<string, string> = {}) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", rowsPerPage.toString());

        Object.keys(filters).forEach((k) => {
          const v = filters[k];
          if (v && v.trim().length >= 2) params.append(k, v.trim());
        });

        // // update base URL if needed
        const res = await fetch(`http://localhost:3000/api/usa-users?${params.toString()}`);
        //  const res = await fetch(`https://apollodata-evckd5hbf3evdgg7.southindia-01.azurewebsites.net/api/users?${params.toString()}`);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();

        // assume API returns { data: [], pagination: { page, total, pageSize, totalPages } }
        setResults(data.data || []);
        // set total & current page from API if present, else infer
        if (data.pagination) {
          setCurrentPage(data.pagination.page ?? page);
          setTotalRows(Number(data.pagination.total ?? 0));
        } else {
          setCurrentPage(page);
          setTotalRows(Number(data.total ?? data.totalRows ?? 0));
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Fetch error");
        setResults([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

   // search triggered by button or Enter
  const handleSearch = () => {
    const hasValidQuery = Object.keys(query).some((key) => {
      const value = query[key];
      return value && value.trim().length >= 2;
    });

    if (!hasValidQuery) {
      setError("Please enter at least 2 characters in any search field");
      return;
    }

    setResults([]);
    setCurrentPage(1);
    setTotalRows(0);
    fetchPage(1, query);
  };

  const handleClear = () => {
    setQuery({});
    setResults([]);
    setCurrentPage(1);
    setTotalRows(0);
    setError("");
  };

 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setQuery((prev) => ({ ...prev, [name]: value }));
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchPage(page, query);
  };

const filteredResults = results.filter((row) => {
  if (showOnlyWithEmail && !row.person_email) return false;   // must have email
  if (showOnlyWithPhone && !row.person_phone) return false;   // must have phone
  return true;
});

  // ✅ Hide SharePoint UI
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #SuiteNavWrapper,
      #spSiteHeader,
      #spLeftNav,
      .spAppBar,
      .sp-appBar,
      .sp-appBar-mobile,
      div[data-automation-id="pageCommandBar"],
      div[data-automation-id="pageHeader"],
      div[data-automation-id="pageFooter"] {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        max-width: 100vw !important;
      }
      .ms-FocusZone {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
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
  {/* Logo */}
  <div className={styles.logo}>
    <img src={logo} alt="Logo" style={{ width: 120, height: "auto" }} />
  </div>

  {/* Title */}
  <div className={styles.titleBlock}>
    <h1>JMS Sales Data Dashboard</h1>
    <p>Quickly search sales data by region — India, USA, or Global.</p>
  </div>

  {/* Navigation Buttons */}
  <nav className={styles.navButtons}>
    <button onClick={() => navigate("/")} className={styles.navBtn}>Dashboard</button>
    <button onClick={() => navigate("/salesform")} className={styles.navBtn}>India Data</button>
    <button onClick={() => navigate("/globalsearch")} className={styles.navBtn}>Global Data</button>
  </nav>
</header>


   <div className={styles.card}>
          <h2 className={styles.cardTitle}>🔎 Search Keywords for USA </h2>
          {error && <div style={{ color: "#d32f2f", background: "#ffebee", padding: 10, borderRadius: 4 }}>{error}</div>}

          <div className={styles.form}>
            {Object.keys(searchFields).map((fieldKey) => (
  <div key={fieldKey}>
    {fieldKey === "person_seniority" ? (
  <select
  name={fieldKey}
  className={styles.input}   // ✅ same style as input
  value={query[fieldKey] || ""}
  onChange={handleInputChange}
>
  <option value="">{searchFields[fieldKey]}</option>
  {seniorityOptions.map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>

    ) : (
      <input
        name={fieldKey}
        placeholder={searchFields[fieldKey]}
        className={styles.input}
        value={query[fieldKey] || ""}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        autoComplete="off"
      />
    )}
  </div>
))}



            <div className={styles.buttonGroup}>
              <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>
                {loading ? "🔄 Searching..." : "🔍 Search"}
              </button>
              <button className={styles.clearBtn} onClick={handleClear} disabled={loading}>
                🗑️ Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
     <div className={styles.card}>
        <h3 className={styles.cardTitle}>
  📊 Results
  <div className={styles.filterCheckboxes}>
    <label>
      <input
        type="checkbox"
        checked={showOnlyWithEmail}
        onChange={() => setShowOnlyWithEmail((prev) => !prev)}
      />
      Email Only
    </label>
    <label>
      <input
        type="checkbox"
        checked={showOnlyWithPhone}
        onChange={() => setShowOnlyWithPhone((prev) => !prev)}
      />
      Phone Only
    </label>
  </div>
</h3>


          {loading ? (
            <p className={styles.noResults}>🔄 Loading...</p>
          ) : results.length === 0 ? (
            <p className={styles.noResults}>{Object.keys(query).length === 0 ? "Please enter a search filter and click Search." : "No records found."}</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    {Object.keys(displayFields).map((key) => <th key={key}>{displayFields[key]}</th>)}
                  </tr>
                </thead>
                <tbody>
               {filteredResults.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      {Object.keys(displayFields).map((key) => (
                        <td key={key}>
                          {key === "person_email" && row[key] ? <a href={`mailto:${row[key]}`} className={styles.emailLink}>{row[key]}</a> : (row[key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            <div className={styles.pagination}>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1 || loading}>◀ Prev</button>
                <span>Page {currentPage} of {totalPages} • {totalRows} total</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || loading}>Next ▶</button>
              </div>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
        © 2025 JMS Sales Data. All rights reserved.
      </footer>
      </div>
    </div>
  );
};

export default UsaSearch ;
