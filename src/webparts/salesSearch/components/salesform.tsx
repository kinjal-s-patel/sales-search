// import * as React from "react";
// import styles from "./salesform.module.scss";
// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import logo from "../assets/logo.png";

// export interface ICsvSearchFormProps {
//   context: WebPartContext;
// }

// const normalizeKey = (key: string): string =>
//   key
//     ? key.toString().trim().replace(/\s+|\(|\)|-+/g, "_").replace(/^_+|_+$/g, "")
//     : key;

// const CsvSearchForm: React.FC<ICsvSearchFormProps> = (props) => {
//   // 🔹 State variables
//   const [results, setResults] = React.useState<any[]>([]);
//   const [loading, setLoading] = React.useState(false);
//   const [nextPage, setNextPage] = React.useState<number | null>(null);
//   const [prevPages, setPrevPages] = React.useState<number[]>([]);
//   const [query, setQuery] = React.useState<Record<string, string>>({});

//   // 🔹 Search and display fields
//   const searchFields: Record<string, string> = {
//     person_title: "Designation",
//     person_functions: "Function",
//     person_location_city: "City",
//     person_location_state: "State",
//     person_location_country: "Country",
//     person_seniority: "Seniority",
//   };

//   const formFields = React.useMemo(
//     () =>
//       Object.keys(searchFields).map((raw) => ({
//         raw,
//         key: normalizeKey(raw),
//         label: searchFields[raw],
//       })),
//     []
//   );

//   const displayFields: Record<string, string> = {
//     person_name: "Full Name",
//     person_first_name_unanalyzed: "First Name",
//     person_last_name_unanalyzed: "Last Name",
//     person_title: "Designation",
//     person_functions: "Functions",
//     person_seniority: "Seniority",
//     person_email: "Email",
//     person_phone: "Phone",
//     person_linkedin_url: "LinkedIn",
//     person_location_city: "City",
//     person_location_state: "State",
//     person_location_country: "Country",
//   };
// // 🔹 Fetch a page from /api/users
// // 🔹 Fetch a page from /api/users
// const fetchPage = async (page = 1) => {
//   setLoading(true);
//   try {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       pageSize: "50", // match backend limit
//       person_title: query.person_title || "",
//       person_functions: query.person_functions || "",
//       person_location_city: query.person_location_city || "",
//       person_location_state: query.person_location_state || "",
//       person_location_country: query.person_location_country || "",
//     });

//     // Call your Express backend API
//     const res = await fetch(`http://localhost:3000/api/users?${params.toString()}`);
//     if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

//     const data = await res.json();

//     setResults(data.data || []);

//     const totalPages = Math.ceil(data.total / data.pageSize);
//     setNextPage(page < totalPages ? page + 1 : null);

//   if (page > 1) {
//   setPrevPages((prev) => {
//     const lastPage = prev[prev.length - 1];
//     if (lastPage !== page - 1) {
//       return [...prev, page - 1];
//     }
//     return prev;
//   });
// }

//   } catch (err) {
//     console.error("Error fetching page:", err);
//   } finally {
//     setLoading(false);
//   }
// };


// // 🔎 Trigger search → fetch first page
// const handleSearch = () => {
//   setResults([]);
//   setPrevPages([]);
//   setNextPage(null);
//   fetchPage(1);
// };

// // 🔄 Clear filters
// const handleClear = () => {
//   setQuery({});
//   setResults([]);
//   setPrevPages([]);
//   setNextPage(null);
// };

// // 🔄 Pagination controls
// const handleNext = () => {
//   if (nextPage) fetchPage(nextPage);
// };

// const handlePrev = () => {
//   if (prevPages.length === 0) return;

//   const newPrev = [...prevPages];
//   const lastPage = newPrev.pop(); // previous page number
//   if (lastPage) fetchPage(lastPage);

//   setPrevPages(newPrev);
// };


//   // ✅ Hide SharePoint UI
//   React.useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       #SuiteNavWrapper,
//       #spSiteHeader,
//       #spLeftNav,
//       .spAppBar,
//       .sp-appBar,
//       .sp-appBar-mobile,
//       div[data-automation-id="pageCommandBar"],
//       div[data-automation-id="pageHeader"],
//       div[data-automation-id="pageFooter"] {
//         display: none !important;
//         height: 0 !important;
//         overflow: hidden !important;
//       }
//       html, body {
//         margin: 0 !important;
//         padding: 0 !important;
//         height: 100% !important;
//         width: 100% !important;
//         overflow: hidden !important;
//         background: #fff !important;
//       }
//       #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
//         width: 100vw !important;
//         height: 100vh !important;
//         margin: 0 !important;
//         padding: 0 !important;
//         overflow: hidden !important;
//         max-width: 100vw !important;
//       }
//       .ms-FocusZone {
//         overflow: hidden !important;
//       }
//     `;
//     document.head.appendChild(style);
//   }, []);

//   return (
//     <div
//       style={{
//         width: "100vw",
//         height: "100vh",
//         margin: 0,
//         padding: 0,
//         overflow: "auto",
//         backgroundColor: "#fff",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 9999,
//       }}
//     >
//       <div className={styles.pageWrapper}>
//         {/* Header */}
//         <header className={styles.header}>
//           <div className={styles.logo}>
//             <img src={logo} alt="Logo" style={{ width: 120, height: "auto" }} />
//           </div>
//           <div className={styles.titleBlock}>
//             <h1>Search Keywords</h1>
//             <p>Search Sales Data Easily</p>
//           </div>
//         </header>

//         {/* Form */}
//         <div className={styles.card}>
//           <h2 className={styles.cardTitle}>🔎 Search Keywords</h2>
//           <div className={styles.form}>
//             {formFields.map(({ key, label }) => (
//               <input
//                 key={key}
//                 name={key}
//                 placeholder={label}
//                 className={styles.input}
//                 value={query[key] || ""}
//                 onChange={(e) =>
//                   setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//                 }
//               />
//             ))}
//             <div className={styles.buttonGroup}>
//               <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>
//                 {loading ? "Searching..." : "Search"}
//               </button>
//               <button className={styles.clearBtn} onClick={handleClear} disabled={loading}>
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Results */}
//         <div className={styles.card}>
//           <h3 className={styles.cardTitle}>📊 Results</h3>
//           {results.length === 0 ? (
//             <p className={styles.noResults}>No records found.</p>
//           ) : (
//             <div className={styles.tableWrapper}>
//               <table className={styles.resultsTable}>
//                 <thead>
//                   <tr>
//                     {Object.keys(displayFields).map((key) => (
//                       <th key={key}>{displayFields[key]}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {results.map((row, idx) => (
//                     <tr key={idx}>
//                       {Object.keys(displayFields).map((key) => (
//                         <td key={key}>{String(row[key] || "")}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* Pagination */}
//               <div className={styles.pagination}>
//                 <button onClick={handlePrev} disabled={prevPages.length === 0}>
//                   ◀ Prev
//                 </button>
//                 <button onClick={handleNext} disabled={!nextPage}>
//                   Next ▶
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CsvSearchForm;


import * as React from "react";
import styles from "./salesform.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import logo from "../assets/logo.png";

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
  [key: string]: string; // Index signature for dynamic access
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number | string;
  totalPages: number | string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CsvSearchForm: React.FC<ICsvSearchFormProps> = (props) => {
  // 🔹 State variables
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<PaginationInfo | null>(null);
  const [query, setQuery] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string>("");
  const [suggestions, setSuggestions] = React.useState<Record<string, string[]>>({});
  
  // 🔹 Search and display fields
  const searchFields: Record<string, string> = {
    person_title: "Designation",
    person_functions: "Function", 
    person_location_city: "City",
    person_location_state: "State",
    person_location_country: "Country",
  };

  const displayFields: Record<string, string> = {
    person_name: "Full Name",
    person_title: "Designation",
    person_functions: "Functions",
    person_email: "Email",
    person_location_city: "City",
    person_location_state: "State",
    person_location_country: "Country",
  };

  // 🔹 Debounced suggestions fetch
const fetchSuggestions = React.useMemo(() => {
  const debounce = (func: (field: string, searchValue: string) => Promise<void>, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (field: string, searchValue: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(field, searchValue), wait);
    };
  };

  return debounce(async (field: string, searchValue: string) => {
    if (!searchValue || searchValue.length < 2) {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
      return;
    }

    try {
      // Call the existing /api/users endpoint with the field as query
      const params = new URLSearchParams();
      params.append(field, searchValue);

 const res = await fetch(`http://localhost:5000/api/users?${params.toString()}`);

      if (res.ok) {
        const data = await res.json();
        // Extract unique suggestions for this field
const uniqueSuggestions = Object.keys(
  data.data
    .reduce((acc: Record<string, boolean>, item: Record<string, any>) => {
      const val = item[field];
      if (typeof val === "string" && val.trim() !== "") {
        acc[val] = true;
      }
      return acc;
    }, {})
);

        setSuggestions(prev => ({ ...prev, [field]: uniqueSuggestions.slice(0, 10) }));
      } else {
        console.error(`Suggestions fetch failed: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  }, 300);
}, []);


  // 🔹 Optimized fetch function
  const fetchPage = async (page = 1) => {
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', '50');
      
      // Add query parameters that have valid values
      Object.keys(query).forEach(key => {
        const value = query[key];
        if (value && value.trim().length >= 2) {
          params.append(key, value.trim());
        }
      });

      const res = await fetch(`http://localhost:5000/api/users?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      
      setResults(data.data || []);
      setPagination(data.pagination);
      
    } catch (err) {
      console.error("Error fetching page:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Trigger search → fetch first page
  const handleSearch = () => {
    const hasValidQuery = Object.keys(query).some(key => {
      const value = query[key];
      return value && value.trim().length >= 2;
    });
    
    if (!hasValidQuery) {
      setError("Please enter at least 2 characters in any search field");
      return;
    }
    
    setResults([]);
    setPagination(null);
    setError("");
    fetchPage(1);
  };

  // 🔄 Clear filters
  const handleClear = () => {
    setQuery({});
    setResults([]);
    setPagination(null);
    setError("");
    setSuggestions({});
  };

  // 🔄 Pagination controls
  const handleNext = () => {
    if (pagination?.hasNextPage) {
      fetchPage(pagination.page + 1);
    }
  };

  const handlePrev = () => {
    if (pagination?.hasPrevPage) {
      fetchPage(pagination.page - 1);
    }
  };

  // 🔹 Handle input changes with suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuery(prev => ({ ...prev, [name]: value }));
    
    // Fetch suggestions for this field
    if (value.length >= 2) {
      fetchSuggestions(name, value);
    } else {
      setSuggestions(prev => ({ ...prev, [name]: [] }));
    }
  };

  // 🔹 Handle suggestion selection
  const handleSuggestionClick = (field: string, suggestion: string) => {
    setQuery(prev => ({ ...prev, [field]: suggestion }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
  };

  // 🔹 Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
          <div className={styles.logo}>
            <img src={logo} alt="Logo" style={{ width: 120, height: "auto" }} />
          </div>
          <div className={styles.titleBlock}>
            <h1>Search Keywords</h1>
            <p>Search Sales Data Easily</p>
          </div>
        </header>

        {/* Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🔎 Search Keywords</h2>
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              background: '#ffebee', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px' 
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <div className={styles.form}>
            {Object.keys(searchFields).map((fieldKey) => (
              <div key={fieldKey} style={{ position: 'relative' }}>
                <input
                  name={fieldKey}
                  placeholder={searchFields[fieldKey]}
                  className={styles.input}
                  value={query[fieldKey] || ""}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  autoComplete="off"
                />
                
                {/* Suggestions dropdown */}
                {suggestions[fieldKey] && suggestions[fieldKey].length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}>
                    {suggestions[fieldKey].slice(0, 10).map((suggestion: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                          (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                          (e.target as HTMLElement).style.backgroundColor = 'white';
                        }}
                        onClick={() => handleSuggestionClick(fieldKey, suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className={styles.buttonGroup}>
              <button 
                className={styles.searchBtn} 
                onClick={handleSearch} 
                disabled={loading}
              >
                {loading ? "🔄 Searching..." : "🔍 Search"}
              </button>
              <button 
                className={styles.clearBtn} 
                onClick={handleClear} 
                disabled={loading}
              >
                🗑️ Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            📊 Results
            {pagination && typeof pagination.totalPages === 'number' && (
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
                (Page {pagination.page} of {pagination.totalPages} • {pagination.total} total)
              </span>
            )}
          </h3>
          
          {results.length === 0 ? (
            <p className={styles.noResults}>
              {loading ? "🔄 Loading..." : "No records found. Try adjusting your search criteria."}
            </p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    {Object.keys(displayFields).map((key) => (
                      <th key={key}>{displayFields[key]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={`${row.person_email}-${idx}`}>
                      {Object.keys(displayFields).map((key) => (
                        <td key={key}>
                          {key === 'person_email' && row[key as keyof SearchResult] ? (
                            <a href={`mailto:${row[key as keyof SearchResult]}`} style={{ color: '#1976d2' }}>
                              {String(row[key as keyof SearchResult] || "")}
                            </a>
                          ) : (
                            String(row[key as keyof SearchResult] || "")
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Enhanced Pagination */}
              {pagination && (
                <div className={styles.pagination}>
                  <button 
                    onClick={handlePrev} 
                    disabled={!pagination.hasPrevPage || loading}
                    title="Previous page"
                  >
                    ◀ Prev
                  </button>
                  
                  <span style={{ 
                    margin: '0 15px', 
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    Page {pagination.page}
                    {typeof pagination.totalPages === 'number' && ` of ${pagination.totalPages}`}
                  </span>
                  
                  <button 
                    onClick={handleNext} 
                    disabled={!pagination.hasNextPage || loading}
                    title="Next page"
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvSearchForm;